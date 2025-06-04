import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager('products.json');

router.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

router.post('/', async (req, res) => {
  const newProduct = await pm.addProduct(req.body);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', async (req, res) => {
  const deleted = await pm.deleteProduct(req.params.pid);
  deleted ? res.json(deleted) : res.status(404).send('Producto no encontrado');
});

export default router;
