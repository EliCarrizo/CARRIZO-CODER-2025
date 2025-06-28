import express from 'express';
import ProductManager from "./ProductManager.js";

const app = express();
const io = new Server(server);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());

const productManager = new ProductManager("./src/products.json");


import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';

app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
  console.log('El servidor esta escuchando el puerto 8080');
});
