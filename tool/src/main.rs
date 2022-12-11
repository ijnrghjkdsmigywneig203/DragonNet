use easy_tokio_rustls::TlsClient;
use std::env;
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    task,
    time::{self, Duration},
};

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let method = &args[1];
    let path = &args[2];
    let user_agent = &args[3];
    let host = &args[4];
    let ip_to_connect = &args[5];
    let raw_request = format![
        "{} {}\r\nUser-Agent: {}\r\nHost: {}\r\nConnection: keep-alive\r\n\r\n",
        method, path, user_agent, host
    ];

    loop {
        let ip = ip_to_connect.clone();
        let raw_request = raw_request.clone();
        time::sleep(Duration::from_millis(5)).await;

        task::spawn(async move {
            let client = TlsClient::new(ip.clone().as_str()).await.unwrap();
            let mut connection = client.connect().await.unwrap();
            connection
                .write_all(raw_request.as_str().as_bytes())
                .await
                .unwrap();
        });
    }
}
