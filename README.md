# Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide

1.  **Prerequisites:**
      *   An AWS account.
      *   A domain name registered with Route 53 or another DNS provider.
      *   Basic familiarity with AWS CloudFormation.
  
2. **Clone the Repository:**
   
    ```bash
    git clone [https://github.com/shashankkannan/Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide.git](https://www.google.com/search?q=https://github.com/shashankkannan/Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide.git)
    cd Automating-AWS-Infrastructure-with-CloudFormation-Amplify-and-Lambda-Guide
    ```


## **A. secure-static-website-cfn.yaml**
  
  This template automates the creation and configuration of the following AWS resources:
  
  *   **S3 Bucket:**  Stores your website's files (HTML, CSS, JavaScript, images, etc.).  The bucket is configured for static website hosting.  A globally unique name is generated for the bucket.
  *   **CloudFront Origin Access Identity (OAI):**  A crucial security component. The OAI allows CloudFront to access the S3 bucket *without* making the bucket publicly accessible.
  *   **S3 Bucket Policy:**  Grants the CloudFront OAI the necessary permissions to read objects from the S3 bucket.
  *   **CloudFront Distribution:**  Serves your website's content to users globally.  It's configured to cache content for faster loading times, enforce HTTPS, and use your custom domain.
  *   **Route 53 Record Set:**  Creates a DNS record that maps your custom domain (e.g., `www.yourdomain.com`) to your CloudFront distribution.
  
  ## Getting Started
  
  1.  **Customize the Template:**  Open `static-website-cloudformation.yaml` and make the following changes:
  
      *   **S3 Bucket Name:** While the template generates a unique name, you can further customize the prefix.  Look for the `BucketName` property and adjust the `my-unique-bucket-name` part.  *Important:* S3 bucket names must be globally unique.
  
      *   **Custom Domain:**
          *   In the `MyCloudFront` resource, find the `Aliases` property and replace `www.yourdomain.com` with your actual domain name (e.g., `www.example.com` or `example.com`).
          *   In the `MyRoute53Record` resource:
              *   Replace `"yourdomain.com."` in `HostedZoneName` with your domain (e.g., `"example.com."`).  The trailing dot is important.
              *   Replace `"www.yourdomain.com."` in `Name` with your desired subdomain (e.g., `"www.example.com."`). If you want to use the apex domain (e.g., `example.com` directly), you can leave this blank or set it to `""`. The trailing dot is important.
  
  2.  **Deploy the Template:**
  
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
  
  3.  **Upload Website Content:** Once the stack is created, go to the S3 service, find the bucket created by the template, and upload your website's files (HTML, CSS, JavaScript, images, etc.) to it.
  
  4.  **Access Your Website:** After the stack creation is complete, the outputs will show the CloudFront URL and the S3 website URL.
  
  ## Important Considerations
  
  *   **Security:** The included OAI and bucket policy are *essential* for securing your S3 bucket.  Do not remove them.
  *   **Domain Name:** Ensure your domain name is correctly configured in Route 53 or with your DNS provider.
  *   **HTTPS:** CloudFront is configured to redirect all traffic to HTTPS.
  *   **Cost:** Be aware of the costs associated with the AWS services used (S3, CloudFront, Route 53).
  *   **Customization:**  This template provides a basic setup. You can customize it further to meet your specific requirements (e.g., adding more cache behaviors, configuring error pages, etc.).

## **B. serverless-api.yaml**
  
    This CloudFormation template (`serverless-api.yaml`) for deploying a serverless API using AWS Lambda and API Gateway.
  
  ## Overview
  
  This template automates the creation and configuration of the following AWS resources:
  
  *   **Lambda Function:**  A serverless function that contains your backend logic.
  *   **IAM Role:** An IAM role with permissions for the Lambda function to execute (including logging to CloudWatch).
  *   **API Gateway Rest API:** Creates the API endpoint.
  *   **API Gateway Resource and Method:** Defines the `/my-resource` path and the GET method for the API.
  *   **S3 Bucket:** Stores the Lambda function's deployment code. (Use if code > 10mb)
  
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
  
      *   **Create an S3 bucket (or use an existing one):** Go to the S3 service in the AWS Management Console. Create a *private* bucket (e.g., `my-lambda-code-bucket-[your-id]-[region]`).  *Important:* The CloudFormation template will create a bucket if you don't already have one, but it's best to create it yourself and then reference it in the template. (Use if code > 10mb)
  
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

## **C. order-processing.yaml**
   
  This CloudFormation template (`order-processing.yaml`) to set up an order processing workflow using Amazon SQS, AWS Lambda, and Amazon SNS.
  
  ## Overview
  
  This template creates the following AWS resources:
  
  *   **SQS Queue:** Stores incoming order messages.
  *   **Lambda Functions:**
      *   `ProcessOrderLambda`: Processes order data.
      *   `SendNotificationLambda`: Sends notifications via SNS.
  *   **IAM Roles:** IAM roles for Lambda and Step Functions with necessary permissions.
  *   **SNS Topic:** For sending notifications.
  *   **Step Function State Machine:** Orchestrates the workflow: receives from SQS, processes with Lambda, notifies via SNS.
  *   **S3 Bucket:** Stores Lambda function code.
  
  ## Getting Started
  
  1.  **Prepare Lambda Code (CRUCIAL):**
  
      *   **`process-order-function.zip` (`index.js`):**
  
          ```javascript
          exports.handler = async (event) => {
              const orderData = JSON.parse(event); // Parse order data from SQS message
              // Process the order (e.g., database update)
              const processingResult = {
                  orderId: orderData.orderId,
                  status: "Processed",
              };
              return processingResult;
          };
          ```
  
      *   **`send-notification-function.zip` (`index.js`):**
  
          ```javascript
          const AWS = require('aws-sdk');
          const sns = new AWS.SNS();
  
          exports.handler = async (event) => {
              const processingResult = event;
              const params = {
                  Message: JSON.stringify(processingResult),
                  TopicArn: process.env.SNS_TOPIC_ARN, // From environment variable
              };
  
              try {
                  const data = await sns.publish(params).promise();
                  console.log("SNS message sent:", data);
                  return { message: "Notification sent" };
              } catch (err) {
                  console.error("Error sending SNS message:", err);
                  throw err;
              }
          };
          ```
  
      *   **Zip:**
          ```bash
          zip process-order-function.zip index.js
          zip send-notification-function.zip index.js
          ```
  
  2.  **Create S3 Bucket & Upload (or use existing):**
  
      *   Create a *private* S3 bucket (e.g., `my-lambda-code-bucket-[your-id]-[region]`).  It's *highly* recommended to do this manually *before* deploying the template. This gives you more control over the bucket name.
      *   Upload `process-order-function.zip` and `send-notification-function.zip` to the bucket.
  
  3.  **Deploy CloudFormation Template:**
  
      *   Open `order-processing.yaml`.
      *   **Important:** If you created the S3 bucket *manually* in the previous step, you *must* update the `LambdaCodeBucket` resource's `BucketName` property with your bucket's name.  If you skip this step, the template will create a bucket for you, but you'll then have to find its name in the CloudFormation outputs and upload the zip files manually.
      *   **CLI (Recommended):**
          ```bash
          aws cloudformation create-stack --stack-name MyOrderProcessingStack \
              --template-body file://order-processing.yaml \
              --capabilities CAPABILITY_IAM  # CRUCIAL for IAM resources
        ```
    *   **Console:** Upload the template and acknowledge IAM capabilities.

  4.  **Send a Test Message to the SQS Queue:**
  
      *   After the stack creation is complete, you can send a message to the SQS queue to trigger the workflow.  You can do this through the AWS console, AWS CLI, or SDKs. Example using the AWS CLI:
  
          ```bash
          aws sqs send-message --queue-url [QUEUE_URL] --message-body '{"orderId": "12345", "item": "Product A", "quantity": 2}'
          ```
          Replace `[QUEUE_URL]` with the actual URL of your SQS queue (you can find this in the CloudFormation stack's Outputs). The message body is a JSON string representing the order data.
  
  5.  **Monitor the Workflow:**
  
      *   You can monitor the execution of your Step Function state machine in the AWS Step Functions console.  You can see the progress of each step, the input and output data, and any errors that may have occurred.  You can also monitor the SQS queue to see the messages being received and processed.  Check CloudWatch Logs for your Lambda functions for any errors.
  
  ## Important Considerations
  
  *   **Error Handling:** The provided Lambda functions have basic error handling.  For production, implement more robust error handling and logging.  The `send-notification-function` example now re-throws errors so that Step Functions knows the notification failed.
  *   **Idempotency:**  Consider how to handle duplicate messages in your `ProcessOrderLambda` function to ensure that the same order is not processed multiple times.  This is important for real-world applications.
  *   **Visibility Timeout:** The `VisibilityTimeout` in the `ReceiveOrder` state is set to 30 seconds.  Adjust this value based on how long your `ProcessOrderLambda` function is expected to take.  The visibility timeout prevents other consumers from processing the same message while it's being processed.
  *   **Dead-Letter Queue (DLQ):**  It's highly recommended to configure a Dead-Letter Queue (DLQ) for your SQS queue.  A DLQ is a separate queue where messages that fail to be processed are moved.  This allows you to investigate and retry failed messages.  You can add a `RedrivePolicy` to the `MyQueue` resource in the CloudFormation template to configure a DLQ.
  *   **Batching:** For higher throughput, you can configure your Step Function to receive messages from SQS in batches.  This reduces the number of API calls to SQS.
  *   **Security:**  Ensure that your IAM roles and policies have the least privilege necessary.  Avoid using wildcards (`*`) for resources unless absolutely necessary.
  *   **Testing:** Test your workflow thoroughly by sending various types of messages to the SQS queue and verifying that the orders are processed correctly and notifications are sent.
  
## **D. cognito-amplify-auth.yaml**

     This file demonstrates user authentication with AWS Cognito and AWS Amplify. It provides a CloudFormation template to create the Cognito User Pool and example React components for sign-up and sign-in.
  
  ## Overview
  
  1. This portion uses:
  
  *   **AWS Cognito:** For user management and authentication.
  *   **AWS Amplify:** To simplify the integration of Cognito with the application.
  
  
  2.  **Deploy the Cognito User Pool (CloudFormation):**
  
      *   Open `cognito-user-pool.yaml`.  This template defines the Cognito User Pool and Client. It includes default configurations for password policies, MFA, and email/SMS verification messages.  **You should review and customize these settings according to your application's requirements.** Refer to the AWS documentation for `AWS::Cognito::UserPool` and `AWS::Cognito::UserPoolClient` for all available options.
      *   Deploy the `cognito-user-pool.yaml` template using the AWS CLI or the CloudFormation console.  This will create your Cognito User Pool.
  
          *   **AWS CLI:**
              ```bash
              aws cloudformation create-stack --stack-name MyCognitoUserPoolStack \
                  --template-body file://cognito-user-pool.yaml \
                  --capabilities CAPABILITY_IAM
              ```
  
          *   **AWS Console:**  Go to the CloudFormation service, create a new stack, upload the template, and acknowledge the IAM capabilities.
  
      *   **Crucially:** After the stack is created, go to the "Outputs" tab of your CloudFormation stack in the AWS console.  **Copy the `UserPoolId` and `UserPoolClientId` values.** You'll need these in the next step.
  
  3.  **Set up Amplify in your project:**
  
      *   Navigate to your project directory (where your React app is).
      *   If you haven't already, run:
          ```bash
          amplify configure
          ```
          Follow the prompts to set up Amplify with your AWS credentials.
      *   Initialize Amplify in your project:
          ```bash
          amplify init
          ```
      *   Add the authentication module (using Cognito):
          ```bash
          amplify add auth
          ```
          Choose the default configuration (or customize if needed).
      *   Deploy the Amplify configuration (this connects your app to the Cognito resources):
          ```bash
          amplify push
          ```
  
  4.  **Update `aws-exports.js`:**
  
      *   Open the `aws-exports.js` file in your React project.  This file (which Amplify generates) contains the configuration for your AWS services.
      *   **You MUST manually update the `aws_user_pools_id` and `aws_user_pools_web_client_id` values in this file with the `UserPoolId` and `UserPoolClientId` that you copied from the CloudFormation stack outputs in step 3.**  The other values in the file (region, etc.) should already be populated correctly by Amplify.
  
          ```javascript
          const awsmobile = {
              "aws_project_region": "YOUR_AWS_REGION",  // Your AWS region
              "aws_cognito_identity_pool_id": "YOUR_COGNITO_IDENTITY_POOL_ID", // If using an identity pool (not required here)
              "aws_cognito_region": "YOUR_AWS_REGION", // Your AWS region
              "aws_user_pools_id": "THE_USER_POOL_ID", // From CloudFormation outputs
              "aws_user_pools_web_client_id": "THE_USER_POOL_CLIENT_ID", // From CloudFormation outputs
              "oauth": {} // If using OAuth
          };
  
          export default awsmobile;
          ```
  
  5.  **Install Amplify Libraries:**
  
      ```bash
      npm install aws-amplify @aws-amplify/auth  # or yarn add aws-amplify @aws-amplify/auth
      ```
  
  6.  **Use the Authentication Components: (Just to get you guys started)**
  
      *   The `SignUp.js` and `SignIn.js` files provide example React components for user sign-up and sign-in
