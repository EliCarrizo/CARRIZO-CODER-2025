import fs from 'fs/promises';
import path from 'path';

export default class ProductManager {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      ...product
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedFields, id: products[index].id };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const updated = products.filter(p => p.id !== id);
    if (updated.length === products.length) return null;
    await this._writeFile(updated);
    return { message: 'Producto eliminado' };
  }
}
