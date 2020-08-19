const request = require('supertest');
const { app, server } = require('../../server/index');

process.env.PORT = 6666;

export const routesTest = () => describe('/api/gamereviews/:gameid should return the correct data shape', () => {
  afterAll(async () => {
    await server.close();
  });

  test('Basic valid GET request', async () => {
    await request(app)
      .get('/api/gamereviews/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(2);
      });
  });

  test('Invalid params in GET request', async () => {
    return request(app)
      .get('/api/gamereviews/101')
      .expect(400, { error: 'Invalid game ID. Please use a number between 1 and 100.' });
  });

  test('querying with display search parameter works as expected', async () => {
    await request(app)
      .get('/api/gamereviews/1?display=funny')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).not.toBeDefined();
        expect(res.body.data[0].id_user).toBe(4);
        expect(res.body.data[1].id_user).toBe(1);
      });

    await request(app)
      .get('/api/gamereviews/2?display=helpful')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).not.toBeDefined();
        expect(res.body.data[0].id_user).toBe(2);
        expect(res.body.data[1].id_user).toBe(5);
      });

    await request(app)
      .get('/api/gamereviews/3?display=recent')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).not.toBeDefined();
        expect(res.body.data[0].id_user).toBe(1);
        expect(res.body.data[1].id_user).toBe(9);
      });
  });

  test('querying with playtime search parameter works as expected', async () => {
    await request(app)
      .get('/api/gamereviews/4?play_min=500')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(10);
      });

    await request(app)
      .get('/api/gamereviews/4?play_max=500')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(9);
      });
  });

  test('querying with date range & exclude works as expected', async () => {
    // Although this combination of parameters should never be sent from the client,
    // they will nonetheless return a valid JSON object
    await request(app)
      .get('/api/gamereviews/1?to=2020-06-01&exclude=true')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(2);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(2);
      });

    await request(app)
      .get('/api/gamereviews/1?from=2020-04-01&to=2020-06-01')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(1);
      });

    await request(app)
      .get('/api/gamereviews/1?from=2020-04-01&to=2020-06-01&exclude=true')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(4);
      });
  });

  test('querying with purchase type and review type works as expected', async () => {
    await request(app)
      .get('/api/gamereviews/1?purchase_type=steam&review_type=positive')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(1);
      });

    await request(app)
      .get('/api/gamereviews/1?purchase_type=other&review_type=positive')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(4);
      });

    await request(app)
      .get('/api/gamereviews/2?purchase_type=steam&review_type=negative')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(5);
      });

    await request(app)
      .get('/api/gamereviews/2?purchase_type=other&review_type=negative')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.steamPurchasedCount).toBe(1);
        expect(res.body.otherPurchasedCount).toBe(1);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBe(1);
        expect(res.body.recent).toBeInstanceOf(Array);
        expect(res.body.recent.length).toBe(1);
        expect(res.body.data[0].id_user).toBe(2);
      });
  });
});