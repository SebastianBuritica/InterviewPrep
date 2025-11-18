// ============================================
// PROMISES VS ASYNC/AWAIT - EJEMPLOS
// ============================================

console.log('=== EJEMPLOS DE PROMISES Y ASYNC/AWAIT ===\n');

// ============================================
// EJEMPLO 1: FETCH CON PROMISES
// ============================================
console.log('--- EJEMPLO 1: GET CON PROMISES ---\n');

function getUserWithPromises() {
  fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => {
      return response.json();
    })
    .then(user => {
      console.log('Nombre:', user.name);
      console.log('Email:', user.email);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Descomenta para probar:
// getUserWithPromises();


// ============================================
// EJEMPLO 2: MISMO FETCH CON ASYNC/AWAIT
// ============================================
console.log('\n--- EJEMPLO 2: GET CON ASYNC/AWAIT ---\n');

async function getUserWithAsync() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const user = await response.json();

    console.log('Nombre:', user.name);
    console.log('Email:', user.email);
    return user;

  } catch (error) {
    console.error('Error:', error);
  }
}

// Descomenta para probar:
// getUserWithAsync();


// ============================================
// EJEMPLO 3: POST REQUEST CON PROMISES
// ============================================
console.log('\n--- EJEMPLO 3: POST CON PROMISES ---\n');

function createPostPromises() {
  const newPost = {
    title: 'Mi post',
    body: 'Contenido del post',
    userId: 1
  };

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
  })
    .then(response => response.json())
    .then(post => {
      console.log('Post creado:', post.title);
      console.log('ID:', post.id);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Descomenta para probar:
// createPostPromises();


// ============================================
// EJEMPLO 4: POST REQUEST CON ASYNC/AWAIT
// ============================================
console.log('\n--- EJEMPLO 4: POST CON ASYNC/AWAIT ---\n');

async function createPostAsync() {
  try {
    const newPost = {
      title: 'Mi post',
      body: 'Contenido del post',
      userId: 1
    };

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    });

    const post = await response.json();

    console.log('Post creado:', post.title);
    console.log('ID:', post.id);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Descomenta para probar:
// createPostAsync();


// ============================================
// EJEMPLO 5: MÚLTIPLES REQUESTS EN PARALELO
// ============================================
console.log('\n--- EJEMPLO 5: MÚLTIPLES REQUESTS (PARALELO) ---\n');

async function getThreeUsersAsync() {
  try {
    // Crear las 3 promises (se ejecutan en paralelo)
    const p1 = fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json());
    const p2 = fetch('https://jsonplaceholder.typicode.com/users/2').then(r => r.json());
    const p3 = fetch('https://jsonplaceholder.typicode.com/users/3').then(r => r.json());

    // Esperar a que todas terminen
    const users = await Promise.all([p1, p2, p3]);

    console.log('Usuario 1:', users[0].name);
    console.log('Usuario 2:', users[1].name);
    console.log('Usuario 3:', users[2].name);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Descomenta para probar:
// getThreeUsersAsync();


// ============================================
// EJEMPLO 6: DESTRUCTURING CON PROMISE.ALL
// ============================================
console.log('\n--- EJEMPLO 6: DESTRUCTURING ---\n');

async function getUserAndPosts() {
  try {
    // Fetch de usuario y posts en paralelo
    const [user, posts] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/posts?userId=1').then(r => r.json())
    ]);

    console.log('Usuario:', user.name);
    console.log('Cantidad de posts:', posts.length);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Descomenta para probar:
// getUserAndPosts();


// ============================================
// PLANTILLAS PARA MEMORIZAR
// ============================================

console.log('\n\n=== PLANTILLAS PARA MEMORIZAR ===\n');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                 GET CON PROMISES                          ║
╚═══════════════════════════════════════════════════════════╝

function getData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}


╔═══════════════════════════════════════════════════════════╗
║                 GET CON ASYNC/AWAIT                       ║
╚═══════════════════════════════════════════════════════════╝

async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}


╔═══════════════════════════════════════════════════════════╗
║                    POST REQUEST                           ║
╚═══════════════════════════════════════════════════════════╝

async function createData() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}


╔═══════════════════════════════════════════════════════════╗
║            MÚLTIPLES REQUESTS (PARALELO)                  ║
╚═══════════════════════════════════════════════════════════╝

async function getMultiple() {
  try {
    const [user, posts] = await Promise.all([
      fetch(url1).then(r => r.json()),
      fetch(url2).then(r => r.json())
    ]);

    console.log(user, posts);
  } catch (error) {
    console.error(error);
  }
}
`);


console.log('\n=== DIFERENCIAS CLAVE ===\n');

console.log(`
PROMISES (.then):
  ✓ Funciona sin async function
  ✓ .catch() para errores
  ✗ Más verboso con múltiples operaciones
  ✗ Difícil de leer con muchas promesas anidadas

ASYNC/AWAIT:
  ✓ Código más limpio y fácil de leer
  ✓ Parece código síncrono
  ✓ try/catch para errores (familiar)
  ✓ Mejor para debugging
  ✗ Necesitas marcar función como async

ERRORES COMUNES:
  ❌ Olvidar 'await' en response.json()
  ❌ Usar comillas " " en vez de backticks \` \` para template literals
  ❌ Olvidar 'try/catch' en async functions
  ❌ No retornar nada en los .then()
`);


console.log('\n=== TIPS PARA LA ENTREVISTA ===');
console.log('1. SIEMPRE usa try/catch con async/await');
console.log('2. SIEMPRE usa await con .json() → await response.json()');
console.log('3. Template literals usan BACKTICKS → `url/${id}`');
console.log('4. Promise.all() para requests en PARALELO (más rápido)');
console.log('5. Verifica response.ok si necesitas manejo de errores HTTP');
