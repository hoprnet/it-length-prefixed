import randomInt from 'random-int';
import randomBytes from 'iso-random-stream/src/random.js';
export function times(n, fn) {
    return Array.from(Array(n)).fill(fn());
}
export function someBytes(n) {
    return randomBytes(randomInt(1, n ?? 32));
}
//# sourceMappingURL=index.js.map