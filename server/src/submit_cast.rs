use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use actix_web::{post, web, HttpResponse, Responder};
use blake3;
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signer, SigningKey};
use prost::Message as ProstMessage;
use hex::FromHex;
use protobuf::Message as ProtobufMessage;
use reqwest::Client;

use crate::message;
use crate::username_proof;

use message::{CastAddBody, FarcasterNetwork, MessageData, HashScheme, Message, MessageType, SignatureScheme};

const FARCASTER_EPOCH: u64 = 1609459200;

#[post("/submitCast")]
async fn submit_cast(body: web::Json<CastAddBody>) -> impl Responder {
    let fid = 249222;
    let network = FarcasterNetwork::FARCASTER_NETWORK_MAINNET;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
        .checked_sub(FARCASTER_EPOCH)
        .expect("Invalid timestamp") as u32;

    let mut cast_add = CastAddBody {
      ..Default::default()
    };

    let mut msg_data = MessageData {
        type_: MessageType::MessageTypeCastAdd as i32,
        fid,
        timestamp,
        network,
        body: Some(message::Body::CastAddBody(cast_add)),
    };

    // Serialize MessageData
    let mut msg_data_bytes = vec![];
    msg_data.encode(&mut msg_data_bytes).unwrap();

    // Hash MessageData
    let hash = blake3::hash(&msg_data_bytes);
    let hash_bytes = hash.as_bytes()[..20].to_vec();


    // TODO Signature and singer logic

    let message = Message {
        data: Some(msg_data),
        hash: hash_bytes,
        hash_scheme: HashScheme::HashSchemeBlake3 as i32,
        signature: signature.to_bytes().to_vec(),
        signature_scheme: SignatureScheme::SignatureSchemeEd25519 as i32,
        signer: keypair.public.to_bytes().to_vec(),
        ..Default::default()
    };

    HttpResponse::Ok().json(message)
}
