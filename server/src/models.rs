use serde::{Deserialize, Serialize};
use diesel::Queryable;
use diesel::Insertable;
use crate::schema::articles;
use chrono::NaiveDateTime;

#[derive(Queryable, Insertable, Serialize, Deserialize)]
pub struct Article {
    pub id: i32,
    pub user_id: i32,
    pub title: String,
    pub content: String,
    #[serde(serialize_with = "serialize_datetime", deserialize_with = "deserialize_datetime")]
    pub created_at: NaiveDateTime,
}


fn serialize_datetime<S>(datetime: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    let s = datetime.format("%Y-%m-%dT%H:%M:%S%.f").to_string();
    serializer.serialize_str(&s)
}

fn deserialize_datetime<'de, D>(deserializer: D) -> Result<NaiveDateTime, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    NaiveDateTime::parse_from_str(&s, "%Y-%m-%dT%H:%M:%S%.f").map_err(serde::de::Error::custom)
}

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
pub struct User {
    pub fid: u64,
    pub username: String,
    pub display_name: String,
    pub bio: String,
    pub avatar_url: String,
    pub verified: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Reaction {
    pub fid: u64,
    pub hash: String,
    pub author_fid: u64,
    pub target_hash: String,
    pub timestamp: u64,
    pub reaction_type: String,
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
