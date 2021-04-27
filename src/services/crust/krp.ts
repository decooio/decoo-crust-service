// Seeds of account
import { Keyring } from '@polkadot/keyring'

const seeds = 'length youth fame learn repeat entire dirt undo wheel keep radar matrix'

const kr = new Keyring({
  type: 'sr25519'
})

// krp will be used in sending transaction
export const krp = kr.addFromUri(seeds)
