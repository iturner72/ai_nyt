extern crate protobuf_codegen;

fn main() {

    let base_dir = "proto/";

    let proto_file_names = ["message.proto", "username_proof.proto"];

    let proto_files: Vec<String> = proto_file_names
        .iter()
        .map(|file_name| format!("{}{}", base_dir, file_name))
        .collect();

    for proto_file in &proto_files {
        println!("cargo:rerun-if-changed={}", proto_file);
    }

    protobuf_codegen::Codegen::new()
        .out_dir("src/")
        .inputs(&proto_files)
        .include(base_dir)
        .protoc()
        .protoc_extra_arg("--experimental_allow_proto3_optional")
        .run()
        .expect("Protobuf codegen failed.");
}
