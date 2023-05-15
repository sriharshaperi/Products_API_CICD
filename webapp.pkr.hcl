packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}
source "amazon-ebs" "webapp" {
  ami_name = "webapp-ami-${local.timestamp}"
  source_ami_filter {
    filters = {
      name                = "${var.source_ami_name}"  
      root-device-type    = "${var.root_device_type}" 
      virtualization-type = "${var.virtualization_type}" 
    }
    most_recent = true
    owners      = ["${var.ami_owner}"] 
  }
  // ami_users = ["${var.demo_acct_id}"] 
    ami_users = ["${var.dev_acct_id}"] 
  profile = "${var.aws_profile}"
  instance_type = "${var.instance_type}" 
  region = "${var.aws_region}" 
  ssh_username = "${var.ssh_username}" 
}

build {
  sources = [
    "${var.build_source}"
  ]
    provisioner "file" {
      source="./webapp.zip"
      destination="webapp.zip"
    } 

  provisioner "shell" {
    script = "./webapp.sh"
  }

  provisioner "file" {
    source      = "./cloudwatch/config.json"
    destination = "/tmp/config.json"
  }
}