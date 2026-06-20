terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "eduai-terraform-state-ap-south-1"
    key            = "staging/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "eduai-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(var.tags, {
      Environment = var.environment
    })
  }
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

module "vpc" {
  source = "./modules/vpc"

  name_prefix = local.name_prefix
  vpc_cidr    = var.vpc_cidr
  tags        = var.tags
}

module "eks" {
  source = "./modules/eks"

  name_prefix           = local.name_prefix
  cluster_version       = var.eks_cluster_version
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  node_instance_types   = var.eks_node_instance_types
  node_desired_size     = var.eks_node_desired_size
  node_min_size         = var.eks_node_min_size
  node_max_size         = var.eks_node_max_size
  tags                  = var.tags
}

module "rds" {
  source = "./modules/rds"

  name_prefix       = local.name_prefix
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  security_group_id = module.vpc.rds_security_group_id
  username          = var.db_username
  password          = var.db_password
  instance_class    = var.db_instance_class
  tags              = var.tags
}

module "elasticache" {
  source = "./modules/elasticache"

  name_prefix       = local.name_prefix
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  security_group_id = module.vpc.redis_security_group_id
  node_type         = var.redis_node_type
  tags              = var.tags
}

module "s3" {
  source = "./modules/s3"

  name_prefix = local.name_prefix
  tags        = var.tags
}

module "cloudfront" {
  source = "./modules/cloudfront"

  name_prefix     = local.name_prefix
  domain_name     = var.domain_name
  s3_bucket_id    = module.s3.media_bucket_id
  s3_bucket_arn   = module.s3.media_bucket_arn
  s3_bucket_domain = module.s3.media_bucket_domain
  tags            = var.tags
}

module "route53" {
  source = "./modules/route53"

  name_prefix              = local.name_prefix
  domain_name              = var.domain_name
  cloudfront_domain_name   = module.cloudfront.distribution_domain_name
  cloudfront_hosted_zone_id = module.cloudfront.distribution_hosted_zone_id
  tags                     = var.tags
}

module "ses" {
  source = "./modules/ses"

  name_prefix     = local.name_prefix
  domain_name     = var.domain_name
  email_identity  = var.ses_email_identity
  route53_zone_id = module.route53.zone_id
  tags            = var.tags
}
