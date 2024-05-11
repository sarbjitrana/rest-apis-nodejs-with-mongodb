

Using environment variables to store sensitive information like secret keys is a common practice in Node.js applications. You can utilize a package like `dotenv` to load environment variables from a `.env` file into `process.env`. Here's how you can do it:

1. **Create project directory and initialize npm:**
    ```bash
    mkdir node-mongodb-rest
    cd node-mongodb-rest
    npm init -y
    ```
    
2. **Install dotenv:**
    ```bash
    npm install dotenv
    ```

 **Create a `.env` file in the root directory of your project:**
    ```plaintext
    SECRET_KEY=your_secret_key
    REFRESH_SECRET_KEY=your_refresh_secret_key
    ```


3. **Install necessary packages:**
    ```bash
    npm install express mongoose bcrypt jsonwebtoken body-parser
    ```

4. **Create `.gitignore` file to ignore `node_modules` directory:**
    ```
    node_modules
    ```
5. **you can use Postman to test your APIs. Here's how you can test each endpoint:**

 **User Signup:**

   - Set the request type to POST.
   - Set the request URL to `http://localhost:3000/auth/signup`.
   - In the Body tab, select "raw" and choose JSON from the dropdown.
   - Enter the user's email and password in JSON format:

     ```json
     {
       "email": "example@example.com",
       "password": "password123"
     }
     ```

  

**User Login:**

   - Set the request type to POST.
   - Set the request URL to `http://localhost:3000/auth/login`.
   - In the Body tab, select "raw" and choose JSON from the dropdown.
   - Enter the user's email and password in JSON format:

     ```json
     {
       "email": "example@example.com",
       "password": "password123"
     }
     ```

   - Click the "Send" button to make the request.

**Token Refresh:**

   - Set the request type to POST.
   - Set the request URL to `http://localhost:3000/auth/token-refresh`.
   - In the Body tab, select "raw" and choose JSON from the dropdown.
   - Include the refresh token in the request body:

     ```json
     {
       "refreshToken": "your_refresh_token"
     }
     ```

   - Click the "Send" button to make the request.

**Password Reset Request:**

   - Set the request type to POST.
   - Set the request URL to `http://localhost:3000/auth/reset-password-request`.
   - In the Body tab, select "raw" and choose JSON from the dropdown.
   - Enter the user's email in JSON format:

     ```json
     {
       "email": "example@example.com"
     }
     ```

   - Click the "Send" button to make the request.

**Password Reset:**

   - Set the request type to POST.
   - Set the request URL to `http://localhost:3000/auth/reset-password`.
   - In the Body tab, select "raw" and choose JSON from the dropdown.
   - Include the reset token and the new password in the request body:

     ```json
     {
       "resetToken": "your_reset_token",
       "newPassword": "new_password123"
     }
     ```

   

