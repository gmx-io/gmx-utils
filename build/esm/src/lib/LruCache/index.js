class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = /* @__PURE__ */ new Map();
  }
  has(key) {
    return this.cache.has(key);
  }
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return void 0;
  }
  set(key, value) {
    if (typeof key !== "string") {
      throw new Error("Key must be a string");
    }
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.cache.set(key, value);
    } else {
      if (this.capacity === 0) {
        return;
      }
      if (this.cache.size === this.capacity) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey !== void 0) {
          this.cache.delete(firstKey);
        }
      }
      this.cache.set(key, value);
    }
  }
  delete(key) {
    this.cache.delete(key);
  }
  getKeys() {
    return Array.from(this.cache.keys());
  }
  clean() {
    this.cache.clear();
  }
}

export { LRUCache };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map