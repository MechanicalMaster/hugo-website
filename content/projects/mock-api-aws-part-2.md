---
title: "Optimizing the Mock API – Part 2"
date: 2024-03-03
description: "A deep dive into enhancing a mock API with proper logging, error handling, and authentication mechanisms on AWS."
tags: ["AWS", "API", "CloudWatch", "Security", "DevOps"]
categories: ["Technical", "Cloud Computing"]
series: ["Mock API on AWS"]
series_order: 2
---

Continuing my multi-service mock API journey on AWS Free Tier, I tackled logging, error handling, and authentication to enhance reliability for product managers and geeks alike. With the API live on EC2 (`65.2.1XX.XX:8000`), direct HTTP access posed challenges for monitoring and security, driving me to refine the setup.

Logging was critical for tracking ~10 daily calls. Initially, I faced `No such file or directory` errors configuring CloudWatch Logs via CLI, but the AWS Management Console saved the day. Using Systems Manager Run Command, I installed the CloudWatch agent, configuring it to collect `/var/lib/docker/containers/*/*.log` into `multi-api-logs`:

```json
{
  "agent": {
    "metrics_collection_interval": 60,
    "logfile": "/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/lib/docker/containers/*/*.log",
            "log_group_name": "multi-api-logs",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

A diagram of EC2 → CloudWatch logging illustrates this:

![EC2 Logging to CloudWatch](https://docs.aws.amazon.com/images/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-EC2.png)
*Source: AWS CloudWatch Documentation*

I hit "No registered managed instances" in SSM due to IAM role issues (fixed with `AmazonSSMManagedInstanceCore`) and IMDSv2 misconfiguration, resolved via the console. Logs now stream to CloudWatch, staying within Free Tier's 1 GB/month limit.

Next, I enhanced error handling and authentication. Initially using `Client-ID` and `X-IBM-Key` headers, I switched to a single `X-API-Key` for simplicity, adding internal status codes (101–109) and HTTP codes (200, 400, 401, etc.):

```python
@app.post("/pan-to-gst", response_model=SimpleResponse)
async def pan_to_gst(request: PanRequest):
    pan = request.pan_number.strip().upper()
    if not request.headers.get("X-API-Key") == "my-secret-key-123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"status": "error", "internal_status_code": 102, "message": "Invalid API key"}
        )
    if not re.match(PAN_PATTERN, pan):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "error", "internal_status_code": 102, "message": "Invalid PAN format"}
        )
    value = PAN_TO_GST.get(pan)
    if not value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"status": "error", "internal_status_code": 103, "message": "No records found"}
        )
    return {"status": "success", "internal_status_code": 101, "value": value}
```

This covered scenarios like invalid inputs (102/400), missing data (103/404), and simulated failures (108/500). The code simulates the error codes as per the original API's; for realistic product testing. Also, integrated is a neat swagger powered documentation hosted on the same link.

This optimization makes the API production-ready for testing, balancing technical depth with testing needs. Check AWS docs for more!


**References**:  
- [AWS Systems Manager](https://aws.amazon.com/systems-manager)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)