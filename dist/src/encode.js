import { Uint8ArrayList } from 'uint8arraylist';
import { varintEncode } from './varint-encode.js';
import { concat as uint8ArrayConcat } from 'uint8arrays';
export const MIN_POOL_SIZE = 8; // Varint.encode(Number.MAX_SAFE_INTEGER).length
export const DEFAULT_POOL_SIZE = 10 * 1024;
const ZEROs = Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0]);
export function encode(options) {
    options = options ?? {};
    const encodeLength = options.lengthEncoder ?? varintEncode;
    const encoder = async function* (source) {
        let pool = new Uint8Array(MIN_POOL_SIZE);
        for await (const chunk of source) {
            encodeLength(chunk.length, pool, 0);
            const encodedLength = pool.slice(0, encodeLength.bytes);
            yield uint8ArrayConcat([encodedLength, chunk.slice()], encodedLength.length + chunk.length);
            // overwrite "pool"
            pool.set(ZEROs);
        }
    };
    return encoder;
}
encode.single = (chunk, options) => {
    options = options ?? {};
    const encodeLength = options.lengthEncoder ?? varintEncode;
    return new Uint8ArrayList(encodeLength(chunk.length), chunk.slice());
};
//# sourceMappingURL=encode.js.map