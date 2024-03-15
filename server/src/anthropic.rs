use actix_web::{post, web, HttpResponse};
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct AnthropicRequest {
    model: String,
    messages: Vec<Message>,
    max_tokens: u32,
    system: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Message {
    role: String,
    content: String,
}

#[derive(Serialize, Deserialize)]
struct AnthropicResponse {
    id: String,
    #[serde(rename = "type")]
    message_type: String,
    role: String,
    content: Vec<AnthropicContent>,
}

#[derive(Serialize, Deserialize)]
struct AnthropicContent {
    #[serde(rename = "type")]
    content_type: String,
    text: String,
}

#[post("/generate_chat_anthropic")]
async fn generate_chat_anthropic(req_body: web::Json<AnthropicRequest>) -> HttpResponse {
    let api_key = std::env::var("ANTHROPIC_API_KEY").expect("ANTHROPIC_API_KEY must be set");
    let client = Client::new();
    let version = "2023-06-01";

    let messages = vec![
        Message {
            role: "user".to_string(),
            content: req_body.messages[0].content.clone(),
        },
    ];

    let anthropic_request = AnthropicRequest {
        model: req_body.model.clone(),
        messages,
        max_tokens: req_body.max_tokens,
        system: "You are AI_NYT. This means that you create a New York Times level caliper article in which you summarize all of the Casts from the past week in a weekly digest. Your token limit is 250.".to_string(),
    };

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key.as_str())
        .header("anthropic-version", version)
        .header("Content-Type", "application/json")
        .json(&anthropic_request)
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let anthropic_response: AnthropicResponse = res.json().await.unwrap();
                HttpResponse::Ok().json(anthropic_response)
            } else {
                HttpResponse::BadRequest().body("Request to Anthropic API failed")
            }
        }
        Err(_) => HttpResponse::InternalServerError().body("Failed to send request to Anthropic API"),
    }
}
