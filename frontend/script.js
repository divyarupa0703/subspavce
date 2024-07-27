let token = '';

function showSignUpForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

async function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;

    const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });
    const data = await response.json();
    if (data.success) {
        alert('Sign up successful');
        showLoginForm();
    } else {
        alert('Sign up failed');
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
        token = data.token;
        alert('Login successful');
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('account-actions').classList.remove('hidden');
    } else {
        alert('Login failed');
    }
}

async function getAccountDetails() {
    const response = await fetch('http://localhost:3000/api/account', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.length > 0) {
        const account = data[0];
        const accountDetailsHtml = `
            <table>
                <tr>
                    <th>ID</th>
                    <td>${account.id}</td>
                </tr>
                <tr>
                    <th>User ID</th>
                    <td>${account.user_id}</td>
                </tr>
                <tr>
                    <th>Account Number</th>
                    <td>${account.account_number}</td>
                </tr>
                <tr>
                    <th>Balance</th>
                    <td>${account.balance}</td>
                </tr>
                <tr>
                    <th>Is Closed</th>
                    <td>${account.is_closed}</td>
                </tr>
            </table>
        `;
        document.getElementById('account-details').innerHTML = accountDetailsHtml;
    } else {
        document.getElementById('account-details').innerText = 'No account details found';
    }
}

async function deposit() {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    const response = await fetch('http://localhost:3000/api/deposit', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (data.length > 0) {
        alert(`Deposit successful. New balance: ${data[0].balance}`);
        getAccountDetails();
    } else {
        alert('Deposit failed');
    }
}

async function withdraw() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (data.length > 0) {
        alert(`Withdrawal successful. New balance: ${data[0].balance}`);
        getAccountDetails();
    } else {
        alert('Withdrawal failed');
    }
}

function logout() {
    token = '';
    alert('Logged out successfully!');
    location.reload();
}
