const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');

const ProductManager = require('./managers/ProductManager');
const pm = new ProductManager();

const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Websockets
io.on('connection', async socket => {
  console.log('Cliente conectado');

  // Enviar productos al conectarse
  socket.emit('products', await pm.getProducts());

  // Recibir nuevo producto
  socket.on('newProduct', async data => {
    await pm.addProduct(data);
    io.emit('products', await pm.getProducts());
  });

  // Recibir id de producto a eliminar
  socket.on('deleteProduct', async id => {
    await pm.deleteProduct(id);
    io.emit('products', await pm.getProducts());
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
