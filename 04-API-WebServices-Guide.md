# API & Web Services Interview Guide

## REST API Fundamentals

### HTTP Methods
```
GET     - Retrieve resource(s)
POST    - Create new resource
PUT     - Update/replace entire resource
PATCH   - Partial update of resource
DELETE  - Remove resource
OPTIONS - Describe communication options
```

### HTTP Status Codes
```
2xx - Success
200 OK                  - Successful request
201 Created             - Resource created
204 No Content          - Success but no data to return

3xx - Redirection
301 Moved Permanently
304 Not Modified

4xx - Client Errors
400 Bad Request         - Invalid syntax
401 Unauthorized        - Authentication required
403 Forbidden           - No permission
404 Not Found           - Resource doesn't exist
409 Conflict            - Request conflicts with current state
422 Unprocessable Entity - Validation error
429 Too Many Requests   - Rate limit exceeded

5xx - Server Errors
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

### REST API Best Practices

```javascript
// 1. Use nouns, not verbs in endpoints
// Good
GET    /users
GET    /users/123
POST   /users
PUT    /users/123
DELETE /users/123

// Bad
GET    /getUsers
POST   /createUser

// 2. Use plural nouns
GET /users     // Good
GET /user      // Bad

// 3. Use nested resources for relationships
GET /users/123/posts
GET /users/123/posts/456

// 4. Use query parameters for filtering, sorting, pagination
GET /users?role=admin
GET /users?sort=name&order=asc
GET /users?page=2&limit=20

// 5. Version your API
GET /api/v1/users
GET /api/v2/users
```

## Fetch API

### Basic Usage
```javascript
// GET request
async function fetchUsers() {
  try {
    const response = await fetch('https://api.example.com/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// POST request
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// PUT - Full update
async function updateUser(id, fullUserData) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullUserData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// PATCH - Partial update
async function patchUser(id, updates) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error patching user:', error);
    throw error;
  }
}

// DELETE - No body needed, ID is in URL
async function deleteUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer token123'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // DELETE often returns 204 No Content, so check before parsing
    if (response.status !== 204) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
```

### Response Methods
```javascript
const response = await fetch(url);

await response.json();        // Parse as JSON
await response.text();        // Parse as text
await response.blob();        // Parse as blob (for images, files)
await response.formData();    // Parse as FormData

// Response properties
response.ok;                  // true if status 200-299
response.status;              // HTTP status code
response.statusText;          // Status message
response.headers;             // Headers object
```

### Abort Requests
```javascript
async function fetchWithAbort(url) {
  const controller = new AbortController();

  // Abort after 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    clearTimeout(timeoutId); // Clear timeout if successful
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error:', error);
    }
    throw error;
  }
}

// Usage
try {
  const data = await fetchWithAbort('https://api.example.com/users');
  console.log(data);
} catch (error) {
  // Handle abort or other errors
}

// Manual abort example
const controller = new AbortController();

setTimeout(() => controller.abort(), 3000); // Abort after 3 seconds

try {
  const response = await fetch(url, { signal: controller.signal });
  const data = await response.json();
  console.log(data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was aborted');
  }
}
```

## Axios (Popular Alternative)

```javascript
import axios from 'axios';

// GET
const response = await axios.get('/api/users');
const users = response.data;

// POST
await axios.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT/PATCH/DELETE
await axios.put(`/api/users/${id}`, userData);
await axios.patch(`/api/users/${id}`, { email: 'new@email.com' });
await axios.delete(`/api/users/${id}`);

// Interceptors - Add token to all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle unauthorized globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Redirect to login
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Create instance with defaults
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});
```

## CORS (Cross-Origin Resource Sharing)

### What is CORS?
Browser security feature that restricts web pages from making requests to a different domain.

```javascript
// Error: "Access to fetch has been blocked by CORS policy"

// Frontend CANNOT fix CORS - server must allow it
// Server needs to send headers:
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Preflight Requests
For complex requests (custom headers, methods other than GET/POST), browser sends OPTIONS request first to check if allowed.

## Authentication & Authorization

### JWT (JSON Web Token)
```javascript
// Token structure: header.payload.signature

// Login flow
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const { token } = await response.json();
  localStorage.setItem('token', token);
  return token;
}

// Use token in requests
async function fetchProtectedData() {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
}

// Logout
function logout() {
  localStorage.removeItem('token');
}
```

### Refresh Tokens
```javascript
async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');

  // Try with access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // If unauthorized, refresh token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    const { accessToken: newToken } = await refreshResponse.json();
    localStorage.setItem('accessToken', newToken);

    // Retry original request
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      }
    });
  }

  return response;
}
```

## WebSockets

### When to Use
- Real-time applications (chat, notifications)
- Live updates (stock prices, sports scores)
- Collaborative editing
- Gaming

### Basic WebSocket Usage
```javascript
// Create connection
const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello Server!');
};

// Receive messages
ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

// Handle errors
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Connection closed
ws.onclose = () => {
  console.log('Disconnected');
};

// Send data
ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));

// Close connection
ws.close();
```

### React WebSocket Hook
```javascript
function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };

    ws.current.onclose = () => setIsConnected(false);

    return () => ws.current.close();
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { messages, isConnected, sendMessage };
}
```

## Error Handling

### Centralized Error Handler
```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle HTTP errors
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message, response.status, error);
      }

      return await response.json();
    } catch (error) {
      // Network errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error - please check your connection', 0);
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Usage
const api = new ApiClient('https://api.example.com');

try {
  const users = await api.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.message);
  }
}
```

## Rate Limiting & Retries

### Exponential Backoff
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Wait before retry
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Conversational Interview Q&A

### Q: "What's the difference between PUT and PATCH?"

**Answer**: "Both update resources, but differently:

**PUT** - Full replacement:
```javascript
// PUT replaces entire resource
PUT /api/users/123
{
  "name": "John",
  "email": "john@example.com",
  "age": 30
}
// Must send ALL fields, missing fields become null/undefined
```

**PATCH** - Partial update:
```javascript
// PATCH updates only specified fields
PATCH /api/users/123
{
  "email": "newemail@example.com"
}
// Only updates email, other fields unchanged
```

**When to use:**
- **PUT**: When you have the complete resource and want to replace it
- **PATCH**: When you only want to update specific fields

**Best practice**: Use PATCH for most updates in modern APIs - it's more efficient and prevents accidental data loss."

### Q: "Explain the difference between Authentication and Authorization"

**Answer**: "They serve different purposes in security:

**Authentication** - *Who are you?*
- Verifies user identity
- Login with username/password
- Proves you are who you claim to be
- Example: JWT token after login

**Authorization** - *What can you do?*
- Determines permissions
- Checks if authenticated user has access
- Controls what actions user can perform
- Example: Admin vs regular user roles

**Real-world example:**
```javascript
// Authentication - Verify identity
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password);
  const token = generateJWT(user);
  res.json({ token });
});

// Authorization - Check permissions
app.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  // Only admins can delete users
  await deleteUser(req.params.id);
});
```

**Think of it like:**
- Authentication = Security check at building entrance (ID verification)
- Authorization = Key card access to specific floors (permission levels)"

### Q: "How would you handle rate limiting in a frontend application?"

**Answer**: "Rate limiting protects APIs from abuse. Here's how to handle it:

**1. Detect rate limiting:**
```javascript
if (response.status === 429) {
  // Too Many Requests
  const retryAfter = response.headers.get('Retry-After');
}
```

**2. Implement exponential backoff:**
```javascript
async function fetchWithBackoff(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url);

    if (response.status === 429) {
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }
  throw new Error('Max retries reached');
}
```

**3. Client-side throttling:**
```javascript
// Limit requests to 10 per second
const throttle = (fn, delay) => {
  let lastCall = 0;
  return async (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) {
      await new Promise(r => setTimeout(r, delay - (now - lastCall)));
    }
    lastCall = Date.now();
    return fn(...args);
  };
};

const throttledFetch = throttle(fetch, 100);
```

**4. Show user feedback:**
```javascript
if (response.status === 429) {
  showNotification('Too many requests. Please wait a moment.');
}
```

**Best practices:**
- Respect Retry-After headers
- Use exponential backoff
- Cache responses when possible
- Batch requests when appropriate
- Show clear user feedback"

### Q: "Explain CORS and when you encounter it"

**Answer**: "CORS (Cross-Origin Resource Sharing) is a browser security feature:

**What it does:**
Prevents a webpage from making requests to a different domain than the one that served the page.

**When you encounter it:**
```javascript
// Frontend on localhost:3000
fetch('https://api.example.com/users')
// Error: "Blocked by CORS policy"
```

**Why it exists:**
Security - prevents malicious sites from reading your data from other sites.

**How to fix it:**

**Backend must add headers:**
```javascript
// Express example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

**Frontend CANNOT fix CORS** - it's a server-side configuration.

**Development workarounds:**
1. Proxy in package.json (React):
```json
"proxy": "https://api.example.com"
```

2. Browser extension (NOT for production)
3. CORS proxy service (NOT for production)

**Preflight requests:**
For complex requests, browser sends OPTIONS first:
```
OPTIONS /api/users
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

Server responds:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST
```

**Key point:** CORS is browser-enforced. Postman/curl work fine because they don't enforce CORS."

### Q: "When would you use WebSockets vs HTTP polling?"

**Answer**: "Choose based on your use case:

**WebSockets** - Full-duplex communication:

**Use when:**
- Real-time bidirectional communication needed
- Frequent updates (chat, live collaboration)
- Low latency required
- Server needs to push data instantly

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  // Instant updates from server
  updateUI(event.data);
};
```

**Pros:**
- True real-time
- Low latency
- Efficient (persistent connection)
- Server can push anytime

**Cons:**
- More complex
- Harder to scale
- Stateful connections
- Firewall issues

**HTTP Polling** - Periodic requests:

**Use when:**
- Updates not time-critical
- Simple to implement
- Updates infrequent (every few minutes)
- RESTful architecture preferred

**Example:**
```javascript
// Poll every 5 seconds
setInterval(async () => {
  const data = await fetch('/api/status');
  updateUI(data);
}, 5000);
```

**Pros:**
- Simple
- Works everywhere
- Stateless
- Easy to debug

**Cons:**
- Delayed updates
- Wasteful (empty responses)
- Higher latency
- Server load

**Comparison:**

| Feature | WebSocket | Polling |
|---------|-----------|---------|
| **Latency** | Very low | Higher |
| **Efficiency** | High | Low |
| **Complexity** | Higher | Lower |
| **Real-time** | Yes | No |
| **Scaling** | Harder | Easier |

**Long Polling** (middle ground):
```javascript
async function longPoll() {
  while (true) {
    const response = await fetch('/api/updates');
    const data = await response.json();
    updateUI(data);
    // Immediately start next request
  }
}
```

**My recommendation:**
- **Chat, gaming, live collaboration** → WebSockets
- **Dashboard updates every 30s** → Regular polling
- **Notifications** → Long polling or WebSockets
- **Stock prices** → WebSockets"

### Q: "How do you handle token expiration and refresh tokens?"

**Answer**: "Token refresh prevents users from being logged out constantly:

**Flow:**
1. User logs in → Gets access token (short-lived, 15min) + refresh token (long-lived, 7 days)
2. Use access token for API requests
3. When access token expires → Use refresh token to get new access token
4. When refresh token expires → User must log in again

**Implementation:**
```javascript
class AuthService {
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  }

  async fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Token expired
    if (response.status === 401) {
      try {
        // Get new access token
        accessToken = await this.refreshAccessToken();

        // Retry request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } catch (error) {
        // Refresh failed - redirect to login
        window.location = '/login';
        throw error;
      }
    }

    return response;
  }
}
```

**Axios interceptor approach:**
```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        window.location = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**Security best practices:**
- Store refresh token in httpOnly cookie (more secure than localStorage)
- Access token: short-lived (15 min)
- Refresh token: longer (7 days)
- Rotate refresh tokens on each use
- Invalidate all tokens on logout"

## Best Practices

1. **Use proper HTTP methods** - GET for reading, POST for creating, PUT/PATCH for updating
2. **Handle errors gracefully** - Show user-friendly messages
3. **Implement retries** - With exponential backoff for transient failures
4. **Cache when appropriate** - Reduce unnecessary requests
5. **Use interceptors** - For auth tokens and global error handling
6. **Secure tokens** - httpOnly cookies > localStorage
7. **Validate responses** - Check status codes and data shape
8. **Use TypeScript** - Type API responses for safety
9. **Centralize API calls** - Single source of truth
10. **Monitor and log** - Track API errors and performance
