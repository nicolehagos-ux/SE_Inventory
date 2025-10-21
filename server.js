require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const productsRouter = require('./routes/products');
const suppliersRouter = require('./routes/suppliers');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/orders', ordersRouter);

// health check
app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });
