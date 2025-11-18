// ============================================
// EJERCICIOS DE CLOSURES Y EVENT LOOP
// ============================================

console.log('=== EJERCICIOS DE CLOSURES Y EVENT LOOP ===\n');

// ============================================
// EJERCICIO 1: Closure básico
// ============================================
console.log('--- Ejercicio 1 ---');
function createCounter() {
  let count = 0;
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.decrement());
console.log(counter.getCount());

// ¿Qué imprime cada console.log? (4 respuestas)
// Tu respuesta: 1, 2, 1, 1


// ============================================
// EJERCICIO 2: Event Loop - Sync vs Async
// ============================================
console.log('\n--- Ejercicio 2 ---');
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');

// ¿En qué orden se imprimen? A, B, C o diferente?
// Tu respuesta: A, C, B


// ============================================
// EJERCICIO 3: Event Loop - Promise vs setTimeout
// ============================================
console.log('\n--- Ejercicio 3 ---');
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// ¿En qué orden se imprimen? (4 respuestas)
// Tu respuesta: A, D, C, B


// ============================================
// EJERCICIO 4: Closure con múltiples instancias
// ============================================
console.log('\n--- Ejercicio 4 ---');
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2));
console.log(add10(2));
console.log(add5(3));

// ¿Qué imprime cada console.log? (3 respuestas)
// Tu respuesta:  


// ============================================
// EJERCICIO 5: Event Loop - Múltiples Promises
// ============================================
console.log('\n--- Ejercicio 5 ---');
console.log('Start');

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

Promise.resolve()
  .then(() => console.log('Promise 3'));

console.log('End');

// ¿En qué orden se imprimen? (5 respuestas)
// Tu respuesta: Start, End, Promise 1, Promise 2, Promise 3


// ============================================
// EJERCICIO 6: Closure tricky - Loop con closure
// ============================================
console.log('\n--- Ejercicio 6 ---');
function createFunctions() {
  const arr = [];

  for (var i = 0; i < 3; i++) {
    arr.push(function() {
      return i;
    });
  }

  return arr;
}

const funcs = createFunctions();
console.log(funcs[0]());
console.log(funcs[1]());
console.log(funcs[2]());

// ¿Qué imprime cada console.log? (3 respuestas)
// Tu respuesta:


// ============================================
// EJERCICIO 7: Event Loop - async/await
// ============================================
console.log('\n--- Ejercicio 7 ---');
async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}

console.log('3');
test();
console.log('4');

// ¿En qué orden se imprimen? (4 respuestas)
// Tu respuesta: 3, 4, 1, 2


// ============================================
// EJERCICIO 8: Closure con private variable
// ============================================
console.log('\n--- Ejercicio 8 ---');
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit: function(amount) {
      balance += amount;
      return balance;
    },
    withdraw: function(amount) {
      balance -= amount;
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50));
console.log(account.withdraw(30));
console.log(account.balance);

// ¿Qué imprime cada console.log? (3 respuestas)
// Tu respuesta: 150, 70


// ============================================
// EJERCICIO 9: Event Loop - setTimeout con diferentes delays
// ============================================
console.log('\n--- Ejercicio 9 ---');
console.log('A');
setTimeout(() => console.log('B'), 10);
setTimeout(() => console.log('C'), 0);
console.log('D');

// ¿En qué orden se imprimen? (4 respuestas)
// Tu respuesta: A, D, C, B


// ============================================
// EJERCICIO 10: Closure tricky - Modificar variable externa
// ============================================
console.log('\n--- Ejercicio 10 ---');
let multiplier = 2;

function createMultiplier() {
  return function(x) {
    return x * multiplier;
  };
}

const multiply = createMultiplier();
console.log(multiply(5));

multiplier = 3;
console.log(multiply(5));

// ¿Qué imprime el primer console.log?
// ¿Qué imprime el segundo console.log?
// Tu respuesta: primer log 10, segundo log 15


console.log('\n\n=== FIN DE LOS EJERCICIOS ===');
console.log('¡Dime tus respuestas! 🔥');
