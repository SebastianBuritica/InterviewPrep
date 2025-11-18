// ============================================
// EJERCICIOS SUPER TRICKY - RONDA FINAL
// ============================================

console.log("=== EJERCICIOS FINALES - LOS MÁS DIFÍCILES ===\n");

// ============================================
// EJERCICIO 1: Multiple var declarations
// ============================================
console.log("--- Ejercicio 1 ---");
var a = 1;

function test() {
  a = 10;
  console.log(a);
  var a;
  console.log(a);
}

test();
console.log(a);

// ¿Qué imprime el PRIMER console.log dentro de test?
// ¿Qué imprime el SEGUNDO console.log dentro de test?
// ¿Qué imprime el console.log FUERA de test?
// Tu respuesta: primer log: 10, segundo log 10, tercer log 1

// ============================================
// EJERCICIO 2: Arrow function vs regular function
// ============================================
console.log("\n--- Ejercicio 2 ---");
var name = "Global";

const obj = {
  name: "Object",
  regular: function () {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  },
};

obj.regular();
obj.arrow();

// ¿Qué imprime obj.regular()?
// ¿Qué imprime obj.arrow()?
// Tu respuesta: primer log 'Object', segundo log 'Global'

// ============================================
// EJERCICIO 3: Tricky closure with setTimeout
// ============================================
console.log("\n--- Ejercicio 3 ---");
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}

// ¿Qué imprime? ¿0, 1, 2 o tres veces el mismo número?
// Tu respuesta: 0, 1, 2

console.log("\n\n=== FIN DE TODOS LOS EJERCICIOS ===");
console.log("¡Estos fueron los más difíciles! 🔥");
