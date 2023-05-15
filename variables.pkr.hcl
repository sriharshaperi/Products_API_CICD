#variables
variable "source_ami_name" {
  type = string
}

variable "root_device_type" {
  type = string
}

variable "virtualization_type" {
  type = string
}

variable "ami_owner" {
  type = string
}

// variable "demo_acct_id" {
//   type = string
// }

variable "dev_acct_id" {
  type = string
}

variable "aws_profile" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "build_source" {
  type = string
}

variable "NODE_ENV" {
  type = string
}

variable "DB_NAME" {
  type = string
}

variable "DB_USERNAME" {
  type = string
}

variable "DB_PASSWORD" {
  type = string
}

variable "DIALECT" {
  type = string
}

variable "PORT" {
  type = string
}


#test