data "archive_file" "{{ function.name }}_archive" {
  type = "zip"
  output_path = "{{ function.zip_file }}"
  source_dir = "{{ function.root }}"
}

resource "aws_lambda_function" "{{ function.name }}_function" {
  function_name = "{{ function.name }}"
  filename = "{{ function.zip_file }}"
  source_code_hash = data.archive_file.{{ function.name }}_archive.output_base64sha256

  handler = "{{ function.handler }}"
  runtime = "{{ function.runtime }}"
  role = aws_iam_role.lambda_iam_role.arn
}

output "invoke_arn" {
  value = aws_lambda_function.{{function.name}}_function.invoke_arn
}