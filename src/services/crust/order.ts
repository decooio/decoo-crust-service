import { KeyringPair } from '@polkadot/keyring/types'
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import { logger } from '../../logger'
import { fromDecimal } from '../../helpers/utils'
import BigNumber from 'bignumber.js'

export async function placeOrder (api: ApiPromise, krp: KeyringPair, fileCID: string, fileSize: number, tip: string) {
  // Determine whether to connect to the chain
  await api.isReadyOrError
  // Generate transaction
  const pso = api.tx.market.placeStorageOrder(fileCID, fileSize, tip)
  const txRes = JSON.parse(JSON.stringify((await sendTx(krp, pso))))
  return JSON.parse(JSON.stringify(txRes))
}
export async function orderPrice (api: ApiPromise, fileSize: string) {
  // Determine whether to connect to the chain
  await api.isReadyOrError
  // Generate transaction
  const basePrice = await api.query.market.fileBaseFee()
  const _filePrice = await api.query.market.filePrice()
  const filePrice = new BigNumber(_filePrice.toString()).multipliedBy(new BigNumber(fileSize))
  const totalPrice = filePrice.plus(new BigNumber(basePrice.toString()))
  return {
    basePrice: basePrice.toString(),
    totalPrice: totalPrice.toString()
  }
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
          }
        })
        logger.info('Included at block hash', status.asInBlock.toHex())

        resolve(status.asInBlock.toHex())
      } else if (status.isFinalized) {
        logger.info('Finalized block hash', status.asFinalized.toHex())
      }
    }).catch(e => {
      reject(e)
    })
  })
}

const batchSendTxs = (api: ApiPromise, krp: KeyringPair, txs: any) => {
  return new Promise((resolve, reject) => {
    api.tx.utility.batchAll(txs).signAndSend(krp, ({ events = [], status }) => {
      logger.info(
        `  ↪ 💸 [tx]: Transaction status: ${status.type}`
      )

      if (
        status.isInvalid ||
        status.isDropped ||
        status.isUsurped ||
        status.isRetracted
      ) {
        reject(new Error('Invalid transaction.'))
      }

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            // Error with no detail, just return error
            logger.info('  ↪ 💸 ❌ [tx]: Send transaction failed.')
            reject(new Error('Send transaction failed.'))
          } else if (method === 'ExtrinsicSuccess') {
            logger.info(
              `  ↪ 💸 ✅ [tx]: Send transaction(${api.tx.type}) success.`
            )
          }
        })
        logger.info('Included at block hash', status.asInBlock.toHex())

        resolve(status.asInBlock.toHex())
      } else if (status.isFinalized) {
        logger.info('Finalized block hash', status.asFinalized.toHex())
      }
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

export async function transfer (api: ApiPromise, krp: KeyringPair, amount:string, account:string) {
  await api.isReadyOrError
  // Generate transaction
  const amountBN = fromDecimal(amount)
  const txPre = api.tx.balances.transfer(account, amountBN.toFixed(0))

  const paymentStr = await txPre.paymentInfo(account)
  const feeExpected = (paymentStr.toJSON()).partialFee as string
  const tx = api.tx.balances.transfer(account, amountBN.minus(new BigNumber(feeExpected)).toFixed(0))
  const blockHash = await sendTx(krp, tx)
  return { blockHash, extrinsicHash: tx.hash.toHex() }
}
interface IRecord {
  address: string,
  amount: string
}
export async function transferBatch (api: ApiPromise, krp: KeyringPair, records: IRecord[]) {
  const txs = records.map((r) => api.tx.balances.transfer(r.address, fromDecimal(r.amount).toFixed(0)))
  return batchSendTxs(api, krp, txs)
}
