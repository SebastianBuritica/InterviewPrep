// ============================================
// GUÍA: THIS KEYWORD - SIMPLE Y CLARO
// ============================================

console.log('=== THIS KEYWORD ===\n');

// ============================================
// PARTE 1: THIS EN FUNCIONES NORMALES
// ============================================

console.log('--- FUNCIONES NORMALES ---\n');

// CASO 1: This en métodos de objeto
const person = {
  name: 'Sebastian',
  age: 25,
  greet: function() {
    console.log(`Hola, soy ${this.name} y tengo ${this.age} años`);
  }
};

person.greet(); // ✅ "Hola, soy Sebastian y tengo 25 años"
// this = person (el objeto que llama el método)


// CASO 2: This se PIERDE cuando guardas la función en variable
const greet = person.greet; // Guardamos la función

greet(); // ❌ "Hola, soy undefined y tengo undefined años"
// this ya NO es person, es undefined


// CASO 3: This en función normal dentro de objeto
const person2 = {
  name: 'Maria',
  hobbies: ['leer', 'correr', 'cocinar'],

  showHobbies: function() {
    console.log(`Hobbies de ${this.name}:`); // this = person2 ✅

    this.hobbies.forEach(function(hobby) {
      console.log(`${this.name} le gusta ${hobby}`); // this = undefined ❌
    });
  }
};

console.log('\nCon función normal en forEach:');
person2.showHobbies();
// Problema: this se pierde dentro del forEach


// ============================================
// PARTE 2: THIS EN ARROW FUNCTIONS
// ============================================

console.log('\n\n--- ARROW FUNCTIONS ---\n');

// REGLA IMPORTANTE: Arrow functions NO tienen this propio
// Heredan this del scope donde fueron CREADAS

// CASO 1: Arrow function como método (NO RECOMENDADO)
const person3 = {
  name: 'Carlos',
  greet: () => {
    console.log(`Hola, soy ${this.name}`); // this NO es person3
  }
};

person3.greet(); // ❌ "Hola, soy undefined"
// Arrow functions NO deben usarse como métodos de objeto


// CASO 2: Arrow function DENTRO de método (RECOMENDADO)
const person4 = {
  name: 'Ana',
  hobbies: ['pintar', 'bailar', 'viajar'],

  showHobbies: function() {
    console.log(`Hobbies de ${this.name}:`); // this = person4 ✅

    this.hobbies.forEach(hobby => {
      console.log(`${this.name} le gusta ${hobby}`); // this = person4 ✅
    });
  }
};

console.log('Con arrow function en forEach:');
person4.showHobbies();
// ✅ Arrow function hereda this del método showHobbies


// ============================================
// RESUMEN: FUNCIONES NORMALES vs ARROW
// ============================================

console.log('\n\n--- RESUMEN ---\n');

console.log(`
FUNCIONES NORMALES:
  - this depende de CÓMO se llama la función
  - obj.method() → this = obj
  - method() → this = undefined
  - Problema: pierdes this en callbacks

ARROW FUNCTIONS:
  - NO tienen this propio
  - Heredan this del scope padre
  - ❌ NO usar como métodos de objeto
  - ✅ SÍ usar en callbacks (forEach, map, etc)
`);


// ============================================
// PARTE 3: CALL, APPLY, BIND
// ============================================

console.log('\n--- CALL, APPLY, BIND ---\n');

function introduce(greeting, punctuation) {
  console.log(`${greeting}, soy ${this.name}${punctuation}`);
}

const user1 = { name: 'Luis' };
const user2 = { name: 'Sofia' };


// CALL: llama la función AHORA con argumentos separados
console.log('\n1. CALL:');
introduce.call(user1, 'Hola', '!'); // "Hola, soy Luis!"
introduce.call(user2, 'Hey', '.'); // "Hey, soy Sofia."
// Sintaxis: func.call(nuevoThis, arg1, arg2, ...)


// APPLY: llama la función AHORA con argumentos en array
console.log('\n2. APPLY:');
introduce.apply(user1, ['Buenas', '!']); // "Buenas, soy Luis!"
introduce.apply(user2, ['Qué tal', '?']); // "Qué tal, soy Sofia?"
// Sintaxis: func.apply(nuevoThis, [arg1, arg2, ...])


// BIND: NO llama, retorna NUEVA función con this fijo
console.log('\n3. BIND:');
const introduceLuis = introduce.bind(user1, 'Hola');
introduceLuis('!'); // "Hola, soy Luis!"
introduceLuis('...'); // "Hola, soy Luis..."
// Sintaxis: const newFunc = func.bind(nuevoThis)


// ============================================
// COMPARACIÓN DIRECTA
// ============================================

console.log('\n\n--- COMPARACIÓN: CALL vs APPLY vs BIND ---\n');

function sum(a, b, c) {
  console.log(`${this.name}: ${a} + ${b} + ${c} = ${a + b + c}`);
}

const calc = { name: 'Calculadora' };

console.log('CALL (args separados):');
sum.call(calc, 5, 10, 15); // "Calculadora: 5 + 10 + 15 = 30"

console.log('\nAPPLY (args en array):');
sum.apply(calc, [5, 10, 15]); // "Calculadora: 5 + 10 + 15 = 30"

console.log('\nBIND (retorna función):');
const boundSum = sum.bind(calc);
boundSum(5, 10, 15); // "Calculadora: 5 + 10 + 15 = 30"


// ============================================
// EJEMPLO PRÁCTICO: Event listeners
// ============================================

console.log('\n\n--- EJEMPLO PRÁCTICO ---\n');

const button = {
  text: 'Click me',
  clicked: 0,

  handleClick: function() {
    this.clicked++;
    console.log(`${this.text} fue clickeado ${this.clicked} veces`);
  }
};

// ❌ PROBLEMA: this se pierde en setTimeout
// setTimeout(button.handleClick, 1000);

// ✅ SOLUCIÓN 1: bind
setTimeout(button.handleClick.bind(button), 1000);

// ✅ SOLUCIÓN 2: arrow function
setTimeout(() => button.handleClick(), 2000);


// ============================================
// PLANTILLAS PARA MEMORIZAR
// ============================================

console.log('\n\n=== PLANTILLAS PARA MEMORIZAR ===\n');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║            FUNCIÓN NORMAL COMO MÉTODO                     ║
╚═══════════════════════════════════════════════════════════╝

const obj = {
  name: 'Juan',
  greet: function() {
    console.log(this.name); // ✅ this = obj
  }
};


╔═══════════════════════════════════════════════════════════╗
║         ARROW FUNCTION EN CALLBACK                        ║
╚═══════════════════════════════════════════════════════════╝

const obj = {
  items: [1, 2, 3],
  showItems: function() {
    this.items.forEach(item => {
      console.log(this.name, item); // ✅ this heredado
    });
  }
};


╔═══════════════════════════════════════════════════════════╗
║                  CALL                                     ║
╚═══════════════════════════════════════════════════════════╝

function greet(msg) {
  console.log(msg, this.name);
}

const user = { name: 'Ana' };
greet.call(user, 'Hola'); // Llama AHORA


╔═══════════════════════════════════════════════════════════╗
║                  APPLY                                    ║
╚═══════════════════════════════════════════════════════════╝

function greet(msg1, msg2) {
  console.log(msg1, msg2, this.name);
}

const user = { name: 'Ana' };
greet.apply(user, ['Hola', 'Adiós']); // Array de args


╔═══════════════════════════════════════════════════════════╗
║                  BIND                                     ║
╚═══════════════════════════════════════════════════════════╝

function greet(msg) {
  console.log(msg, this.name);
}

const user = { name: 'Ana' };
const greetUser = greet.bind(user);
greetUser('Hola'); // Llama cuando quieras
`);


// ============================================
// EJERCICIOS
// ============================================

console.log('\n\n=== EJERCICIOS ===\n');

// EJERCICIO 1: ¿Qué imprime?
console.log('EJERCICIO 1:\n');

const obj1 = {
  value: 42,
  getValue: function() {
    return this.value;
  }
};

console.log(obj1.getValue()); // ¿?
const getValue = obj1.getValue;
console.log(getValue()); // ¿?
console.log(getValue.call(obj1)); // ¿?

console.log('\nTus respuestas:');
console.log('// 1. _____');
console.log('// 2. _____');
console.log('// 3. _____');


// EJERCICIO 2: Arregla el código
console.log('\n\nEJERCICIO 2: Arregla este código usando bind\n');

const counter = {
  count: 0,
  increment: function() {
    this.count++;
    console.log(this.count);
  }
};

// ❌ No funciona:
// setTimeout(counter.increment, 1000);

// ✅ Arréglalo:
// setTimeout(/* TU CÓDIGO */, 1000);


// EJERCICIO 3: ¿Arrow o normal?
console.log('\n\nEJERCICIO 3: ¿Qué tipo de función usar?\n');

const team = {
  name: 'Developers',
  members: ['Ana', 'Bob'],

  // ¿Arrow o normal?
  printTeam: /* ¿function() o () => ? */ {
    console.log(this.name);

    // ¿Arrow o normal?
    this.members.forEach(/* ¿function(m) o m => ? */ {
      console.log(this.name, m);
    });
  }
};


console.log('\n\n=== RESUMEN PARA LA ENTREVISTA ===\n');

console.log(`
THIS EN FUNCIONES NORMALES:
  - obj.method() → this = obj
  - method() → this = undefined
  - Se pierde fácilmente en callbacks

THIS EN ARROW FUNCTIONS:
  - NO tienen this propio
  - Heredan this del scope padre
  - ❌ NO usar como métodos de objeto
  - ✅ SÍ usar en callbacks

CONTROLAR THIS:
  - call(thisArg, a, b)    → Llama AHORA, args separados
  - apply(thisArg, [a,b])  → Llama AHORA, args en array
  - bind(thisArg)          → Retorna función con this fijo

REGLA DE ORO:
  - Métodos de objeto → función normal
  - Callbacks → arrow function
`);
