provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

provider "aws" {
  alias = "us-east-1"
  region = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}