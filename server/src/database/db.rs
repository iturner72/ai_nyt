use diesel::prelude::*;
use crate::schema::articles;
use diesel::result::Error as DieselError;
use crate::database::models::article::Article;
use crate::schema::articles::dsl::*;

pub fn create_article(conn: &mut PgConnection, user_id_param: i64, article_title: &str, article_content: &str) -> Result<Article, DieselError> {
    let is_default_value = if user_id_param == 249222 { true } else { false };

    let existing_article = articles
        .filter(user_id.eq(user_id_param))
        .filter(title.eq(article_title))
        .first::<Article>(conn)
        .optional()?;

    if let Some(_) = existing_article {
        return Err(DieselError::NotFound);
    }

    let new_article = NewArticle {
        user_id: user_id_param,
        title: article_title.to_string(),
        content: article_content.to_string(),
        is_default: is_default_value,
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
    is_default: bool,
}
