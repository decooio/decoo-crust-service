// Seeds of account
import { Keyring } from '@polkadot/keyring'

const seeds = process.env.SEEDS

const kr = new Keyring({
  type: 'sr25519'
})

// krp will be used in sending transaction
export const krp = kr.addFromUri(seeds)
