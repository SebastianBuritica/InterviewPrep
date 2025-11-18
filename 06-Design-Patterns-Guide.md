# Design Patterns Interview Guide - Questions & Answers

Design pattern interview preparation with concise paragraph-style answers and code examples.

---

## 1. What is the Module pattern and why use it?

Module pattern uses closures to create private and public members, providing data hiding and encapsulation. Variables and functions inside are private, while returned methods are public. This was essential before ES6 modules for organizing code, preventing global namespace pollution, and protecting internal implementation. Still useful for creating self-contained components with controlled public APIs.

```javascript
const CounterModule = (function() {
  let count = 0; // Private variable

  return {
    // Public methods
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    getCount() {
      return count;
    }
  };
})();

CounterModule.increment();
CounterModule.getCount(); // 1
// count is private, can't access directly
```

**Use cases**: Creating libraries, protecting internal state, namespace management, singleton-like behavior.

---

## 2. Explain the Observer pattern and where it's used.

Observer pattern defines a one-to-many dependency where observers (subscribers) automatically get notified when the subject's (publisher's) state changes. The subject maintains a list of observers and notifies them when something happens. This is the foundation for event systems, reactive programming, and state management.

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

// Usage
const emitter = new EventEmitter();
emitter.on('userLogin', (user) => console.log('User logged in:', user.name));
emitter.emit('userLogin', { name: 'John' });
```

**Real-world examples**: DOM event listeners, React Context, Redux, RxJS, Node.js EventEmitter, WebSocket connections, pub/sub messaging systems.

---

## 3. What is the Singleton pattern and when should you use it?

Singleton ensures only one instance of a class exists throughout the application with a global access point. When getInstance is called, it returns the same instance every time. Useful for configuration managers, database connections, caches, or logging where multiple instances would cause problems or waste resources.

```javascript
class AppConfig {
  static instance = null;

  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    this.settings = {};
    AppConfig.instance = this;
  }

  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  set(key, value) {
    this.settings[key] = value;
  }

  get(key) {
    return this.settings[key];
  }
}

// Usage
const config1 = AppConfig.getInstance();
const config2 = AppConfig.getInstance();
console.log(config1 === config2); // true - same instance
```

**Caution**: Creates global state and tight coupling. Makes testing harder. Consider dependency injection as alternative. In React, often better to use Context API instead.

---

## Summary

Three essential patterns: **Module** for encapsulation and private state using closures, **Observer** for event-driven architecture where subjects notify multiple observers of changes, and **Singleton** for ensuring single instance across the application. Module pattern prevents global pollution, Observer enables reactive programming, Singleton manages shared resources. Use patterns to solve real problems, not for complexity's sake.
