fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .build_client(false)
        .out_dir("src")
        .compile(&["../../proto/auth.proto"], &["../../proto"])?;
    Ok(())
}
