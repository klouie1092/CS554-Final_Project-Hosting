
const mainRoutes = require('./shopcart');
const candyRoutes = require('./candy')

const constructorMethod = (app) => {
  app.use('/', mainRoutes);
  app.use('/', candyRoutes);
  app.use('/review')


  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;