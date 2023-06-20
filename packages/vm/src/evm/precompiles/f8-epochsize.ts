import { BN, setLengthLeft } from 'ethereumjs-util'

import { OOGResult } from '../evm'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

export function precompileF8Epochsize(opts: PrecompileInput): ExecResult {
  const gasUsed = new BN(1000)
  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  const sizeBuf = new BN(100).toArrayLike(Buffer, 'be', 32)
  // const sizeBuf = bigIntToBuffer(new BN(100))
  return {
    returnValue: setLengthLeft(sizeBuf, 32),
    gasUsed: gasUsed,
  }
}
