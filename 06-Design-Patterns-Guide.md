# Design Patterns - Condensed Guide

## Creational Patterns

### 1. Singleton
**Theory**: Ensures only one instance of a class exists throughout the application, providing global access point.

**Example**:
```javascript
class Database {
  static instance = null;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

**Use cases**: Database connections, configuration managers, caches
**Drawbacks**: Hard to test, hidden dependencies, tight coupling

---

### 2. Factory
**Theory**: Creates objects without specifying the exact class to create. Delegates instantiation logic to a factory method.

**Example**:
```javascript
class VehicleFactory {
  createVehicle(type) {
    switch (type) {
      case 'car': return new Car();
      case 'truck': return new Truck();
    }
  }
}

const factory = new VehicleFactory();
const myCar = factory.createVehicle('car');
```

**Use cases**: UI components, object creation when type determined at runtime

---

### 3. Builder
**Theory**: Constructs complex objects step by step using method chaining. Separates construction from representation.

**Example**:
```javascript
class QueryBuilder {
  constructor() {
    this.query = {};
  }

  select(fields) {
    this.query.select = fields;
    return this;
  }

  from(table) {
    this.query.from = table;
    return this;
  }

  build() {
    return `SELECT ${this.query.select} FROM ${this.query.from}`;
  }
}

const query = new QueryBuilder()
  .select('name, email')
  .from('users')
  .build();
```

**Use cases**: SQL builders, form builders, complex configurations

---

## Structural Patterns

### 1. Module
**Theory**: Encapsulates code with private/public members. Provides data hiding and namespace management.

**Example**:
```javascript
const CounterModule = (function() {
  let count = 0; // Private

  return {
    increment() { count++; },
    getCount() { return count; }
  };
})();

CounterModule.increment();
console.log(CounterModule.getCount()); // 1
```

**Use cases**: Encapsulation, privacy, namespace management

---

### 2. Facade
**Theory**: Provides simplified interface to complex subsystem. Hides complexity behind clean API.

**Example**:
```javascript
class ApiService {
  constructor() {
    this.baseUrl = 'https://api.example.com';
  }

  async getUsers() {
    const response = await fetch(`${this.baseUrl}/users`);
    return await response.json();
  }

  async createUser(data) {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}
```

**Use cases**: API wrappers, simplifying complex subsystems

---

### 3. Decorator
**Theory**: Adds new functionality to objects dynamically without modifying original. Wraps objects with additional behavior.

**Example**:
```javascript
class Coffee {
  cost() { return 5; }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost() + 1;
  }
}

let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
console.log(coffee.cost()); // 6
```

**Use cases**: Adding features dynamically, middleware, HOCs in React

---

## Behavioral Patterns

### 1. Observer
**Theory**: Defines one-to-many dependency where multiple observers get notified when subject changes state.

**Example**:
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(data));
  }
}

const emitter = new EventEmitter();
emitter.on('login', (user) => console.log(`${user} logged in`));
emitter.emit('login', 'John'); // "John logged in"
```

**Use cases**: Event handling, state management, pub/sub systems, React Context

---

### 2. Strategy
**Theory**: Defines family of interchangeable algorithms. Allows selecting algorithm at runtime.

**Example**:
```javascript
class CreditCardPayment {
  pay(amount) { console.log(`Paid ${amount} with credit card`); }
}

class PayPalPayment {
  pay(amount) { console.log(`Paid ${amount} with PayPal`); }
}

class ShoppingCart {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}

const cart = new ShoppingCart(new CreditCardPayment());
cart.checkout(100);
```

**Use cases**: Payment methods, sorting algorithms, validation strategies

---

### 3. Command
**Theory**: Encapsulates requests as objects. Enables undo/redo, queuing, and logging operations.

**Example**:
```javascript
class Light {
  turnOn() { console.log('Light ON'); }
  turnOff() { console.log('Light OFF'); }
}

class TurnOnCommand {
  constructor(light) { this.light = light; }
  execute() { this.light.turnOn(); }
  undo() { this.light.turnOff(); }
}

class RemoteControl {
  constructor() { this.history = []; }

  execute(command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    this.history.pop()?.undo();
  }
}

const light = new Light();
const remote = new RemoteControl();
remote.execute(new TurnOnCommand(light));
remote.undo(); // Light OFF
```

**Use cases**: Undo/redo, macro recording, action history

---

### 4. State
**Theory**: Changes object behavior when internal state changes. State transitions handled internally.

**Example**:
```javascript
class DraftState {
  publish(doc) {
    doc.setState(new PublishedState());
    console.log('Published');
  }
}

class PublishedState {
  archive(doc) {
    doc.setState(new ArchivedState());
    console.log('Archived');
  }
}

class Document {
  constructor() {
    this.state = new DraftState();
  }

  setState(state) { this.state = state; }
  publish() { this.state.publish(this); }
}

const doc = new Document();
doc.publish(); // Changes Draft → Published
```

**Use cases**: Workflow management, form states, game states

---

## Quick Comparison

| Pattern | Purpose | Key Difference |
|---------|---------|----------------|
| **Factory vs Builder** | Both create objects | Factory: one-step, Builder: multi-step |
| **Strategy vs State** | Both change behavior | Strategy: client chooses, State: internal transitions |
| **Decorator vs Proxy** | Both wrap objects | Decorator: adds features, Proxy: controls access |

## Best Practices

1. Don't overuse patterns - use when needed
2. Start simple, refactor to patterns when complexity grows
3. Prefer composition over inheritance
4. Use built-in features when possible (ES6 modules, Proxy)
5. Focus on readability and maintainability
6. Every pattern has trade-offs - understand them
