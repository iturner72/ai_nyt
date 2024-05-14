use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Cast {
    pub fid: u64,
    pub hash: String,
    pub parent_hash: Option<String>,
    pub author_fid: u64,
    pub timestamp: u64,
    pub text: String,
    pub mentions: Vec<u64>,
    pub mentions_positions: Vec<u32>,
    pub embeds: Vec<Embed>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Embed {
    pub url: Option<String>,
    pub cast_id: Option<CastId>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CastId {
    pub fid: u64,
    pub hash: String,
}
