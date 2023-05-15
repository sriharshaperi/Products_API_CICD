#!/bin/bash

sleep 30

sudo yum -y update
sudo yum -y upgrade

sudo amazon-linux-extras install epel -y 
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

mkdir webapp
mv webapp.zip webapp/
cd webapp
unzip webapp.zip
rm webapp.zip

# cd webapp
npm install
mkdir uploads
mkdir logs
cd ..
sudo chmod 755 webapp

#cloudwatch-agent
curl https://s3.amazonaws.com/amazoncloudwatch-agent/linux/amd64/latest/AmazonCloudWatchAgent.zip -O
unzip AmazonCloudWatchAgent.zip
sudo ./install.sh

sudo yum install nginx -y

sudo yum install amazon-cloudwatch-agent -y