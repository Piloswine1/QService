#[macro_use]
extern crate lazy_static;
use std::collections::HashMap;
use tonic::{transport::Server, Request, Response, Status};

mod auth;
use auth::auth_service_server::*;
use auth::*;

lazy_static! {
    static ref USERS: HashMap<&'static str, bool> = {
        let mut m = HashMap::new();
        m.insert("user", true);
        m.insert("admin", true);
        m
    };
}

#[derive(Debug, Default)]
struct AuthImpl;

#[tonic::async_trait]
impl AuthService for AuthImpl {
    async fn auth(&self, request: Request<RequestAuth>) -> Result<Response<ResponseAuth>, Status> {
        println!("Got a request: {:?}", request);
        let name = request.into_inner().name;

        match USERS.get(name.as_str()) {
            Some(true) => Ok(Response::new(ResponseAuth {
                authenticated: true,
            })),
            _ => Ok(Response::new(ResponseAuth {
                authenticated: false,
            })),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let auth = AuthImpl::default();

    Server::builder()
        .add_service(AuthServiceServer::new(auth))
        .serve(addr)
        .await?;

    Ok(())
}
