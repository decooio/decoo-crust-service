import { KeyringPair } from '@polkadot/keyring/types'
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import { logger } from '../../logger'

export async function placeOrder (api: ApiPromise, krp: KeyringPair, fileCID: string, fileSize: number, tip: number) {
  // Determine whether to connect to the chain
  await api.isReadyOrError
  // Generate transaction
  const pso = api.tx.market.placeStorageOrder(fileCID, fileSize, tip)
  const txRes = JSON.parse(JSON.stringify((await sendTx(krp, pso))))
  return JSON.parse(JSON.stringify(txRes))
}

export async function sendTx (krp: KeyringPair, tx: SubmittableExtrinsic) {
  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({ events = [], status }) => {
      logger.info(
                `  ↪ 💸 [tx]: Transaction status: ${status.type}, nonce: ${tx.nonce}`
      )

      if (
        status.isInvalid ||
                status.isDropped ||
                status.isUsurped ||
                status.isRetracted
      ) {
        reject(new Error('Invalid transaction.'))
      } else {
        // Pass it
      }

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            // Error with no detail, just return error
            logger.info(`  ↪ 💸 ❌ [tx]: Send transaction(${tx.type}) failed.`)
            resolve(false)
          } else if (method === 'ExtrinsicSuccess') {
            logger.info(
                            `  ↪ 💸 ✅ [tx]: Send transaction(${tx.type}) success.`
            )
            resolve(true)
          }
        })
      } else {
        // Pass it
      }
    }).catch(e => {
      reject(e)
    })
  })
}

interface IFileInfo {
  'file_size': number,
  'expired_on': number,
  'calculated_at': number,
  amount: number,
  prepaid: number,
  'reported_replica_count': number,
  replicas: [any]
}

export async function getOrderState (api: ApiPromise, cid: string) {
  await api.isReadyOrError
  const res = await api.query.market.files(cid)
  const data = res ? JSON.parse(JSON.stringify(res)) : null
  if (data && Array.isArray(data) && data.length > 0) {
    const { replicas, ...meaningfulData } = (data as IFileInfo[])[0]
    return {
      meaningfulData,
      replicas
    }
  }
  return null
}
