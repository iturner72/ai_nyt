use actix_web::{web, HttpResponse, Responder, post};
use reqwest::{Client, header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE}};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;


#[derive(Debug)]
pub enum MyError {
    Reqwest(reqwest::Error),
    NoChoicesFound,
    HttpError(String),
}

impl From<reqwest::Error> for MyError {
    fn from(error: reqwest::Error) -> Self {
        MyError::Reqwest(error)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SummaryRequest {
    text: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OpenAIClient {
    #[serde(skip)]
    client: Client,
    #[serde(skip)]
    headers: HeaderMap,
    endpoint_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChatResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Choice {
    message: MessageContent,
}

#[derive(Debug, Serialize, Deserialize)]
struct MessageContent {
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    role: String,
    content: String,
}

impl OpenAIClient {
    pub fn new() -> Self {
        log::info!("Initializing OpenAI client...");
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY not found in environment variables");
        headers.insert(AUTHORIZATION, HeaderValue::from_str(&format!("Bearer {}", api_key)).expect("Invalid header value"));

        OpenAIClient {
            client: Client::new(),
            headers,
            endpoint_url: "https://api.openai.com/v1/completions".to_string(),
        }
    }
    pub async fn generate_summary(&self, user_message: &str) -> Result<String, MyError> {
        log::info!("Generating summary for: {}", user_message);
    
        // Constructing the body directly with json! macro to match the documented structure.
        let body = json!({
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are AI_NYT. This means that you are the Artificially Intelligent New York Times. Summarize the latest poasts from Elite Poasters on Farcaster.  Include key insights, notable discussions, and any significant updates. Emphasize content that reflects advanced expertise and leadership in discussions. Generate a concise, AI-driven summary in the style of a New York Times article, ensuring the model's output aligns with high-quality journalistic standards and ethical considerations. The summary should provide readers with a clear understanding of the current trends and notable contributions from Elite Poasters. Include the date range for the poasts summarized. Give a subtle nod to Poaster, the anon shitposting app from 2022 without outright saying shoutout to the Poasters."},
                {"role": "user", "content": user_message},
            ],
        });
    
        let response = self.client.post("https://api.openai.com/v1/chat/completions") 
            .headers(self.headers.clone())
            .json(&body)
            .send().await?;
    
        // Log response status for debugging
        log::info!("Received response status: {}", response.status());
    
        if response.status().is_success() {
            let response_body = response.json::<ChatResponse>().await?;
            if let Some(choice) = response_body.choices.first() {
                log::info!("Summary generated: {}", choice.message.content);
                Ok(choice.message.content.clone())
            } else {
                Err(MyError::NoChoicesFound)
            }
        } else {
            let error_message = format!("HTTP error: {}", response.status());
            log::error!("{}", &error_message);
            Err(MyError::HttpError(format!("HTTP error: {}", response.status())))
        }
    }

}

#[post("/generate_daily_summary")]
pub async fn generate_chat(req_body: web::Json<SummaryRequest>) -> impl Responder {
    log::info!("Handling /generate_daily_summary request");
    let openai_client = OpenAIClient::new();
    let compiled_text = &req_body.text;

    match openai_client.generate_summary(&compiled_text).await {
        Ok(summary) => {
            log::info!("Successfully generated summary");
            HttpResponse::Ok().content_type("text/plain").body(summary)
        },
        Err(_) => {
            HttpResponse::InternalServerError().finish()
        },
    }
}

