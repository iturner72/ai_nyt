use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};
use dotenv::dotenv;
use std::env;
use key_gateway::KeyGateway;
use serde::Deserialize;
use web3::types::{Address, U256};
use env_logger::Env;
use diesel::pg::PgConnection;
use diesel::r2d2::{self, ConnectionManager};

type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

mod models;
mod schema;
mod db;
mod hubble;
mod openai;
mod anthropic;
mod submit_cast;
mod message;
mod username_proof;
mod key_gateway;

use crate::db::create_article;
use crate::models::Article;

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
    let key_gateway = KeyGateway::new("http://localhost:8545", "0x123...abc");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(app_data.clone()))
            .app_data(web::Data::new(key_gateway.clone()))
            .configure(configure_services)
            .service(index)
            .service(hubble::get_username_proofs_by_fid)
            .service(hubble::get_user_data_by_fid)
            .service(hubble::get_cast_by_id)
            .service(hubble::get_casts_by_fid)
            .service(hubble::get_casts_by_parent)
            .service(hubble::get_casts_by_mention)
            .service(hubble::get_channels)
            .service(hubble::get_reactions_by_cast)
            .service(submit_cast::submit_cast)
            .service(openai::generate_chat)
            .service(anthropic::generate_chat_anthropic)
            .service(web::resource("/create-article").route(web::post().to(create_article_handler)))
    })
    .bind(server_address)?
    .run()
    .await
}

fn configure_services(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/add-signer").route(web::post().to(add_signer_handler)));
}

async fn add_signer_handler(key_gateway: web::Data<KeyGateway>, info: web::Json<SignerInfo>) -> impl Responder {
    let signer_public_key = info.signer_public_key.clone();
    let metadata = info.metadata.clone();
    let signature = info.signature.clone();
    let fid_owner = info.fid_owner;
    let deadline = info.deadline;

    match key_gateway.add_signer(signer_public_key, metadata, signature, fid_owner, deadline).await {
        Ok(_) => "Signer added successfully".to_string(),
        Err(e) => e.to_string(),
    }
}

#[derive(Deserialize)]
struct SignerInfo {
    signer_public_key: Vec<u8>,
    metadata: Vec<u8>,
    signature: Vec<u8>,
    fid_owner: Address,
    deadline: U256,
}

#[derive(Deserialize)]
struct ArticleForm {
    user_id: i32,
    title: String,
    content: String,
}

async fn create_article_handler(
    pool: web::Data<DbPool>,
    form: web::Json<ArticleForm>,
) -> impl Responder {
    let mut conn = pool.get().expect("Failed to get database connection");

    match create_article(&mut conn, form.user_id, &form.title, &form.content) {
        Ok(article) => web::Json(article),
        Err(_) => {
            let error_article = Article {
                id: 0,
                user_id: 0,
                title: "Error".to_string(),
                content: "Failed to create article".to_string(),
                created_at: chrono::Utc::now().naive_utc(),
            };
            web::Json(error_article)
        }
    }
}
