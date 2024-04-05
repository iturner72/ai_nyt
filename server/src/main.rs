use actix_cors::Cors;
use actix_web::{get, App, HttpServer, Responder};
use actix_web::http::{header, Method};
use dotenv::dotenv;
use std::env;

mod models;
mod hubble;
mod openai;
mod anthropic;
mod submit_cast;
mod message;
mod username_proof;

#[get("/")]
async fn index() -> impl Responder {
    "Welcome to The Network Times API!"
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let server_port = env::var("SERVER_PORT").unwrap_or_else(|_| "8081".to_string());
    let server_address = format!("{}:{}", server_host, server_port);

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("https://www.farcon.info")
            .allowed_methods(vec![Method::GET, Method::POST, Method::OPTIONS])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);


        App::new()
            .wrap(cors)
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
