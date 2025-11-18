// ============================================
// EJERCICIOS - PROMISES Y ASYNC/AWAIT
// ============================================

console.log('=== EJERCICIOS DE PRÁCTICA ===\n');
console.log('Completa cada ejercicio de las DOS formas:\n1. Con Promises (.then)\n2. Con Async/Await\n');


// ============================================
// EJERCICIO 1: GET básico
// ============================================
console.log('--- EJERCICIO 1: GET básico ---');
console.log('Obtén el usuario con ID 5');
console.log('URL: https://jsonplaceholder.typicode.com/users/5');
console.log('Imprime: nombre y email del usuario\n');

// Opción 1: Con promises
function getPromise () {
  fetch("URL: https://jsonplaceholder.typicode.com/users/5")
  .then(response => {
    return response.json()
  }).then(data => {
    console.log(data)
  })
}

// Opción 2: Con async/await
async function getUser2(id) {
 try {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const data = await response.json()
  console.log(data)
  return data
 } catch(err) {
  console.log(err)
 }
}

getUser2(5)

// Descomenta para probar:
// getUser1(5);
// getUser2(5);


// ============================================
// EJERCICIO 4: Múltiples requests en paralelo
// ============================================
console.log('\n--- EJERCICIO 4: Múltiples requests ---');
console.log('Obtén los posts con IDs 1, 2 y 3 en PARALELO');
console.log('URL: https://jsonplaceholder.typicode.com/posts/{id}');
console.log('Imprime: título de cada post\n');

// Solo con async/await + Promise.all
async function getThreePosts() {
 try {
  const p1 = fetch("https://jsonplaceholder.typicode.com/posts/1").then(res => res.json())
  const p2 = fetch("https://jsonplaceholder.typicode.com/posts/1").then(res => res.json())
  const p3 = fetch("https://jsonplaceholder.typicode.com/posts/1").then(res => res.json())

  const posts = await Promise.all([p1, p2, p3])
  console.log(posts[0])
 } catch (error) {
  
 }
}

// Descomenta para probar:
// getThreePosts();


// ============================================
// EJERCICIO 5: DESAFÍO - Usuario y sus posts
// ============================================
console.log('\n--- EJERCICIO 5: DESAFÍO ---');
console.log('Obtén el usuario ID 3 Y sus posts en PARALELO');
console.log('URL usuario: https://jsonplaceholder.typicode.com/users/3');
console.log('URL posts: https://jsonplaceholder.typicode.com/posts?userId=3');
console.log('Imprime: nombre del usuario y cantidad de posts\n');

async function getUserAndPosts() {
 const [user, post] = await Promise.all([
  fetch('https://jsonplaceholder.typicode.com/users/3').then(res => res.json()),
  fetch('https://jsonplaceholder.typicode.com/posts?userId=3').then(res => res.json())
 ])

 console.log(user.name)
}

// Descomenta para probar:
// getUserAndPosts(3);


// ============================================
// EJERCICIO 6: Error handling
// ============================================
console.log('\n--- EJERCICIO 6: Manejo de errores ---');
console.log('Intenta obtener un post que NO existe (ID 999999)');
console.log('URL: https://jsonplaceholder.typicode.com/posts/999999');
console.log('Maneja el error correctamente e imprime un mensaje\n');

async function getPostWithError(id) {
  // TU CÓDIGO AQUÍ
  // RECUERDA: try/catch
  // BONUS: verifica response.ok antes de hacer .json()
}

// Descomenta para probar:
// getPostWithError(999999);


console.log('\n\n=== RESPUESTAS ===');
console.log('Cuando termines, revisa tus respuestas abajo\n');


// ============================================
// RESPUESTAS - NO MIRES HASTA TERMINAR!
// ============================================

console.log('\n\n\n\n\n\n\n\n\n\n');
console.log('=== RESPUESTAS ===\n');

// EJERCICIO 1 - RESPUESTAS
function getUser1Solucion(id) {
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(response => response.json())
    .then(user => {
      console.log('Nombre:', user.name);
      console.log('Email:', user.email);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function getUser2Solucion(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await response.json();
    console.log('Nombre:', user.name);
    console.log('Email:', user.email);
  } catch (error) {
    console.error('Error:', error);
  }
}


// EJERCICIO 2 - RESPUESTAS
function getPost1Solucion(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(response => response.json())
    .then(post => {
      console.log('Título:', post.title);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function getPost2Solucion(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const post = await response.json();
    console.log('Título:', post.title);
  } catch (error) {
    console.error('Error:', error);
  }
}


// EJERCICIO 3 - RESPUESTAS
function createPost1Solucion() {
  const newPost = {
    title: 'Test',
    body: 'Contenido',
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
      console.log('Post creado:', post);
      console.log('ID:', post.id);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function createPost2Solucion() {
  try {
    const newPost = {
      title: 'Test',
      body: 'Contenido',
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
    console.log('Post creado:', post);
    console.log('ID:', post.id);

  } catch (error) {
    console.error('Error:', error);
  }
}


// EJERCICIO 4 - RESPUESTA
async function getThreePostsSolucion() {
  try {
    const p1 = fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json());
    const p2 = fetch('https://jsonplaceholder.typicode.com/posts/2').then(r => r.json());
    const p3 = fetch('https://jsonplaceholder.typicode.com/posts/3').then(r => r.json());

    const posts = await Promise.all([p1, p2, p3]);

    console.log('Post 1:', posts[0].title);
    console.log('Post 2:', posts[1].title);
    console.log('Post 3:', posts[2].title);

  } catch (error) {
    console.error('Error:', error);
  }
}


// EJERCICIO 5 - RESPUESTA
async function getUserAndPostsSolucion(userId) {
  try {
    const [user, posts] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(r => r.json()),
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then(r => r.json())
    ]);

    console.log('Usuario:', user.name);
    console.log('Cantidad de posts:', posts.length);

  } catch (error) {
    console.error('Error:', error);
  }
}


// EJERCICIO 6 - RESPUESTA
async function getPostWithErrorSolucion(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    console.log('Post:', post);

  } catch (error) {
    console.error('Error capturado:', error.message);
  }
}


console.log('\n=== ERRORES COMUNES ===');
console.log('1. ❌ Olvidar await en response.json()');
console.log('   ✅ const data = await response.json()');
console.log('');
console.log('2. ❌ Usar comillas " " para template literals');
console.log('   ✅ `url/${id}` con backticks');
console.log('');
console.log('3. ❌ Olvidar try/catch');
console.log('   ✅ Siempre wrap en try/catch');
console.log('');
console.log('4. ❌ No retornar en .then()');
console.log('   ✅ .then(response => { return response.json() })');
