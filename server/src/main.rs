use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};
use dotenv::dotenv;
use std::env;

use env_logger::Env;

mod models;
mod hubble;
mod openai;
mod anthropic;
mod submit_cast;
mod message;
mod username_proof;

#[get("/")]
async fn index() -> impl Responder {
    "Welcome to the Farcaster API!"
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("debug"));

    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8081".to_string());
    let server_address = format!("{}:{}", server_host, server_port);

    let app_private_key_hex = env::var("APP_PRIVATE_KEY").expect("APP_PRIVATE_KEY must be set");
    let app_fid = env::var("APP_FID")
        .expect("APP_FID must be set")
        .parse::<u64>()
        .expect("Invalid APP_FID");

    let app_data = submit_cast::AppData::new(&app_private_key_hex, app_fid);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();


        App::new()
            .wrap(cors)
            .app_data(web::Data::new(app_data.clone()))
            .service(index)
            .service(hubble::get_username_proofs_by_fid)
            .service(hubble::get_user_data_by_fid)
            .service(hubble::get_cast_by_id)
            .service(hubble::get_casts_by_fid)
            .service(hubble::get_casts_by_parent)
            .service(hubble::get_casts_by_mention)
            .service(hubble::get_channels)
            .service(submit_cast::submit_cast)
            .service(openai::generate_chat)
            .service(anthropic::generate_chat_anthropic)
    })
    .bind(server_address)?
    .run()
    .await
}
