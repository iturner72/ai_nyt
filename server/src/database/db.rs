use diesel::prelude::*;
use crate::database::models::article::Article;
use crate::schema::articles::dsl::*;

pub fn create_article(conn: &mut PgConnection, user_id_param: i64, article_title: &str, article_content: &str) -> QueryResult<Article> {
    let new_article = Article {
        id: 0,
        user_id: user_id_param,
        title: article_title.to_string(),
        content: article_content.to_string(),
        created_at: chrono::Utc::now().naive_utc(),
        is_default: false,
    };

    diesel::insert_into(articles)
        .values(&new_article)
        .get_result(conn)
}
