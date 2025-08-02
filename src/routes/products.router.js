import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager('products.json');

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
  };

  const filter = query
    ? {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { availability: { $regex: query, $options: "i" } }
        ]
      }
    : {};

  try {
    const result = await productModel.paginate(filter, options);

    const buildLink = (pageNum) => {
      return `${req.baseUrl}?limit=${limit}&page=${pageNum}${
        sort ? `&sort=${sort}` : ""
      }${query ? `&query=${query}` : ""}`;
    };

    res.send({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
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
