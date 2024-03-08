use actix_cors::Cors;
use actix_web::{get, App, HttpServer, Responder};
use dotenv::dotenv;
use std::env;

mod models;
mod hubble;
mod openai;

#[get("/")]
async fn index() -> impl Responder {
    "Welcome to the Farcaster API!"
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

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
            .service(hubble::get_cast_by_id)
            .service(hubble::get_casts_by_fid)
            .service(hubble::get_casts_by_parent)
            .service(hubble::get_casts_by_mention)
            .service(openai::generate_chat)
    })
    .bind(server_address)?
    .run()
    .await
}
