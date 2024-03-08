use actix_web::{get, web, HttpResponse, Responder};
use reqwest::Client;
use std::env;

#[get("/castById/{fid}/{hash}")]
async fn get_cast_by_id(info: web::Path<(u64, String)>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");

    let (fid, hash) = info.into_inner();
    let url = format!("{}:2281/v1/castById?fid={}&hash={}", hubble_url, fid, hash);
    fetch_and_respond(url).await
}

#[get("/castsByFid/{fid}")]
async fn get_casts_by_fid(fid: web::Path<u64>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");

    let url = format!("{}:2281/v1/castsByFid?fid={}", hubble_url, fid.into_inner());
    fetch_and_respond(url).await
}

#[get("/castsByChannel/{channel}")]
async fn get_casts_by_parent(channel: web::Path<String>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let url = format!("{}:2281/v1/castsByParent?url={}", hubble_url, channel.into_inner());
    fetch_and_respond(url).await
}

#[get("/castsByMention/{fid}")]
async fn get_casts_by_mention(fid: web::Path<u64>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let url = format!("{}:2281/v1/castsByMention?fid={}", hubble_url, fid.into_inner());
    fetch_and_respond(url).await
}

async fn fetch_and_respond(url: String) -> impl Responder {
    let client = Client::new();
    match client.get(&url).send().await {
        Ok(response) if response.status().is_success() => {
            match response.json::<serde_json::Value>().await {
                Ok(json) => HttpResponse::Ok().json(json),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        }
        _ => HttpResponse::InternalServerError().finish(),
    }
}
