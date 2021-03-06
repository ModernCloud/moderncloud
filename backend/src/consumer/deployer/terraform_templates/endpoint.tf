data "archive_file" "{{ endpoint.name }}_archive" {
  type = "zip"
  output_path = "{{ endpoint.zip_file }}"
  source_dir = "{{ endpoint.root }}"
}

resource "aws_lambda_function" "{{ endpoint.name }}_function" {
  function_name = "{{ endpoint.name }}"
  filename = "{{ endpoint.zip_file }}"
  source_code_hash = data.archive_file.{{ endpoint.name }}_archive.output_base64sha256

  handler = "{{ endpoint.handler }}"
  runtime = "{{ endpoint.runtime }}"
  role = aws_iam_role.lambda_iam_role.arn
  layers = [aws_lambda_layer_version.{{project.name}}_{{environment.name}}_packages.arn]
}

resource "aws_lambda_permission" "{{ endpoint.name }}_permission" {
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.{{ endpoint.name }}_function.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_deployment.{{project.name}}_{{environment.name}}_api_deployment.execution_arn}/*/*"
}

output "{{endpoint.name}}_invoke_arn" {
  value = aws_lambda_function.{{endpoint.name}}_function.invoke_arn
}