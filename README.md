# webapp

This is an API to create, retrieve and update user details.

# Steps to Execute

1. Clone the repository to local.
2. Run npm install to install the node_modules
3. Run npm test to verify the test cases
4. Run npm start to start the node server
5. Open Postman and test the API's

# APIs for Testing

1. GET /healthz
2. POST /v5/user
3. GET /v5/user/:userId
4. PUT /v5/user/:userId

# Dependencies Used

1. base-64 - For decoding the encoded Auth credentials
2. bcrypt - For hashing the plain text password and storing in DB and also for comparing the decoded password with the hashed
3. cors - Allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.
4. express - For writing the API using express framework
5. mysql2 - for storing the data in DB
6. sequelize - ORM for DB transactions

# API Workflow

## GET v1/healthz

This is a testing endpoint. It is to ensure that the server is giving back response for the request coming from the client

## POST v1/user/

1. This endpoint is for creating a new user. Request payload for this API must contain the following properties with valid values:

2. Properties to be included in the request payload

   1. first_name
   2. last_name
   3. username
   4. password

3. Properties to be discarded in the request payload. Even if the below listed properties are included in the request payload, those values should not be set in the record of the newly created user. Values are generated programatically.

   1. id (generated on server)
   2. account_created (generated on server)
   3. account_updated (generated on server)

4. Failing to include any of the above listed properties or giving empty values for any property in the request payload will result in 400 Bad request error as the response from the server.
5. If the client is requesting the server to create a record with a payload consisting of a username which is already existing in the database, the server will return a 400 Bad Request, with a status message as Record Exists.

6. If the username is unique and all other values are valid, then the server will return a response of 201, authenticated.

## GET v1/user/:userId

1. This endpoint is for reteiving details of an existing user. There must be a valid value for the request parameter coming from the client.

2. This request must be setup with Basic Auth where the provided username and password is combined and encoded to a base64 token and that token is passed in the header and then the request should be sent to the server. Failing to include auth will result in 401 Unauthorized error.

3. After validating username and password with Basic auth, request param userId is validated. Following are the validations for userId request param

   1. For non numerical value of userId, server wil return 400 Bad Request error.
   2. For a numerical value, the control is pased on to further verification

4. Properties to be included in the request payload. If not included or if the value is empty, server will return a response of 400 Bad Request error.

   1. first_name
   2. last_name
   3. password

5. Properties to be discarded in the request payload. Even if the below listed properties are included in the request payload, those values should not be set in the record of the newly created user. Values are generated programatically.

   1. id (generated on server)
   2. account_created (generated on server)
   3. account_updated (generated on server)

6. Upon successful validation of all inputs, username and password is decoded from the base64 auth token. A record is fetched from db with the provided userId. Following checks are done further :

   1. If no record is found with the given userId, server will return 400 Bad Request.
   2. If a record is fetched, fetched record's username is compared to username decoded from auth_token. If there's a mismatch, server will return 403 Forbidden
   3. If the usernames matched and password's not matched, then the server will return a response of 401 Uauthorized
   4. If username and password is matched, then the server will return a response of 200, ok.

## PUT v1/user/:userId

1. This endpoint is for updating details of an existing user. There must be a valid value for the request parameter coming from the client.

2. This request must be setup with Basic Auth where the provided username and password is combined and encoded to a base64 token and that token is passed in the header and then the request should be sent to the server. Failing to include auth will result in 401 Unauthorized error.

3. After validating username and password with Basic auth, request param userId is validated. Following are the validations for userId request param

   1. For non numerical value of userId, server wil return 400 Bad Request error.
   2. For a numerical value, the control is pased on to further verification

4. Properties to be included in the request payload. If the values for these inputs are empty, the the server will return a response of 400 Bad Request.

   1. first_name
   2. last_name
   3. password

5. If the below listed properties are included in the request payload, then the server will throw a response of 400 Bad Request.

   1. username (cannot be modified)
   2. account_created (cannot be modified)
   3. account_updated (cannot be modified)

6. Upon successful validation of all inputs, username and password is decoded from the base64 auth token. A record is fetched from db with the provided userId. Following checks are done further :

   1. If no record is found with the given userId, server will return 400 Bad Request.
   2. If a record is fetched, fetched record's username is compared to username decoded from auth_token. If there's a mismatch, server will return 403 Forbidden
   3. If the usernames matched and password's not matched, then the server will return a response of 401 Uauthorized
   4. If username and password is matched, then the rpovided user details are updated for the particular user.

# Products API

## APIs for Testing

1. GET /healthz
2. POST /v5/product
3. GET /v5/product/:productId
4. PATCH /v5/product/:productId
5. PUT /v5/product/:productId
6. DELETE /v5/product/:productId

## API Workflow

## POST /v5/product

1. The code is an implementation of a create product API endpoint using the Express framework. The API endpoint handles the creation of a new product in the database.

2. The createProductController function is the endpoint handler that receives the incoming HTTP request and sends the response. It performs the following actions:

3. Checks if the authorization header is present in the request. If not, it sends a 401 response with the message "Unauthorized".

4. Verifies if the request body contains the owner_user_id, date_added or date_last_updated fields. If any of these fields are present, it sends a 400 response with the message "Bad Request".

5. If the authorization header is present and the request body does not contain the specified fields, the code calls the createProduct function, passing the authorization header and request body as arguments.

The createProduct function performs the following steps:

1. Decodes the username and password from the authorization header using the decodeCredentials function.

2. Finds the user in the database using the username obtained from the authorization header.

3. If the user exists, it performs password validation using the comparePasswords function.

4. If the username and password match, it creates a new product in the database using the Product.findOrCreate method. The sku field is used as the key for the search in the database. If the product already exists, it sends a 400 response with the message "Bad Request. Product With Given Sku Already Exists". If the product does not exist, it sends a 200 response with the message "Product created successfully" and the product details in the response body.

5. If the username and password do not match, it sends a 401 response with the message "Unauthorized".

6. Overall, this code provides an implementation of a create product API endpoint that performs authentication and validation checks before adding a new product to the database.

## GET /v5/product/:productId

1. When a request is received, the function first tries to retrieve the productId from the request parameters. If it's not present, it sends a response with a status code of 400 (Bad Request) and a JSON object with a message indicating that the request was malformed.

2. If the productId is present, the function calls the getProduct function, passing the productId as an argument. This function is responsible for querying the database for a product with a matching id. If a product is found, it returns an object with a status code of 200 (OK) and a JSON object containing the product information. If no product is found, it returns an object with a status code of 404 (Not Found) and a JSON object with a message indicating that the product could not be found.

3. If an error occurs during the execution of the function, it logs the error to the console and sends a response with a status code of 400 (Bad Request) and a JSON object with a message indicating that a validation error occurred.

## PATCH /v5/product/:productId and PUT /v5/product/:productId

1. It takes two parameters: request and response. It retrieves the product ID from the URL parameters and passes it to the getProduct function to fetch the product information. The function then sends the response with the product information to the client. If there is an error in fetching the product information, it sends a response with a validation error message.

2. It takes three parameters: productId, productDetails, and auth_header. First, it decodes the credentials from the auth_header to determine the identity of the requester. It then retrieves the user from the database using the decoded username and validates the password. If the username and password are valid, it retrieves the product from the database using the productId and checks if the requester is the owner of the product. If the requester is the owner, it updates the product information in the database using the productDetails and returns a success response to the client. If the requester is not the owner, it returns a forbidden response. If the product does not exist, it returns a bad request response.

## DELETE /v5/product/:productId

1. The endpoint is implemented as the deleteProductController function, which is triggered by an HTTP DELETE request to the specified URL route.

2. The function starts by checking if there is an Authorization header in the request. If there isn't, the function sends a 401 Unauthorized response, indicating that the user must authenticate to access the resource.

3. Next, the function checks if the product ID is present in the URL route parameters. If it isn't, the function sends a 400 Bad Request response, indicating that the request is malformed.

4. If both the Authorization header and product ID are present, the function calls the deleteProduct function, passing in the product ID and the Authorization header. The deleteProduct function first decodes the username and password from the Authorization header using the decodeCredentials function.

5. The deleteProduct function then uses the decoded username to search for a user in the database. If a user is found, it compares the decoded password with the stored password for that user. If the passwords match, the function searches for a product in the database with the given product ID.

6. If a product is found, the function checks if the user who is making the request is the owner of the product. If the user is the owner, the function deletes the product from the database and sends a 204 No Content response, indicating that the request was successful and there is no response body.

7. If the user is not the owner of the product, the function sends a 403 Forbidden response, indicating that the user does not have permission to access the resource.

8. If the product isn't found, the function sends a 404 Not Found response, indicating that the resource could not be found.

9. If the decoded password does not match the stored password for the user, the function sends a 401 Unauthorized response.

10. If no user is found with the decoded username, the function also sends a 401 Unauthorized response.

11. Throughout the function, appropriate messages and status codes are returned, as defined in the MESSAGES object, to provide clear and meaningful feedback to the user.

# Packer Info

- local variable timestamp that represents the current timestamp. This will used to make sure AMI created is unique

- Amazon EBS (Elastic Block Store) source to create the AMI. It sets the name of the AMI to "webapp-ami-" followed by the timestamp. It filters the source AMI based on the criteria specified by the user, such as name, root device type, and virtualization type. It also sets the AMI owner and users, and specifies the AWS region and instance type. The SSH username is also specified.

- 3 Provisioners are used in the packer config

  1.  The first provisioner copies the web application ZIP file to the EC2 instance.
  2.  The second provisioner copies the web application service file to the EC2 instance.
  3.  The third provisioner sets environment variables for the web application by appending them to the .bash_profile file. Finally, it runs a script that installs and starts the web application.

Overall, this Packer configuration creates an Amazon Machine Image for a web application that can be launched on an EC2 instance. It also sets up the environment for the application to run with the specified environment variables.

## Importing SSL cmd

aws acm import-certificate --certificate fileb://prod_pericsye_me.pem --certificate-chain fileb://prod_pericsye_me_ca_bundle.pem --private-key fileb://private_key.key --profile demo
