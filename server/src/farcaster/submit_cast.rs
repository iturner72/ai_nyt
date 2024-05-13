use actix_web::{post, web, HttpResponse, Responder};
use blake3;
use ed25519_dalek::{Signature, VerifyingKey, SigningKey, Signer, Verifier, SecretKey};
use crate::farcaster::message::{
    CastAddBody, FarcasterNetwork, MessageData, HashScheme, Message, MessageType, SignatureScheme,
    message_data,
};
use protobuf::{EnumOrUnknown, Message as ProtobufMessage, MessageField};
use reqwest::Client;
use serde::Deserialize;
use std::env;
use std::time::{SystemTime, UNIX_EPOCH};

use log::{debug, error};

const FARCASTER_EPOCH: u64 = 1609459200;

#[derive(Deserialize, PartialEq, Clone, Debug)]
struct CastSubmission {
    cast_add_body_bytes: Vec<u8>,
    user_signature_hex: String,
    user_public_key_hex: String,
    user_authorization: String,
    fid: u64,
}

#[post("/submitCast")]
async fn submit_cast(
    body: web::Json<CastSubmission>,
    app_data: web::Data<AppData>,
) -> Result<impl Responder, actix_web::error::Error> {
    let CastSubmission {
        cast_add_body_bytes,
        user_signature_hex,
        user_public_key_hex,
        user_authorization,
        fid,
    } = body.into_inner();

    debug!("Extracted user public key: {}", user_public_key_hex);

    let user_public_key_bytes = hex::decode(&user_public_key_hex).map_err(|err| {
        error!("Failed to decode user public key: {}", err);
        actix_web::error::ErrorBadRequest(err.to_string())
    })?;

    let user_verifying_key = VerifyingKey::try_from(&user_public_key_bytes[..]).map_err(|err| {
        error!("Invalid user public key: {}", err);
        actix_web::error::ErrorBadRequest(err.to_string())
    })?;

    if !verify_user_authorization(&user_verifying_key, &user_authorization, &user_signature_hex) {
        return Ok(HttpResponse::Unauthorized().body("User authorization is invalid"));
    }

    let cast_add_body = CastAddBody::parse_from_bytes(&cast_add_body_bytes).map_err(|err| {
        error!("Failed to parse CastAddBody: {}", err);
        actix_web::error::ErrorBadRequest(err.to_string())
    })?;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
        .checked_sub(FARCASTER_EPOCH)
        .expect("Invalid timestamp") as u32;

    let msg_data = MessageData {
        type_: EnumOrUnknown::new(MessageType::MESSAGE_TYPE_CAST_ADD),
        fid,
        timestamp,
        network: EnumOrUnknown::new(FarcasterNetwork::FARCASTER_NETWORK_MAINNET),
        body: Some(message_data::Body::CastAddBody(cast_add_body)),
        special_fields: ::protobuf::SpecialFields::new(),
    };

    // Serialize MessageData
    let msg_data_bytes = msg_data.write_to_bytes().unwrap();

    // Hash MessageData
    let hash_bytes = blake3::hash(&msg_data_bytes).as_bytes()[..20].to_vec();

    let mut msg = Message::new();
    msg.data = MessageField::some(msg_data); 
    msg.hash = hash_bytes.clone();
    msg.hash_scheme = EnumOrUnknown::new(HashScheme::HASH_SCHEME_BLAKE3);

    // Sign the message with the application's private key
    let app_private_key = app_data.private_key.clone();
    let signature = app_private_key.sign(&hash_bytes).to_bytes();
    msg.signature_scheme = EnumOrUnknown::new(SignatureScheme::SIGNATURE_SCHEME_ED25519);
    msg.signature = signature.to_vec();
    msg.signer = app_private_key.verifying_key().to_bytes().to_vec();

    // Serialize the message
    let msg_bytes = msg.write_to_bytes().unwrap();

    // Finally, submit the message to the network along with the user's public key and authorization
    let client = Client::new();
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let url = format!("{}:2281/v1/submitMessage", hubble_url);

    debug!("Submitting message to: {}", url);

    let res = client
        .post(url)
        .header("Content-Type", "application/octet-stream")
        .header("User-Public-Key", user_public_key_hex)
        .header("User-Authorization", user_authorization)
        .body(msg_bytes)
        .send()
        .await;

    match res {
        Ok(res) if res.status().is_success() => {
            debug!("Cast submitted successfully");
            Ok(HttpResponse::Ok().json("Cast submitted successfully"))
        }
        Ok(res) => {
            error!("Failed to send the message. HTTP status: {}", res.status());
            Ok(HttpResponse::BadRequest().body(format!("Failed to send the message. HTTP status: {}", res.status())))
        }
        Err(err) => {
            error!("HTTP request failed: {}", err);
            Err(actix_web::error::ErrorInternalServerError(err.to_string()))
        }
    }
}

fn verify_user_authorization(
    user_verifying_key: &VerifyingKey,
    user_authorization: &str,
    user_signature_hex: &str,
) -> bool {
    let user_signature_bytes = hex::decode(user_signature_hex).expect("Failed to decode hex signature");
    let user_signature = Signature::try_from(&user_signature_bytes[..]).expect("Invalid signature");

    user_verifying_key
        .verify(&user_authorization.as_bytes(), &user_signature)
        .is_ok()
}

#[derive(Clone)]
pub struct AppData {
    pub private_key: SigningKey,
    pub fid: u64,
}

impl AppData {
    pub fn new(private_key_hex: &str, fid: u64) -> Self {
        let private_key_bytes = hex::decode(private_key_hex)
            .expect("Failed to decode private key hex");

        let private_key_array: [u8; 32] = private_key_bytes.try_into()
            .expect("Private key bytes must be 32 bytes long");

        let secret_key = SecretKey::from(private_key_array);

        let signing_key = SigningKey::from(&secret_key);

        Self { private_key: signing_key, fid }
    }
}
