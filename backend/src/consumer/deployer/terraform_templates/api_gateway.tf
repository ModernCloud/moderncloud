resource "aws_api_gateway_account" "{{project.name}}_{{environment.name}}_api_gateway_account" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_api_gateway_rest_api" "{{project.name}}_{{environment.name}}_api_gateway" {
  name = "{{project.name}}"
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "{{ project.name }}"
      version = "1.0"
    }
    paths = {
      {{#endpoints}}
      "{{path}}" = {
          lower("{{method}}") = {
            x-amazon-apigateway-integration = {
              httpMethod           = "POST"
              passthroughBehavior  = "when_no_match"
              type                 = "AWS_PROXY"
              uri                  = aws_lambda_function.{{name}}_function.invoke_arn
            }
          }
        }
      {{/endpoints}}
    }
  })
}

resource "aws_api_gateway_deployment" "{{project.name}}_{{environment.name}}_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.{{project.name}}_{{environment.name}}_api_gateway.id
  stage_name = "{{environment.name}}"
  stage_description = sha1(aws_api_gateway_rest_api.{{project.name}}_{{environment.name}}_api_gateway.body)
  triggers = {
    redeployment = sha1(aws_api_gateway_rest_api.{{project.name}}_{{environment.name}}_api_gateway.body)
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_method_settings" "{{project.name}}_{{environment.name}}_settings" {
  rest_api_id = aws_api_gateway_rest_api.{{project.name}}_{{environment.name}}_api_gateway.id
  stage_name  = "{{environment.name}}"
  method_path = "*/*"
  depends_on = [
    aws_api_gateway_rest_api.{{project.name}}_{{environment.name}}_api_gateway,
    aws_api_gateway_deployment.{{project.name}}_{{environment.name}}_api_deployment
  ]
  settings {
    metrics_enabled        = true
    data_trace_enabled     = true
    logging_level          = "INFO"
  }
}

output "api_url" {
  value = aws_api_gateway_deployment.{{project.name}}_{{environment.name}}_api_deployment.invoke_url
}