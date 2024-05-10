use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub fid: u64,
    pub username: String,
    pub display_name: String,
    pub bio: String,
    pub avatar_url: String,
    pub verified: bool,
}
