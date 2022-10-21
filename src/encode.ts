import { Uint8ArrayList } from 'uint8arraylist'
import { varintEncode } from './varint-encode.js'
import { concat as uint8ArrayConcat } from 'uint8arrays'
import type { LengthEncoderFunction } from './varint-encode.js'
import type { Source, Transform } from 'it-stream-types'

interface EncoderOptions {
  poolSize?: number
  minPoolSize?: number
  lengthEncoder?: LengthEncoderFunction
}

export const MIN_POOL_SIZE = 8 // Varint.encode(Number.MAX_SAFE_INTEGER).length
export const DEFAULT_POOL_SIZE = 10 * 1024

const ZEROs = Uint8Array.from([0,0,0,0,0,0,0,0])

export function encode (options?: EncoderOptions): Transform<Uint8ArrayList | Uint8Array, Uint8Array> {
  options = options ?? {}

  const encodeLength = options.lengthEncoder ?? varintEncode

  const encoder = async function * (source: Source<Uint8ArrayList | Uint8Array>): Source<Uint8Array> {
    let pool = new Uint8Array(MIN_POOL_SIZE)

    for await (const chunk of source) {
      encodeLength(chunk.length, pool, 0)
      const encodedLength = pool.slice(0, encodeLength.bytes)

      yield uint8ArrayConcat([encodedLength, chunk.slice()], encodedLength.length + chunk.length)

      // overwrite "pool"
      pool.set(ZEROs)
    }
  }

  return encoder
}

encode.single = (chunk: Uint8ArrayList | Uint8Array, options?: EncoderOptions) => {
  options = options ?? {}
  const encodeLength = options.lengthEncoder ?? varintEncode
  return new Uint8ArrayList(encodeLength(chunk.length), chunk.slice())
}
