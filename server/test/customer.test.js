// test/customer.test.js
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // assuming app.js exports the Express app

describe('Customer API', () => {
  let token;

  // Before tests, obtain a valid token via the dummy login endpoint
  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  it('should return 401 Unauthorized if no token is provided', (done) => {
    request(app)
      .get('/api/customers')
      .expect(401, done);
  });

  it('should retrieve customer data with valid token', (done) => {
    request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data').that.is.an('array');
        done();
      });
  });

  it('should create a new customer with valid token', (done) => {
    const newCustomer = { name: "Test User", email: "test@example.com" };
    request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send(newCustomer)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('data');
        expect(res.body.data.name).to.equal(newCustomer.name);
        done();
      });
  });
});
