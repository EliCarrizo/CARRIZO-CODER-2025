const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const pm = new ProductManager();

router.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { title: 'Home', products });
});

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

module.exports = router;
