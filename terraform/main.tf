provider "aws" {

  region = var.region
  profile = "nueva-cuenta"  
}

resource "aws_lambda_function" "redirect" {

  function_name = var.lambda_name

  role = aws_iam_role.lambda_role.arn

  handler = "index.handler"

  runtime = "nodejs22.x"

  filename = "../lambda.zip"

  source_code_hash = filebase64sha256("../lambda.zip")

  environment {

    variables = {

      TABLE_NAME = var.table_name
      VISITS_TABLE = "url_visits"
    }

  }

}

resource "aws_apigatewayv2_api" "api" {

  name = "redirect-api"

  protocol_type = "HTTP"

}

resource "aws_apigatewayv2_integration" "integration" {

  api_id = aws_apigatewayv2_api.api.id

  integration_type = "AWS_PROXY"

  integration_uri = aws_lambda_function.redirect.invoke_arn

  payload_format_version = "2.0"

}

resource "aws_apigatewayv2_route" "route" {

  api_id = aws_apigatewayv2_api.api.id

  route_key = "GET /{codigo}"

  target = "integrations/${aws_apigatewayv2_integration.integration.id}"

}

resource "aws_apigatewayv2_stage" "dev" {

  api_id = aws_apigatewayv2_api.api.id

  name = "$default"

  auto_deploy = true

}

resource "aws_lambda_permission" "api_gateway" {

  statement_id = "AllowExecution"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.redirect.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"

}