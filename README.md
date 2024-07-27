
# Subspace Fintech Application

Welcome to the Subspace Fintech Application! This project is a simplified fintech backend and UI assignment that allows users to manage their accounts and perform simple transactions like deposits and withdrawals using Node.js and Hasura GraphQL.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [License](#license)

## Features

- User authentication with JWT
- Create user accounts
- Deposit and withdraw funds
- Fetch account details

## Tech Stack

- Node.js
- Express.js
- GraphQL (Hasura)
- JWT for authentication
- HTML, CSS, JavaScript for the frontend

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker (for Hasura and PostgreSQL)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/divyarupa0703/subspavce.git
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Hasura and PostgreSQL with Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Configure Hasura:**
   - Open Hasura console:
     ```bash
     hasura console
     ```
   - Configure your GraphQL endpoint and admin secret in `server.js`.

5. **Start the backend server:**
   ```bash
   node server.js
   ```

### Frontend Setup

1. **Open the `index.html` file in your browser.**

## API Documentation

### Login
- **Endpoint:** `/api/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token"
  }
  ```

### Sign-Up
- **Endpoint:** `/api/signup`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "username": "your_username",
    "password": "your_password",
    "email": "your_email@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token"
  }
  ```

### Fetch Account Details
- **Endpoint:** `/api/account`
- **Method:** GET
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "account_number": "123456789012",
      "balance": 1000.00,
      "is_closed": false
    }
  ]
  ```

### Deposit
- **Endpoint:** `/api/deposit`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token",
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "amount": 100.00
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "balance": 1100.00
    }
  ]
  ```

### Withdraw
- **Endpoint:** `/api/withdraw`
- **Method:** POST
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token",
    "Content-Type": "application/json"
  }
  ```
- **Request Body:**
  ```json
  {
    "amount": 100.00
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "balance": 900.00
    }
  ]
  ```

## Usage

- **Sign Up:** Create a new user account using the sign-up form.
- **Login:** Authenticate using your credentials to receive a JWT token.
- **Account Actions:** Use the JWT token to access account details, deposit funds, and withdraw funds.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Feel free to customize this `README.md` file as needed!
