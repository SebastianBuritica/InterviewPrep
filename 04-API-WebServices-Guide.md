# API & Web Services - Interview Guide

## HTTP Methods (CRUD Operations)

**Why it matters**: Understanding HTTP methods is essential for building REST APIs in NestJS and consuming them in React.

```javascript
GET     - Retrieve data (Read)
POST    - Create new resource (Create)
PUT     - Replace entire resource (Update)
PATCH   - Update specific fields (Update)
DELETE  - Remove resource (Delete)
```

### React Examples (ES6)

```javascript
// GET - Fetch data
const fetchUsers = async () => {
  const response = await fetch('https://api.example.com/users');
  const data = await response.json();
  return data;
};

// POST - Create new user
const createUser = async (userData) => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// PUT - Replace entire user
const updateUser = async (id, fullUserData) => {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullUserData)
  });
  return await response.json();
};

// PATCH - Update specific fields
const patchUser = async (id, updates) => {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates) // Only fields to update
  });
  return await response.json();
};

// DELETE - Remove user
const deleteUser = async (id) => {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'DELETE'
  });

  // DELETE often returns 204 No Content
  if (response.status === 204) return;
  return await response.json();
};
```

### NestJS Examples

```typescript
import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // GET /users - Retrieve all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id - Retrieve specific user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // POST /users - Create new user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users/:id - Replace entire user
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // PATCH /users/:id - Update specific fields
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updates: Partial<UpdateUserDto>) {
    return this.usersService.patch(id, updates);
  }

  // DELETE /users/:id - Remove user
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

**PUT vs PATCH**:
- **PUT**: Send complete object, replaces everything
- **PATCH**: Send only fields to update, more efficient

---

## HTTP Status Codes

**Why it matters**: Proper status codes help React apps handle responses correctly and NestJS APIs communicate results clearly.

### Most Important Status Codes

```javascript
// Success (2xx)
200 OK                  - Request succeeded
201 Created             - Resource created (POST)
204 No Content          - Success, no data to return (DELETE)

// Client Errors (4xx)
400 Bad Request         - Invalid request syntax
401 Unauthorized        - Authentication required/failed
403 Forbidden           - Authenticated but no permission
404 Not Found           - Resource doesn't exist
422 Unprocessable Entity - Validation failed
429 Too Many Requests   - Rate limit exceeded

// Server Errors (5xx)
500 Internal Server Error - Server crashed
503 Service Unavailable   - Server overloaded/down
```

### NestJS - Return Correct Status Codes

```typescript
import { Controller, Post, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // Return 201 Created instead of default 200
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  // Return 204 No Content for delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Throw exceptions for errors
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found'); // Returns 404
    }
    return user;
  }
}
```

### React - Handle Status Codes

```javascript
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);

  // Handle different status codes
  if (response.status === 404) {
    throw new Error('User not found');
  }

  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
    return;
  }

  if (response.status === 500) {
    throw new Error('Server error, please try again later');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
```

---

## Response Properties & Methods

**Why it matters**: React apps need to parse different response types and check request success.

### Response Properties

```javascript
const response = await fetch('/api/users');

// Properties
response.ok;          // true if status 200-299
response.status;      // HTTP status code (200, 404, etc.)
response.statusText;  // Status message ("OK", "Not Found")
response.headers;     // Headers object
response.url;         // Final URL (after redirects)
```

### Response Methods

```javascript
const response = await fetch('/api/users');

// Parse response body
await response.json();      // Parse JSON → JavaScript object
await response.text();      // Parse as plain text
await response.blob();      // Parse as binary (images, files)
await response.formData();  // Parse form data

// Example: Download image
const response = await fetch('/api/avatar.jpg');
const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

### React Hook Example

```javascript
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Usage in component
const UsersList = () => {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};
```

---

## Fetch API - Making HTTP Requests

**Why it matters**: Fetch is the modern way to make HTTP requests in React.

### Complete Examples

```javascript
// GET with error handling
const fetchUsers = async () => {
  try {
    const response = await fetch('https://api.example.com/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// POST with headers and body
const createUser = async (userData) => {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// DELETE request
const deleteUser = async (id) => {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer your-token-here'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // DELETE often returns 204 No Content
    if (response.status === 204) return;

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Abort Requests (Cancel Fetch)

```javascript
// Cancel fetch when component unmounts
const SearchComponent = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const search = async () => {
      try {
        const response = await fetch('/api/search?q=test', {
          signal: controller.signal
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch cancelled');
        } else {
          console.error('Error:', error);
        }
      }
    };

    search();

    // Cancel fetch on unmount
    return () => controller.abort();
  }, []);

  return <div>{/* render results */}</div>;
};
```

---

## REST API Best Practices

**Why it matters**: Following conventions makes APIs predictable and easier to use.

```javascript
// ✅ Good - Use nouns, plural, nested resources
GET    /api/users               // Get all users
GET    /api/users/123           // Get specific user
POST   /api/users               // Create user
PUT    /api/users/123           // Replace user
PATCH  /api/users/123           // Update user
DELETE /api/users/123           // Delete user

// Nested resources
GET    /api/users/123/posts     // Get user's posts
POST   /api/users/123/posts     // Create post for user

// Query parameters for filtering/sorting/pagination
GET    /api/users?role=admin
GET    /api/users?sort=name&order=asc
GET    /api/users?page=2&limit=20

// Versioning
GET    /api/v1/users
GET    /api/v2/users

// ❌ Bad - Don't use verbs
GET    /api/getUsers
POST   /api/createUser
DELETE /api/deleteUser
```

### NestJS Implementation

```typescript
@Controller('api/v1/users')
export class UsersController {
  // GET /api/v1/users?role=admin&page=1&limit=10
  @Get()
  findAll(@Query() query: QueryDto) {
    const { role, page = 1, limit = 10 } = query;
    return this.usersService.findAll({ role, page, limit });
  }

  // GET /api/v1/users/:id/posts
  @Get(':id/posts')
  getUserPosts(@Param('id') userId: string) {
    return this.postsService.findByUserId(userId);
  }
}
```

---

## Authentication & Authorization

**Why it matters**: Securing APIs is critical. React sends tokens, NestJS validates them.

### JWT Token Flow

```
1. User logs in → Server returns JWT token
2. React stores token (localStorage/cookies)
3. React sends token with every request
4. NestJS validates token
5. If valid → Process request
6. If invalid → Return 401
```

### React - Login & Send Token

```javascript
// Login and store token
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const { token } = await response.json();
  localStorage.setItem('token', token);
  return token;
};

// Use token in requests
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
```

### NestJS - Validate Token

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Login - Generate token
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload)
    };
  }
}

// Protect routes with Guard
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard) // Requires valid token
  getProtectedData(@Request() req) {
    // req.user contains decoded token
    return { userId: req.user.sub };
  }
}
```

### Refresh Token Pattern

```javascript
// React - Auto refresh expired tokens
const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });

  // Token expired, refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    const { accessToken } = await refreshResponse.json();
    localStorage.setItem('accessToken', accessToken);

    // Retry original request with new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  return response;
};
```

---

## CORS (Cross-Origin Resource Sharing)

**Why it matters**: React dev server (localhost:3000) and NestJS API (localhost:4000) are different origins.

### What is CORS?

Browser security that blocks requests to different domains:

```javascript
// React on localhost:3000
fetch('http://localhost:4000/api/users')
// ❌ Error: "Blocked by CORS policy"
```

### NestJS - Enable CORS

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // React app URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await app.listen(4000);
}
bootstrap();
```

### React - Development Proxy (Alternative)

```json
// package.json
{
  "proxy": "http://localhost:4000"
}
```

Now you can use relative URLs:
```javascript
// Automatically proxied to localhost:4000
fetch('/api/users')
```

**Key Point**: CORS must be fixed on the backend, not frontend.

---

## Error Handling

**Why it matters**: Apps need to handle network errors, validation errors, and server crashes gracefully.

### Centralized API Client

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

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ApiError('Network error - check connection', 0);
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
    return this.request(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Usage
const api = new ApiClient('https://api.example.com');

try {
  const users = await api.get('/users');
} catch (error) {
  if (error.status === 404) {
    console.log('Not found');
  } else if (error.status === 0) {
    console.log('Network error');
  }
}
```

### NestJS - Global Exception Filter

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

// Apply globally in main.ts
app.useGlobalFilters(new GlobalExceptionFilter());
```

---

## Axios (Popular Alternative to Fetch)

**Why it matters**: Axios has simpler syntax and built-in features like interceptors.

### Basic Usage

```javascript
import axios from 'axios';

// GET
const users = await axios.get('/api/users');
console.log(users.data); // Auto-parsed JSON

// POST
await axios.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT/PATCH/DELETE
await axios.put(`/api/users/${id}`, userData);
await axios.patch(`/api/users/${id}`, { email: 'new@email.com' });
await axios.delete(`/api/users/${id}`);
```

### Axios Instance with Defaults

```javascript
// Create configured instance
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// Use instance
const users = await api.get('/users');
await api.post('/users', userData);
```

### Interceptors (Add Token to All Requests)

```javascript
// Request interceptor - Add token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Fetch vs Axios**:
- **Fetch**: Built-in, no install needed, more verbose
- **Axios**: Third-party, simpler syntax, more features

---

## Interview Questions

### Q1: What's the difference between PUT and PATCH?

**Answer**:
- **PUT**: Replaces entire resource. Must send all fields, missing fields become null.
- **PATCH**: Updates only specified fields. More efficient.

```javascript
// PUT - Must send complete object
await fetch('/api/users/123', {
  method: 'PUT',
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    age: 30
  })
});

// PATCH - Only send what changed
await fetch('/api/users/123', {
  method: 'PATCH',
  body: JSON.stringify({
    email: 'newemail@example.com'
  })
});
```

**Use PATCH** for most updates to avoid accidental data loss.

---

### Q2: Explain Authentication vs Authorization

**Answer**:
- **Authentication**: *Who are you?* Verifies identity (login)
- **Authorization**: *What can you do?* Checks permissions (roles)

```javascript
// Authentication - Verify identity
POST /api/auth/login { email, password }
→ Returns JWT token

// Authorization - Check permissions
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete('/users/:id')
// Only admins can delete users
```

---

### Q3: How does CORS work and when do you encounter it?

**Answer**:
CORS is browser security that prevents requests to different domains.

```javascript
// React on localhost:3000
fetch('http://localhost:4000/api/users')
// ❌ CORS error
```

**Solution**: Backend must allow the origin:
```typescript
// NestJS
app.enableCors({
  origin: 'http://localhost:3000'
});
```

**Frontend cannot fix CORS** - it's a server configuration.

---

### Q4: What status code should DELETE return?

**Answer**:
- **204 No Content**: Most common, indicates success with no response body
- **200 OK**: Can return deleted resource
- **404 Not Found**: If resource doesn't exist

```typescript
// NestJS
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

---

### Q5: How do you handle token expiration?

**Answer**:
Use **access token** (short-lived) + **refresh token** (long-lived):

1. Access token expires → Get 401
2. Use refresh token to get new access token
3. Retry original request
4. If refresh fails → Redirect to login

```javascript
const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  let response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    // Refresh token
    const newToken = await refreshAccessToken();
    // Retry with new token
    response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${newToken}` }
    });
  }

  return response;
};
```

---

## Best Practices Summary

1. **Use proper HTTP methods**: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
2. **Return correct status codes**: 200 (ok), 201 (created), 204 (no content), 404 (not found)
3. **Handle errors gracefully**: Try-catch, show user-friendly messages
4. **Secure authentication**: Use JWT tokens, httpOnly cookies, refresh tokens
5. **Enable CORS**: Configure in NestJS for cross-origin requests
6. **Use interceptors**: Add tokens to all requests automatically (Axios)
7. **Validate responses**: Check `response.ok` and status codes
8. **Centralize API calls**: Create ApiClient class
9. **Cancel requests**: Use AbortController when component unmounts
10. **Follow REST conventions**: Plural nouns, nested resources, query params
