const supertest = require ('supertest')
const server = require('./server')
const request = supertest(server)

it('gets the test endpoint', async done => {
    const response = await request.get('/')
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('hello world')
    done()
  })