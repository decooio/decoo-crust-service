import { api } from './api'

describe('Crust api ', () => {
  it('api status', async function (done) {
    const _api = await api.isReadyOrError
    const fileInfo = await _api.query.market.files('QmWNj1pTSjbauDHpdyg5HQ26vYcNWnubg1JehmwAE9NnU9')
    console.log(JSON.parse(JSON.stringify(fileInfo)))
  })
})
