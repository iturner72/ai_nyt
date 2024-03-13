use actix_web::{get, web, HttpResponse, Responder};
use reqwest::Client;
use std::collections::HashMap;
use std::env;

#[derive(serde::Deserialize)]
struct UserDataParams {
    fid: u64,
    user_data_type: Option<String>,
}

#[get("/userNameProofsByFid/{fid}")]
async fn get_username_proofs_by_fid(fid: web::Path<u64>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let url = format!("{}:2281/v1/userNameProofsByFid?fid={}", hubble_url, fid.into_inner());
    fetch_and_respond(url).await
}

#[get("/userDataByFid")]
async fn get_user_data_by_fid(params: web::Query<UserDataParams>) -> impl Responder {
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let mut url = format!("{}:2281/v1/userDataByFid?fid={}", hubble_url, params.fid);
    if let Some(ref data_type) = params.user_data_type {
        url.push_str(&format!("&user_data_type={}", data_type));
    } fetch_and_respond(url).await
}

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

#[get("/channels")]
async fn get_channels() -> impl Responder {
    let warpcast_url = env::var("WARPCAST_URL").expect("WARPCAST_URL must be set");
    let url = format!("{}all-channels", warpcast_url);
    fetch_and_respond(url).await
}

#[get("/castsByChannel/{channel}")]
async fn get_casts_by_parent(
    channel: web::Path<String>,
    query: web::Query<HashMap<String, u64>>,
) -> impl Responder {
    log::info!("Fetching Casts by Channel");
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");
    let channel_url = channel.into_inner();

    let page = query.get("page").cloned().unwrap_or(1);
    let limit = query.get("limit").cloned().unwrap_or(40);
    
    let offset = (page - 1) * limit;

    let url = format!(
        "{}:2281/v1/castsByParent?url={}&offset={}&limit={}",
        hubble_url, channel_url, offset, limit
    );

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
