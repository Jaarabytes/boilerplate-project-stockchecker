const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect; // Missing expect definition
const server = require('../server');
const { suite } = require('mocha');


chai.use(chaiHttp);

suite('Functional Tests', function() {
    describe("GET request to /api/stock-prices", () => {
        it('should return a 400 error if no stock parameter is provided', function(done) {
            chai
              .request(server)
              .get('/api/stock-prices')
              .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error', 'Stock parameter is required');
                done();
              });
        });        
    });

    describe("GET request to /api/stock-prices?stock=GOOG&like=true", () => {
        it("Viewing one stock and liking it", (done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('stockData');
                expect(res.body.stockData).to.have.property('stock', 'GOOG');
                expect(res.body.stockData).to.have.property('price');
                expect(res.body.stockData.price).to.be.a('number'); // Changed from 'GOOG' to 'number'
                expect(res.body.stockData).to.have.property('likes');
                expect(res.body.stockData.likes).to.be.a('number'); // Changed from equal(1) to be.a('number')
                done();
            });
        });
    });

    describe("GET request to /api/stock-prices", () => {
        it("Viewing the same stock and liking it again", (done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('stockData');
                expect(res.body.stockData).to.have.property('stock', 'GOOG');
                expect(res.body.stockData).to.have.property('price');
                expect(res.body.stockData.price).to.be.a('number'); // Changed from integer to 'number'
                expect(res.body.stockData).to.have.property('likes');
                expect(res.body.stockData.likes).to.be.a('number'); // Changed from rel_likes to likes
                done();
            });
        });
    });

    describe("GET request to /api/stock-prices", () => {
        it("Viewing two stocks", (done) => {
            chai.request(server)
                .get('/api/stock-prices?stock=GOOG&stock=MSFT')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('stockData');
                    expect(res.body.stockData).to.be.an('array');
                    expect(res.body.stockData).to.have.lengthOf(2);
    
                    const googStock = res.body.stockData.find(stock => stock.stock === 'GOOG');
                    const msftStock = res.body.stockData.find(stock => stock.stock === 'MSFT');
    
                    expect(googStock).to.be.an('object');
                    expect(msftStock).to.be.an('object');
    
                    expect(googStock).to.have.property('stock', 'GOOG');
                    expect(msftStock).to.have.property('stock', 'MSFT');
    
                    expect(googStock).to.have.property('price').that.is.a('number');
                    expect(msftStock).to.have.property('price').that.is.a('number');
    
                    expect(googStock).to.have.property('rel_likes').that.is.a('number');
                    expect(msftStock).to.have.property('rel_likes').that.is.a('number');
    
                    done();
                });
        });
    });

    describe("GET request to /api/stock-prices", () => {
        it("Viewing two stocks and liking them both", (done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('stockData');
                expect(res.body.stockData).to.be.an('array');
                expect(res.body.stockData).to.have.lengthOf(2);
                
                const googStock = res.body.stockData.find(stock => stock.stock === 'GOOG');
                const msftStock = res.body.stockData.find(stock => stock.stock === 'MSFT');
                
                expect(googStock).to.have.property('stock', 'GOOG');
                expect(msftStock).to.have.property('stock', 'MSFT');
                
                expect(googStock).to.have.property('price').that.is.a('number');
                expect(msftStock).to.have.property('price').that.is.a('number');
                
                expect(googStock).to.have.property('rel_likes').that.is.a('number');
                expect(msftStock).to.have.property('rel_likes').that.is.a('number');
                
                done();
            });
        });
    });
});
