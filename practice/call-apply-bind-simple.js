// ============================================
// CALL, APPLY, BIND - EXPLICACIÓN SÚPER SIMPLE
// ============================================

console.log('=== CALL, APPLY, BIND ===\n');

// ============================================
// PROBLEMA: This se pierde
// ============================================

const person = {
  name: 'Juan',
  greet: function(greeting) {
    console.log(`${greeting}, soy ${this.name}`);
  }
};

person.greet('Hola'); // ✅ "Hola, soy Juan"

const greet = person.greet; // Guardamos la función
greet('Hola'); // ❌ "Hola, soy undefined" - this se perdió!


// ============================================
// SOLUCIÓN 1: CALL
// "Llama la función AHORA y dime quién es this"
// ============================================

console.log('\n--- CALL ---');

function sayHi(greeting, punctuation) {
  console.log(`${greeting}, soy ${this.name}${punctuation}`);
}

const user1 = { name: 'Ana' };
const user2 = { name: 'Luis' };

// call dice: "Ejecuta sayHi AHORA, this será user1"
sayHi.call(user1, 'Hola', '!'); // "Hola, soy Ana!"
sayHi.call(user2, 'Hey', '.'); // "Hey, soy Luis."

// SINTAXIS: funcion.call(quienEsThis, arg1, arg2, arg3...)


// ============================================
// SOLUCIÓN 2: APPLY
// "Igual que call, pero argumentos en array"
// ============================================

console.log('\n--- APPLY ---');

// apply dice: "Ejecuta sayHi AHORA, this será user1, args en array"
sayHi.apply(user1, ['Buenas', '!']); // "Buenas, soy Ana!"
sayHi.apply(user2, ['Qué tal', '?']); // "Qué tal, soy Luis?"

// SINTAXIS: funcion.apply(quienEsThis, [arg1, arg2, arg3...])

// LA ÚNICA DIFERENCIA CON CALL:
// call  → argumentos separados por comas
// apply → argumentos en un array


// ============================================
// SOLUCIÓN 3: BIND
// "NO llames todavía, dame una nueva función"
// ============================================

console.log('\n--- BIND ---');

const user3 = { name: 'Maria' };

// bind dice: "Dame una NUEVA función donde this SIEMPRE será user3"
const sayHiToMaria = sayHi.bind(user3);

// Ahora podemos llamarla cuando queramos
sayHiToMaria('Hola', '!'); // "Hola, soy Maria!"
sayHiToMaria('Buenas', '.'); // "Buenas, soy Maria."

// SINTAXIS: const nuevaFuncion = funcion.bind(quienEsThis)


// ============================================
// COMPARACIÓN DIRECTA
// ============================================

console.log('\n\n=== COMPARACIÓN ===\n');

function introduce(msg) {
  console.log(`${msg}, me llamo ${this.name}`);
}

const person1 = { name: 'Pedro' };

console.log('CALL - Ejecuta AHORA:');
introduce.call(person1, 'Hola'); // "Hola, me llamo Pedro"

console.log('\nAPPLY - Ejecuta AHORA (args en array):');
introduce.apply(person1, ['Hola']); // "Hola, me llamo Pedro"

console.log('\nBIND - Retorna función para después:');
const introducePedro = introduce.bind(person1);
introducePedro('Hola'); // "Hola, me llamo Pedro"
introducePedro('Buenas'); // "Buenas, me llamo Pedro"


// ============================================
// ANALOGÍA DEL MUNDO REAL
// ============================================

console.log('\n\n=== ANALOGÍA ===\n');

console.log(`
Imagina que tienes una función que necesita saber "¿quién soy yo?"

CALL:
  "Ejecuta esta función AHORA, y YO soy Ana"
  → introduce.call(ana, 'Hola')

APPLY:
  "Ejecuta esta función AHORA, y YO soy Ana, aquí están los args en una caja"
  → introduce.apply(ana, ['Hola'])

BIND:
  "Dame una copia de esta función que SIEMPRE sabrá que YO soy Ana"
  → const func = introduce.bind(ana)
  → func('Hola') // Puedo llamarla después
`);


// ============================================
// CASO PRÁCTICO: setTimeout
// ============================================

console.log('\n--- CASO PRÁCTICO: setTimeout ---\n');

const dog = {
  name: 'Firulais',
  bark: function() {
    console.log(`${this.name} dice: Guau!`);
  }
};

// ❌ PROBLEMA: this se pierde en setTimeout
// setTimeout(dog.bark, 1000); // "undefined dice: Guau!"

// ✅ SOLUCIÓN: bind
setTimeout(dog.bark.bind(dog), 1000); // "Firulais dice: Guau!"

// bind crea una nueva función donde this SIEMPRE es dog


// ============================================
// EJERCICIO RÁPIDO
// ============================================

console.log('\n\n=== EJERCICIO ===\n');

const car = {
  brand: 'Toyota',
  model: 'Corolla',
  describe: function(year) {
    console.log(`${this.brand} ${this.model} del año ${year}`);
  }
};

const describe = car.describe;

console.log('1. Llama describe con call (this = car, año = 2020)');
// TU CÓDIGO:
// describe.call(/* ??? */);

console.log('\n2. Llama describe con apply (this = car, año = 2021)');
// TU CÓDIGO:
// describe.apply(/* ??? */);

console.log('\n3. Crea una función describeCar con bind (this = car)');
// TU CÓDIGO:
// const describeCar = describe.bind(/* ??? */);
// describeCar(2022);


// ============================================
// RESPUESTAS
// ============================================

console.log('\n\n\n\n\n=== RESPUESTAS ===\n');

// 1. call
describe.call(car, 2020); // "Toyota Corolla del año 2020"

// 2. apply
describe.apply(car, [2021]); // "Toyota Corolla del año 2021"

// 3. bind
const describeCar = describe.bind(car);
describeCar(2022); // "Toyota Corolla del año 2022"


// ============================================
// RESUMEN PARA MEMORIZAR
// ============================================

console.log('\n\n=== RESUMEN ===\n');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                      CALL                                 ║
╚═══════════════════════════════════════════════════════════╝

func.call(nuevoThis, arg1, arg2, arg3)
          ↑         ↑
          |         argumentos separados
          quien es this

- Ejecuta la función INMEDIATAMENTE
- Argumentos separados por comas


╔═══════════════════════════════════════════════════════════╗
║                      APPLY                                ║
╚═══════════════════════════════════════════════════════════╝

func.apply(nuevoThis, [arg1, arg2, arg3])
           ↑          ↑
           |          argumentos en array
           quien es this

- Ejecuta la función INMEDIATAMENTE
- Argumentos en un array


╔═══════════════════════════════════════════════════════════╗
║                      BIND                                 ║
╚═══════════════════════════════════════════════════════════╝

const newFunc = func.bind(nuevoThis)
                         ↑
                         quien es this

newFunc(arg1, arg2) // Llamar después

- NO ejecuta la función
- RETORNA una nueva función
- this queda "amarrado" para siempre
`);


console.log('\n=== DIFERENCIA CLAVE ===\n');

console.log(`
CALL y APPLY:
  - Ejecutan la función AHORA ⚡
  - Diferencia: call usa args separados, apply usa array

BIND:
  - NO ejecuta, solo retorna una función nueva 📦
  - Útil para guardar y llamar después
`);


console.log('\n=== CUÁNDO USAR CADA UNO ===\n');

console.log(`
CALL:
  - Cuando quieres ejecutar AHORA
  - Tienes pocos argumentos
  - Ejemplo: func.call(obj, 'hola', 'mundo')

APPLY:
  - Cuando quieres ejecutar AHORA
  - Ya tienes los argumentos en un array
  - Ejemplo: func.apply(obj, arrayDeArgs)

BIND:
  - Cuando quieres la función para DESPUÉS
  - setTimeout, event listeners
  - Ejemplo: setTimeout(func.bind(obj), 1000)
`);
