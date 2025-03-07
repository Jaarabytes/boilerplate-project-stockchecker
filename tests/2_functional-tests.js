const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('should return a 400 error if no stock parameter is provided', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .end(function(err, res) {
        assert.equal(res.status, 400);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Stock parameter is required');
        done();
      });
  });

  test("Viewing one stock and liking it", function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.property(res.body.stockData, 'price');
        assert.isNumber(res.body.stockData.price);
        assert.property(res.body.stockData, 'likes');
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing the same stock and liking it again", function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.property(res.body.stockData, 'price');
        assert.isNumber(res.body.stockData.price);
        assert.property(res.body.stockData, 'likes');
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing two stocks", function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);

        const googStock = res.body.stockData.find(stock => stock.stock === 'GOOG');
        const msftStock = res.body.stockData.find(stock => stock.stock === 'MSFT');

        assert.isObject(googStock);
        assert.isObject(msftStock);

        assert.property(googStock, 'stock');
        assert.equal(googStock.stock, 'GOOG');
        assert.property(msftStock, 'stock');
        assert.equal(msftStock.stock, 'MSFT');

        assert.property(googStock, 'price');
        assert.isNumber(googStock.price);
        assert.property(msftStock, 'price');
        assert.isNumber(msftStock.price);

        assert.property(googStock, 'rel_likes');
        assert.isNumber(googStock.rel_likes);
        assert.property(msftStock, 'rel_likes');
        assert.isNumber(msftStock.rel_likes);

        done();
      });
  });

  test("Viewing two stocks and liking them both", function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end(function(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        
        const googStock = res.body.stockData.find(stock => stock.stock === 'GOOG');
        const msftStock = res.body.stockData.find(stock => stock.stock === 'MSFT');
        
        assert.isObject(googStock);
        assert.isObject(msftStock);
        
        assert.property(googStock, 'stock');
        assert.equal(googStock.stock, 'GOOG');
        assert.property(msftStock, 'stock');
        assert.equal(msftStock.stock, 'MSFT');
        
        assert.property(googStock, 'price');
        assert.isNumber(googStock.price);
        assert.property(msftStock, 'price');
        assert.isNumber(msftStock.price);
        
        assert.property(googStock, 'rel_likes');
        assert.isNumber(googStock.rel_likes);
        assert.property(msftStock, 'rel_likes');
        assert.isNumber(msftStock.rel_likes);
        
        done();
      });
  });
});
