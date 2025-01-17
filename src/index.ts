import type { Uint8ArrayList } from 'uint8arraylist'

export { encode } from './encode.js'
export { decode } from './decode.js'

export interface LengthDecoderFunction {
  (data: Uint8ArrayList): number
  bytes: number
}

export interface LengthEncoderFunction {
  (value: number): Uint8ArrayList | Uint8Array
  bytes: number
}
