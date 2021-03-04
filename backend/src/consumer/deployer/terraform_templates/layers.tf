data "archive_file" "packages" {
  type = "zip"
  output_path = "{{ packages.zip_file }}"
  source_dir = "{{ packages.root }}"
}

resource "aws_lambda_layer_version" "dependencies" {
  layer_name = "{{project.name}}_packages"
  filename = "{{ packages.zip_file }}"
  source_code_hash = data.archive_file.packages.output_base64sha256
}