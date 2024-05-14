use crate::schema::articles;
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Insertable};
use chrono::NaiveDateTime;

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = articles)]
pub struct Article {
    pub id: i32,
    pub user_id: i64,
    pub title: String,
    pub content: String,
    #[serde(serialize_with = "serialize_datetime", deserialize_with = "deserialize_datetime")]
    pub created_at: NaiveDateTime,
    pub is_default: bool,
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
