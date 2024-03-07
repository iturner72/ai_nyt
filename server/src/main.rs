use actix_cors::Cors;
use reqwest::Client;
use actix_web::HttpResponse;
use actix_web::{get, web, App, HttpServer, Responder};
mod models;
use dotenv::dotenv;
use std::env;

#[get("/")]
async fn index() -> impl Responder {
    "Welcome to the Farcaster API!"
}

#[get("/castById/{fid}/{hash}")]
async fn get_cast_by_id(info: web::Path<(u64, String)>) -> impl Responder {
    dotenv().ok();
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");

    let (fid, hash) = info.into_inner();
    let url = format!("{}:2281/v1/castById?fid={}&hash={}", hubble_url, fid, hash);
    fetch_and_respond(url).await
}

#[get("/castsByFid/{fid}")]
async fn get_casts_by_fid(fid: web::Path<u64>) -> impl Responder {
    dotenv().ok();
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");

    let url = format!("{}:2281/v1/castsByFid?fid={}", hubble_url, fid.into_inner());
    fetch_and_respond(url).await
}

#[get("/castsByParent/{fid}/{hash}")]
async fn get_casts_by_parent(info: web::Path<(u64, String)>) -> impl Responder {
    dotenv().ok();
    let hubble_url = env::var("HUBBLE_URL").expect("HUBBLE_URL must be set");

    let (fid, hash) = info.into_inner();
    let url = format!("{}:2281/v1/castsByParent?fid={}&hash={}", hubble_url, fid, hash);
    fetch_and_respond(url).await
}

#[get("/castsByMention/{fid}")]
async fn get_casts_by_mention(fid: web::Path<u64>) -> impl Responder {
    dotenv().ok();
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8080".to_string());
    let server_address = format!("{}:{}", server_host, server_port);

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();


        App::new()
            .wrap(cors)
            .service(index)
            .service(get_cast_by_id)
            .service(get_casts_by_fid)
            .service(get_casts_by_parent)
            .service(get_casts_by_mention)
    })
    .bind(server_address)?
    .run()
    .await
}
