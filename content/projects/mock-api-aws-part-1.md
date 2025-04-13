---
title: "Building a Multi-Service Mock API on AWS Free Tier – Part 1"
date: 2024-03-03
description: "A journey through building a multi-service mock API on AWS Free Tier, focusing on initial setup and deployment challenges."
tags: ["AWS", "API", "Docker", "FastAPI", "Cloud"]
categories: ["Technical", "Cloud Computing"]
series: ["Mock API on AWS"]
series_order: 1
---

As a product manager with a geeky streak, I embarked on an exciting project to build a multi-service mock API (e.g., PAN to GST, CIN to Director) on AWS, aiming for a cost-effective, scalable testing environment. The goal? Simulate real-world Perfios/Karza/Signzy API's for downstream local testing, hosted on an EC2 t3.micro instance, directly accessible via HTTP. This blog post dives into the initial setup, challenges, and key decisions.The schema is kept same as the original ones.

I started by designing a FastAPI app in a Docker container, storing dummy data like `PAN_TO_GST = {"ABCDE1234F": "22ABCDE1234F1Z5"}` in Python dictionaries, eliminating external databases for simplicity. Deploying on EC2 seemed perfect for low traffic (~10 calls/day). The challenge? Ensuring the app ran reliably while staying cost-free. I built the Docker image locally, pushed it to Amazon ECR, and launched the EC2 instance with a user data script to automate Docker and container setup.

Connecting directly to `http://65.2.XXX.XX:8000/health` worked locally, but PowerShell errors (`Unable to connect`) revealed security group and NACL issues. I fixed inbound rules (port 8000 open, 0.0.0.0/0) and adjusted NACLs for TCP 8000, ensuring public access. A diagram of the architecture (Client → EC2 → Docker) clarifies this:

Challenges included container crashes (resolved with `--restart unless-stopped`) and log setup. Initially, I struggled with CloudWatch Logs configuration via CLI, but switching to the AWS Console (Systems Manager Run Command) streamlined it, using `AWSCloudWatchFullAccess` for permissions.

this implementation highlights AWS power for testing, but product managers must weigh simplicity (direct EC2) against scalability (Fargate/ALB). Stay tuned for Part 2 on optimizing logs and error handling!

**References**:  
- [AWS Free Tier](https://aws.amazon.com/free)
- [FastAPI Docker Deployment](https://fastapi.tiangolo.com/deployment/docker) 