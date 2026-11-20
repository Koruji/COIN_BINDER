use crate::error::AppError;
use axum::extract::FromRequest;

#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(AppError))]
pub struct AppJson<T>(pub T);
