# Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide

**1. secure-static-website-cfn.yaml**
  
  This template automates the creation and configuration of the following AWS resources:
  
  *   **S3 Bucket:**  Stores your website's files (HTML, CSS, JavaScript, images, etc.).  The bucket is configured for static website hosting.  A globally unique name is generated for the bucket.
  *   **CloudFront Origin Access Identity (OAI):**  A crucial security component. The OAI allows CloudFront to access the S3 bucket *without* making the bucket publicly accessible.
  *   **S3 Bucket Policy:**  Grants the CloudFront OAI the necessary permissions to read objects from the S3 bucket.
  *   **CloudFront Distribution:**  Serves your website's content to users globally.  It's configured to cache content for faster loading times, enforce HTTPS, and use your custom domain.
  *   **Route 53 Record Set:**  Creates a DNS record that maps your custom domain (e.g., `www.yourdomain.com`) to your CloudFront distribution.
  
  ## Getting Started
  
  1.  **Prerequisites:**
      *   An AWS account.
      *   A domain name registered with Route 53 or another DNS provider.
      *   Basic familiarity with AWS CloudFormation.
  
  2.   **Clone the Repository:**
    ```bash
    git clone [https://github.com/shashankkannan/Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide.git](https://www.google.com/search?q=https://github.com/shashankkannan/Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide.git)
    cd Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide
    ```
  
  3.  **Customize the Template:**  Open `static-website-cloudformation.yaml` and make the following changes:
  
      *   **S3 Bucket Name:** While the template generates a unique name, you can further customize the prefix.  Look for the `BucketName` property and adjust the `my-unique-bucket-name` part.  *Important:* S3 bucket names must be globally unique.
  
      *   **Custom Domain:**
          *   In the `MyCloudFront` resource, find the `Aliases` property and replace `www.yourdomain.com` with your actual domain name (e.g., `www.example.com` or `example.com`).
          *   In the `MyRoute53Record` resource:
              *   Replace `"yourdomain.com."` in `HostedZoneName` with your domain (e.g., `"example.com."`).  The trailing dot is important.
              *   Replace `"www.yourdomain.com."` in `Name` with your desired subdomain (e.g., `"www.example.com."`). If you want to use the apex domain (e.g., `example.com` directly), you can leave this blank or set it to `""`. The trailing dot is important.
  
  4.  **Deploy the Template:**
  
      *   **Using the AWS Console:**
          1.  Go to the CloudFormation service in the AWS Management Console.
          2.  Click "Create stack."
          3.  Upload the `static-website-cloudformation.yaml` file.
          4.  Follow the on-screen instructions, providing any required parameters.
  
      *   **Using the AWS CLI:**
          ```bash
          aws cloudformation create-stack --stack-name MyStaticWebsiteStack \
          --template-body file://static-website-cloudformation.yaml \
          --capabilities CAPABILITY_IAM  # Required if your template creates IAM resources
          ```
  
  5.  **Upload Website Content:** Once the stack is created, go to the S3 service, find the bucket created by the template, and upload your website's files (HTML, CSS, JavaScript, images, etc.) to it.
  
  6.  **Access Your Website:** After the stack creation is complete, the outputs will show the CloudFront URL and the S3 website URL.
  
  ## Important Considerations
  
  *   **Security:** The included OAI and bucket policy are *essential* for securing your S3 bucket.  Do not remove them.
  *   **Domain Name:** Ensure your domain name is correctly configured in Route 53 or with your DNS provider.
  *   **HTTPS:** CloudFront is configured to redirect all traffic to HTTPS.
  *   **Cost:** Be aware of the costs associated with the AWS services used (S3, CloudFront, Route 53).
  *   **Customization:**  This template provides a basic setup. You can customize it further to meet your specific requirements (e.g., adding more cache behaviors, configuring error pages, etc.).
