import express from 'express';
import { GraphQLClient, gql } from 'graphql-request';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // For parsing application/json

// Define the GraphQL endpoint and admin secret
const endpoint = 'http://localhost:8080/v1/graphql'; // Your GraphQL endpoint URL
const adminSecret = 'myadminsecretkey'; // Replace with your actual Hasura admin secret

const client = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': adminSecret,
  },
});

const jwtSecret = 'your_jwt_secret'; // Replace with a strong secret key for JWT

// Define GraphQL queries and mutations
const loginQuery = gql`
  query Login($username: String!, $password: String!) {
    users(where: {username: {_eq: $username}, password: {_eq: $password}}) {
      id
      username
      email
    }
  }
`;

const signUpMutation = gql`
  mutation SignUp($username: String!, $password: String!, $email: String!) {
    insert_users_one(object: { username: $username, password: $password, email: $email }) {
      id
    }
  }
`;

const accountMutation = gql`
  mutation CreateAccount($userId: Int!, $accountNumber: String!) {
    insert_accounts_one(object: {
      user_id: $userId,
      account_number: $accountNumber,
      balance: 0.00
    }) {
      id
    }
  }
`;

const accountDetailsQuery = gql`
  query GetAccountDetails($userId: Int!) {
    accounts(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      account_number
      balance
      is_closed
    }
  }
`;

const depositMutation = gql`
  mutation Deposit($userId: Int!, $amount: numeric!) {
    update_accounts(
      where: { user_id: { _eq: $userId } }
      _inc: { balance: $amount }
    ) {
      returning {
        id
        balance
      }
    }
  }
`;

const withdrawMutation = gql`
  mutation Withdraw($userId: Int!, $amount: numeric!) {
    update_accounts(
      where: { user_id: { _eq: $userId } }
      _inc: { balance: $amount }
    ) {
      returning {
        id
        balance
      }
    }
  }
`;

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Logging in with username: ${username}`);

  try {
    const data = await client.request(loginQuery, { username, password });
    console.log('Login response data:', data);

    if (data.users.length > 0) {
      const user = data.users[0];
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Sign-Up endpoint
const generateAccountNumber = () => {
  return crypto.randomInt(100000000000, 999999999999).toString();
};

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log(`Signing up user: ${username}`);

  try {
    // Step 1: Insert User
    const userData = await client.request(signUpMutation, { username, password, email });
    const userId = userData.insert_users_one.id;

    // Step 2: Generate account number and Insert Account
    const accountNumber = generateAccountNumber();
    await client.request(accountMutation, { userId, accountNumber });

    // Step 3: Generate and return JWT token
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Fetch account details endpoint
app.get('/api/account', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  console.log(`Fetching account details for userId: ${userId}`);
  
  try {
    const data = await client.request(accountDetailsQuery, { userId });
    res.json(data.accounts);
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Deposit endpoint
app.post('/api/deposit', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  console.log(`Processing deposit for userId: ${userId}, amount: ${amount}`);
  
  try {
    const data = await client.request(depositMutation, { userId, amount });
    res.json(data.update_accounts.returning);
  } catch (error) {
    console.error('Error making deposit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Withdraw endpoint
app.post('/api/withdraw', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  console.log(`Processing withdrawal for userId: ${userId}, amount: ${amount}`);
  
  try {
    const data = await client.request(withdrawMutation, { userId, amount: -amount });
    res.json(data.update_accounts.returning);
  } catch (error) {
    console.error('Error making withdrawal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
