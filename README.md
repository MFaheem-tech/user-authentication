# User Authentication Project

This project provides a user authentication system using Node.js, Express, and MongoDB. It includes various endpoints for user registration, login, password reset, email verification, and profile management.

## Features

- User registration with email verification
- User login with JWT authentication
- Forgot password functionality with email verification code
- Reset password with email verification code
- Resend email verification code
- Resend forgot password code
- Update user profile

## Technologies Used

- Node.js
- Express
- MongoDB

## Libraries

- bcryptjs
- cors
- dotenv
- express-async-handler
- joi
- jsonwebtoken
- mongoose
- nodemailer

## Setup

1. Clone the repository:

```
git clone https://github.com/MFaheem-tech/user-authentication.git
```

2. Install dependencies:

```
cd your-repo
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```
MONGO_URL =

PORT = 4000

SMPT_HOST =

SMPT_PORT =

SMPT_SERVICE = gmail

SMPT_USER = your_email

SMPT_PASSWORD = your_password

SMPT_MAIL = your_email

JWT_SECRET = your_secret
```

4. Start the server:

```
npm start
```

## API Endpoints

### Signup

- `POST /api/v1/users/signup`
  - Registers a new user.

### Signin

- `POST /api/v1/users/signin`
  - Logs in an existing user.

### Forgot Password

- `POST /api/v1/users/forgotpassword`
  - Sends a reset password link to the user's email.

### Verify Email

- `POST /api/v1/users/verifyemail`
  - Verifies the user's email using a verification code.

### Resend Verification Code

- `POST /api/v1/users/resendverificationcode`
  - Resends the verification code to the user's email.

### Resend Forgot Password Code

- `POST /api/v1/users/resendforgotpasswordcode`
  - Resends the forgot password code to the user's email.

### Verify Code

- `POST /api/v1/users/verifycode`
  - Verifies a code (either for email verification or password reset).

### Reset Password

- `POST /api/v1/users/resetpassword`
  - Resets the user's password.

### Profile

- `GET /api/v1/users/profile`
  - Retrieves the user's profile information.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and submit a pull request.
