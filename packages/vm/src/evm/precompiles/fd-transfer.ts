import { BN, Address } from 'ethereumjs-util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
// import type { EEIInterface } from '../types'
import type { PrecompileInput } from './types'
import { StateManager } from '../../state'

const assert = require('assert')

async function incrementBalance(stateManager: StateManager, address: Address, delta: BN) {
  const account = await stateManager.getAccount(address)
  account.balance = new BN(account.balance).add(delta)
  // account.balance = new BN(account.balance) + delta
  await stateManager.putAccount(address, account)
}

export async function precompileFdTransfer(opts: PrecompileInput): Promise<ExecResult> {
  assert(opts.data)

  // TODO(asa): Pick an appropriate gas amount
  const gasUsed = new BN(20)
  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  // data is the ABI encoding for [address,address,uint256]
  // 32 bytes each, but the addresses only use 20 bytes.
  const fromAddress = new Address(opts.data.slice(12, 32))
  const toAddress = new Address(opts.data.slice(44, 64))
  // const value = bufferToBigInt(opts.data.slice(64, 96))
  const value = new BN(opts.data.slice(64, 96))

  await incrementBalance(opts._VM.stateManager, fromAddress, value.neg())
  // await incrementBalance(opts._VM.stateManager, fromAddress, value * BN(-1))
  await incrementBalance(opts._VM.stateManager, toAddress, value)
  return {
    gasUsed: gasUsed,
    returnValue: Buffer.alloc(0),
  }
}
