#!/usr/bin/env bash
# Run this script in the root of steam-reviews to copy updated files to EC2 instance, then deploy the updates.

ip_pref="ec2-user@13.59.202.34"
ssh_cmd_pref="sudo ssh -i ../steam-proxy.pem $ip_pref"

sudo scp -r -i ../steam-proxy.pem client db server public scripts webpack.config.js package-lock.json package.json .babelrc .dockerignore docker-compose.yml Dockerfile knexfile.js $ip_pref:~/steam-reviews/
sudo scp -r -i ../steam-proxy.pem data-gen/csv-seeds/* $ip_pref:~/steam-reviews/data-gen/csv-seeds/
$ssh_cmd_pref "sudo service docker start && sudo yum update"
$ssh_cmd_pref "cd ~/steam-reviews && sudo docker-compose down && sudo docker-compose up -d --build"
