// @generated automatically by Diesel CLI.

diesel::table! {
    articles (id) {
        id -> Int4,
        user_id -> Int8,
        title -> Varchar,
        content -> Text,
        created_at -> Timestamp,
        is_default -> Bool,
    }
}
