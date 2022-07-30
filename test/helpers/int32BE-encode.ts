import { Uint8ArrayList } from 'uint8arraylist'
import { allocUnsafe } from '../../src/alloc.js'
import type { LengthEncoderFunction } from '../../src/index.js'

export const int32BEEncode: LengthEncoderFunction = (value) => {
  const data = new Uint8ArrayList(
    allocUnsafe(4)
  )
  data.setInt32(0, value, false)

  return data
}
int32BEEncode.bytes = 4 // Always because fixed length
