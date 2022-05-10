
const mainRoutes = require('./shopcart');
const candyRoutes = require('./candy');
const reviewRoutes = require('./review');
const orderRoutes = require('./order');
const constructorMethod = (app) => {
  app.use('/', mainRoutes);
  app.use('/', candyRoutes);
  app.use('/review', reviewRoutes);
  app.use('/order',orderRoutes);


  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;