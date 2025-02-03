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

**2. serverless-api.yaml**
  
    This repository provides a CloudFormation template (`serverless-api.yaml`) for deploying a serverless API using AWS Lambda and API Gateway.
  
  ## Overview
  
  This template automates the creation and configuration of the following AWS resources:
  
  *   **Lambda Function:**  A serverless function that contains your backend logic.
  *   **IAM Role:** An IAM role with permissions for the Lambda function to execute (including logging to CloudWatch).
  *   **API Gateway Rest API:** Creates the API endpoint.
  *   **API Gateway Resource and Method:** Defines the `/my-resource` path and the GET method for the API.
  *   **S3 Bucket:** Stores the Lambda function's deployment code.
  
  ## Getting Started
  
  1.  **Prepare and Deploy Lambda Function Code (CRUCIAL STEP):**
  
      *   **Write your Lambda function code:** Create a file named `index.js` (or your preferred handler file).  Here's a simple example:
  
          ```javascript
          exports.handler = async (event) => {
              const response = {
                  statusCode: 200,
                  body: JSON.stringify('Hello from Lambda!'),
              };
              return response;
          };
          ```
  
      *   **Create a zip archive:** Package your Lambda function code into a zip file. In your terminal:
  
          ```bash
          zip my-function.zip index.js  # Or whatever your handler file is named
          ```
  
      *   **Create an S3 bucket (or use an existing one):** Go to the S3 service in the AWS Management Console. Create a *private* bucket (e.g., `my-lambda-code-bucket-[your-id]-[region]`).  *Important:* The CloudFormation template will create a bucket if you don't already have one, but it's best to create it yourself and then reference it in the template.
  
      *   **Upload the zip file:** Upload `my-function.zip` to the `code/` folder in your S3 bucket.  If the `code` folder doesn't exist, create it. The full S3 path will be something like `s3://my-lambda-code-bucket-[your-id]-[region]/code/my-function.zip`.
  
  2.  **Deploy the CloudFormation Template:**
  
      *   Open `serverless-api.yaml` and make the following changes:
          *   If you *created* your S3 bucket manually (recommended), find the `LambdaCodeBucket` resource and replace the generated bucket name with the name of your S3 bucket.
          *   No other changes should be required if you followed the instructions above.
  
      *   Using the AWS CLI (recommended):
  
          ```bash
          aws cloudformation create-stack --stack-name MyServerlessAPIStack \
              --template-body file://serverless-api.yaml \
              --capabilities CAPABILITY_IAM  # VERY IMPORTANT: Required for IAM resources
          ```
  
          *   **Important:** The `--capabilities CAPABILITY_IAM` flag is *essential*. CloudFormation needs your explicit confirmation to create IAM roles and policies.  If you forget this, the stack creation will fail.
  
      *   Using the AWS Console:
          *   Go to the CloudFormation service in the AWS Management Console.
          *   Click "Create stack."
          *   Upload `serverless-api.yaml`.
          *   On the "Capabilities" page, check the box that acknowledges that the template might create IAM resources.
  
  3.  **Retrieve the API Endpoint:**
  
      *   After the stack creation is complete, you can retrieve the API endpoint from the CloudFormation outputs.
  
      *   Using the AWS CLI:
  
          ```bash
          aws cloudformation describe-stacks --stack-name MyServerlessAPIStack \
              --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' --output text
          ```
  
      *   Or you can find it in the CloudFormation console in the "Outputs" tab of your stack.
  
  4.  **Test the API:**
  
      *   Use `curl`, Postman, or any HTTP client to send a GET request to the retrieved API endpoint:
  
          ```bash
          curl [API_ENDPOINT]
          ```
  
  ## Important Considerations
  
  *   **Authorization:** The `AuthorizationType` is set to `NONE`.  **This is NOT secure for production APIs.**  Implement an appropriate authorization method (API keys, IAM authorization, Cognito, etc.).
  *   **Error Handling:** The Lambda function and API Gateway configuration are basic.  Implement robust error handling and logging.
  *   **Environment Variables:** The template shows how to use environment variables for your Lambda function's configuration.  This is a best practice.
  *   **CORS:** If your frontend is on a different domain, you'll need to configure CORS in API Gateway.
  *   **Resource ARNs:** The IAM policy for CloudWatch Logs uses a wildcard (`*`) for resources.  For production, it's best practice to use more specific ARNs to restrict permissions.  The same applies to other permissions your Lambda function might need.
  
