use actix_web::{post, web, HttpResponse, Responder};
use blake3;
use ed25519_dalek::Signature;
use message::{CastAddBody, FarcasterNetwork, MessageData, HashScheme, Message, MessageType, SignatureScheme};
use protobuf::Message as ProtobufMessage;
use reqwest::Client;
use serde::Deserialize;
use std::env;
use std::time::{SystemTime, UNIX_EPOCH};

use log::{debug, error};

use crate::message;

const FARCASTER_EPOCH: u64 = 1609459200;

#[derive(Deserialize, PartialEq, Clone, Default, Debug)]
struct CastSubmission {
    cast_add_body_bytes: Vec<u8>,
    signature_hex: String,
    public_key_hex: String,
    fid: u64,
}

#[post("/submitCast")]
async fn submit_cast(body: web::Json<CastSubmission>) -> impl Responder {
    let CastSubmission {
        cast_add_body_bytes,
        signature_hex,
        public_key_hex,
        fid,
    } = body.into_inner();

    debug!("Extracted Ethereum address: {}", public_key_hex);

    let cast_add_body = match CastAddBody::parse_from_bytes(&cast_add_body_bytes) {
        Ok(body) => body,
        Err(err) => return HttpResponse::BadRequest().body(format!("Failed to parse CastAddBody: {}", err)),
    };

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
        .checked_sub(FARCASTER_EPOCH)
        .expect("Invalid timestamp") as u32;

    let msg_data = MessageData {
        type_: MessageType::MESSAGE_TYPE_CAST_ADD.into(),
        fid,
        timestamp,
        network: FarcasterNetwork::FARCASTER_NETWORK_MAINNET.into(),
        body: Some(message::message_data::Body::CastAddBody(cast_add_body)),
        special_fields: ::protobuf::SpecialFields::new(),
    };

    // Serialize MessageData
    let msg_data_bytes = msg_data.write_to_bytes().unwrap();

    // Hash MessageData
    let hash_bytes = blake3::hash(&msg_data_bytes).as_bytes()[..20].to_vec(); 

    debug!("Signature hex: {}", signature_hex);
    debug!("Public key hex: {}", public_key_hex);

    let signature_hex = signature_hex.trim();
    let public_key_hex = public_key_hex.trim();

    let signature_bytes = hex::decode(&signature_hex).expect("Failed to decode hex signature");
    let public_key_bytes = hex::decode(&public_key_hex).expect("Failed to decode hex public key");

    debug!("Signature bytes: {:?}", signature_bytes);
    debug!("Public key bytes: {:?}", public_key_bytes);

    let signature = match Signature::try_from(&signature_bytes[..]) {
        Ok(sig) => {
            debug!("Signature: {:?}", sig);
            sig
        }
        Err(err) => {
            error!("Invalid signature: {}", err);
            return HttpResponse::BadRequest().body(format!("Invalid signature: {}", err));
        }
    };
    
    let verifying_key = match ed25519_dalek::VerifyingKey::try_from(&public_key_bytes[..]) {
        Ok(key) => {
            debug!("Verifying key: {:?}", key);
            key
        }
        Err(err) => {
            error!("Invalid public key: {}", err);
            return HttpResponse::BadRequest().body(format!("Invalid public key: {}", err));
        }
    };


    let message = Message {
        data: Some(msg_data).into(),
        hash: hash_bytes,
        hash_scheme: ::protobuf::EnumOrUnknown::from(HashScheme::HASH_SCHEME_BLAKE3),
        signature: signature.to_bytes().to_vec(),
        signature_scheme: ::protobuf::EnumOrUnknown::from(SignatureScheme::SIGNATURE_SCHEME_ED25519), 
        signer: verifying_key.to_bytes().to_vec(), 
        data_bytes: None,
        special_fields: ::protobuf::SpecialFields::new(),
    };

    debug!("Message: {:?}", message);

    let buf = message.write_to_bytes().unwrap();

    let client = Client::new();
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let url = format!("{}:2281/v1/submitMessage", hubble_url);

    debug!("Submitting message to: {}", url);

    let res = client
        .post(url)
        .header("Content-Type", "application/octet-stream")
        .body(buf)
        .send()
        .await;

    match res {
        Ok(res) if res.status().is_success() => {
            debug!("Cast submitted successfully");
            HttpResponse::Ok().json("Cast submitted successfully")
        }
        Ok(res) => {
            error!("Failed to send the message. HTTP status: {}", res.status());
            HttpResponse::BadRequest().body(format!("Failed to send the message. HTTP status: {}", res.status()))
        }
        Err(err) => {
            error!("HTTP request failed: {}", err);
            HttpResponse::InternalServerError().body(format!("HTTP request failed: {}", err))
        }
    }
}

