// ============================================
// PROMISES VS ASYNC/AWAIT - SIMPLE Y DIRECTO
// ============================================

console.log('=== PROMISES VS ASYNC/AWAIT ===\n');

// ============================================
// EJEMPLO 1: FETCH CON PROMISES
// ============================================
console.log('--- MÉTODO 1: PROMISES (.then) ---\n');

function getUserWithPromises() {
  fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => {
      // Primera promise: convertir a JSON
      return response.json();
    })
    .then(user => {
      // Segunda promise: usar los datos
      console.log('Nombre:', user.name);
      console.log('Email:', user.email);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Llama esta función:
// getUserWithPromises();


// ============================================
// EJEMPLO 2: MISMO FETCH CON ASYNC/AWAIT
// ============================================
console.log('\n--- MÉTODO 2: ASYNC/AWAIT ---\n');

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

// Llama esta función:
// getUserWithAsync();


// ============================================
// MÚLTIPLES REQUESTS - PROMISES
// ============================================
console.log('\n--- MÚLTIPLES REQUESTS CON PROMISES ---\n');

function getThreeUsersPromises() {
  const p1 = fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json());
  const p2 = fetch('https://jsonplaceholder.typicode.com/users/2').then(r => r.json());
  const p3 = fetch('https://jsonplaceholder.typicode.com/users/3').then(r => r.json());

  Promise.all([p1, p2, p3])
    .then(users => {
      console.log('Usuario 1:', users[0].name);
      console.log('Usuario 2:', users[1].name);
      console.log('Usuario 3:', users[2].name);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Llama esta función:
// getThreeUsersPromises();


// ============================================
// MÚLTIPLES REQUESTS - ASYNC/AWAIT
// ============================================
console.log('\n--- MÚLTIPLES REQUESTS CON ASYNC/AWAIT ---\n');

async function getThreeUsersAsync() {
  try {
    const p1 = fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json());
    const p2 = fetch('https://jsonplaceholder.typicode.com/users/2').then(r => r.json());
    const p3 = fetch('https://jsonplaceholder.typicode.com/users/3').then(r => r.json());

    const users = await Promise.all([p1, p2, p3]);

    console.log('Usuario 1:', users[0].name);
    console.log('Usuario 2:', users[1].name);
    console.log('Usuario 3:', users[2].name);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Llama esta función:
// getThreeUsersAsync();


// ============================================
// POST REQUEST - PROMISES
// ============================================
console.log('\n--- POST CON PROMISES ---\n');

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

// Llama esta función:
// createPostPromises();


// ============================================
// POST REQUEST - ASYNC/AWAIT
// ============================================
console.log('\n--- POST CON ASYNC/AWAIT ---\n');

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

// Llama esta función:
// createPostAsync();


// ============================================
// RESUMEN PARA MEMORIZAR
// ============================================

console.log('\n\n=== PLANTILLAS PARA MEMORIZAR ===\n');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                 PROMISES (.then)                          ║
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
║                 ASYNC/AWAIT                               ║
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
PROMISES:
  ✓ Más verboso (.then .then .then)
  ✓ Anidación de callbacks
  ✓ .catch() para errores
  ✗ Difícil de leer con muchas promesas

ASYNC/AWAIT:
  ✓ Código más limpio y fácil de leer
  ✓ Parece código síncrono
  ✓ try/catch para errores (como código normal)
  ✓ Fácil debuggear
  ✗ Necesitas función async

CUÁNDO USAR CADA UNO:
  - Promises: cuando tienes UNA operación async simple
  - Async/Await: cuando tienes MÚLTIPLES operaciones o lógica compleja
`);


// ============================================
// EJERCICIO SIMPLE
// ============================================

console.log('\n\n=== EJERCICIO ===\n');

console.log('TAREA: Obtén el post con ID 10 e imprime su título\n');
console.log('URL: https://jsonplaceholder.typicode.com/posts/10\n');

// OPCIÓN 1: Con promises
function getPostPromises(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return data
  })
  .catch(error => {
    console.log(error)
  })
  
}

// OPCIÓN 2: Con async/await
async function getPostAsync() {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    const data = response.json()
    console.log(data)
    return data
  } catch (error) {
    console.log('Error', error)
  }
}

console.log('Descomenta para probar:');
console.log('// getPostPromises();');
console.log('// getPostAsync();');
