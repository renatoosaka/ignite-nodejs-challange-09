import { describe, it } from '@jest/globals'
import request from 'supertest'
import { app } from '../../../../app'

describe('CreateUserController', () => {
  it('should create a user', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'User',
        email: 'user@email.com',
        password: 'password'
      })
      .expect(201)
  })
})
