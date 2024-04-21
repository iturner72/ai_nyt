// @generated automatically by Diesel CLI.

diesel::table! {
    articles (id) {
        id -> Int4,
        user_id -> Int4,
        title -> Varchar,
        content -> Text,
        created_at -> Timestamp,
    }
}
