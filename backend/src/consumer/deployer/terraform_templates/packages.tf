# layers/helpers
data "archive_file" "{{project.name}}_{{environment.name}}_packages" {
  type = "zip"
  output_path = "{{ zip_file }}"
  source_dir = "{{ root }}"
}

resource "aws_lambda_layer_version" "{{project.name}}_{{environment.name}}_packages" {
  layer_name = "{{project.name}}_{{environment.name}}_packages"
  filename = "{{zip_file}}"
  source_code_hash = data.archive_file.{{project.name}}_{{environment.name}}_packages.output_base64sha256
}