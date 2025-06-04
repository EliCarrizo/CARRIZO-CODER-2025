import fs from 'fs/promises';
import path from 'path';

export default class CartManager {
  constructor(filename) {
    this.path = path.resolve('src/data', filename);
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = { id: crypto.randomUUID(), products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const existing = cart.products.find(p => p.product === pid);
    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}
