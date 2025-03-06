
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    describe("GET request to /api/stock-prices",() => {
        it("Viewing one stock" ,(done) => {
            chai.request(server)
            .get('/api/stock-prices')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal('Stock symbol required')
                done();
            })
        })
    })
    describe("GET request to /api/stock-prices?stock=GOOG&like=true",() => {
        it("Viewing one stock and liking it" ,(done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal('Stock symbol required')
                done();
            })
        })
    })
    describe("GET request to /api/stock-prices",() => {
        it("Viewing the same stock and liking it again" ,(done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal('Stock symbol required')
                done();
            })
        })
    })
    describe("GET request to /api/stock-prices",() => {
        it("Viewing two stocks" ,(done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal('Stock symbol required')
                done();
            })
        })
    })
    describe("GET request to /api/stock-prices",() => {
        it("Viewing two stocks and liking them both" ,(done) => {
            chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                expect(res.body.error).to.equal('Stock symbol required')
                done();
            })
        })
    })
});

