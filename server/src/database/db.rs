use diesel::prelude::*;
use crate::schema::articles;
use diesel::result::Error as DieselError;
use crate::database::models::article::Article;
use crate::schema::articles::dsl::*;

pub fn create_article(conn: &mut PgConnection, user_id_param: i64, article_title: &str, article_content: &str) -> Result<Article, DieselError> {
    let new_article = NewArticle {
        user_id: user_id_param,
        title: article_title.to_string(),
        content: article_content.to_string(),
    };

    diesel::insert_into(articles)
        .values(&new_article)
        .get_result(conn)
}

#[derive(Insertable)]
#[diesel(table_name = articles)]
struct NewArticle {
    user_id: i64,
    title: String,
    content: String,
}
