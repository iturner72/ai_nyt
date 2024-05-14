use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Reaction {
    pub fid: u64,
    pub hash: String,
    pub author_fid: u64,
    pub target_hash: String,
    pub timestamp: u64,
    pub reaction_type: String,
}
