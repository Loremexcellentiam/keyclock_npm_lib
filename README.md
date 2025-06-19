# 🔐 lorem-keycloak-client

A lightweight Node.js SDK to manage users, login, and authorization in **Keycloak**. Ideal for teams that want to interact with Keycloak programmatically — register users, log in, reset passwords, and secure routes.

---

## 🔧 Usage

### 1. Register a User

```js
const registerUser = require('lorem-keycloak-client/lib/registerUser');

await registerUser({
  email: 'user@example.com',
  username: 'user@example.com',
  password: 'SecurePass123',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  baseUrl: 'https://auth.example.com',
  realm: 'YourRealm',
  role: 'user',
  attributes: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '1234567890',
  }
});
```

---

### 2. Login a User

```js
const loginUser = require('lorem-keycloak-client/lib/loginUser');

const tokens = await loginUser({
  username: 'user@example.com',
  password: 'SecurePass123',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  baseUrl: 'https://auth.example.com',
  realm: 'YourRealm'
});
```

---

### 3. Reset Password

```js
const resetPassword = require('lorem-keycloak-client/lib/resetPassword');

await resetPassword({
  userId: 'keycloak-user-id',
  newPassword: 'NewPass456',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  baseUrl: 'https://auth.example.com',
  realm: 'YourRealm'
});
```

---

### 4. Secure Your Routes with Middleware

```js
const authMiddleware = require('lorem-keycloak-client/lib/authMiddleware');

app.get(
  '/admin',
  authMiddleware({
    clientId: 'your-client-id',
    requiredRoles: ['admin'],
    baseUrl: 'https://auth.example.com',
    realm: 'YourRealm'
  }),
  (req, res) => {
    res.json({ message: 'Welcome Admin', user: req.user });
  }
);
```

---

## 👨🏽‍💻 Local Development

```bash
npm install
npm run dev
```

To test the library locally:

```bash
npm link
cd your-other-project
npm link lorem-keycloak-client
```

---

## 🤝 Contributing

1. Fork this repo
2. Make your changes in a feature branch
3. Submit a PR with a detailed description

---

## 🛡 License

MIT License © 2025 Gbolahan Adegoke

---

## 💬 Need Help?

Open an [issue here](https://github.com/Loremexcellentiam/keyclock_npm_lib/issues), or message your team lead.

