use actix_web::{post, web, HttpResponse, Responder};
use blake3;
use ed25519_dalek::{PublicKey, Signature};
use hex::decode;
use message::{CastAddBody, FarcasterNetwork, MessageData, HashScheme, Message, MessageType, SignatureScheme};
use prost::Message as ProstMessage;
use reqwest::Client;
use serde::Deserialize;
use std::env;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::message;
use crate::username_proof;

const FARCASTER_EPOCH: u64 = 1609459200;

#[derive(Deserialize)]
struct CastSubmission {
    cast_add_body: CastAddBody,
    signature_hex: String,
    public_key_hex: String,
}

#[post("/submitCast")]
async fn submit_cast(body: web::Json<CastSubmission>) -> impl Responder {
    let CastSubmission {
        cast_add_body,
        signature_hex,
        public_key_hex,
    } = body.into_inner();

    let fid = 249222;
    let network = FarcasterNetwork::FarcasterNetworkMainnet as i32;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
        .checked_sub(FARCASTER_EPOCH)
        .expect("Invalid timestamp") as u32;

    let mut msg_data = MessageData {
        r#type: MessageType::MessageTypeCastAdd as i32,
        fid,
        timestamp,
        network,
        body: Some(message::message_data::Body::CastAddBody(cast_add_body)),
    };

    // Serialize MessageData
    let mut msg_data_bytes = Vec::new(); 
    msg_data.encode(&mut msg_data_bytes).unwrap();

    // Hash MessageData
    let hash_bytes = blake3::hash(&msg_data_bytes).as_bytes()[..20].to_vec(); 

    let signature_bytes = decode(&signature_hex).expect("Failed to decode hex signature");
    let public_key_bytes = decode(&public_key_hex).expect("Failed to decode hex public key");

    // Create ed25519_dalek signature and public key types from decoded bytes
    let signature = Signature::from_bytes(&signature_bytes).expect("Invalid signature format");
    let public_key = PublicKey::from_bytes(&public_key_bytes).expect("Invalid public key format");

    let message = Message {
        data: Some(msg_data),
        hash: hash_bytes,
        hash_scheme: HashScheme::HashSchemeBlake3 as i32,
        signature: signature.to_bytes().to_vec(),
        signature_scheme: SignatureScheme::SignatureSchemeEd25519 as i32,
        signer: public_key.to_bytes().to_vec(), 
    };

    let mut buf = Vec::new();
    message.encode(&mut buf).expect("Message encoding failed");

    let client = Client::new();

    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let mut url = format!("{}:2281/v1/submitMessage", hubble_url);

    let res = client
        .post(url)
        .header("Content-Type", "application/octet-stream")
        .body(buf)
        .send()
        .await;

    match response {
        Ok(res) if res.status().is_success() => HttpResponse::Ok().json("Cast sumbitted successfully"),
        Ok(res) => HttpResponse::BadRequest().body(format!("Failed to send the message. HTTP status: {}", res.status())),
        Err(err) => HttpResponse::InternalServerError().body(format!("HTTP request failed: {}", err)),
    }
}

