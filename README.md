# it-length-prefixed <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/alanshaw/it-length-prefixed.svg?style=flat-square)](https://codecov.io/gh/alanshaw/it-length-prefixed)
[![CI](https://img.shields.io/github/workflow/status/alanshaw/it-length-prefixed/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/alanshaw/it-length-prefixed/actions/workflows/js-test-and-release.yml)

> Streaming length prefixed buffers with async iterables

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [`encode([opts])`](#encodeopts)
  - [`encode.single(chunk, [opts])`](#encodesinglechunk-opts)
  - [`decode([opts])`](#decodeopts)
  - [`decode.fromReader(reader, [opts])`](#decodefromreaderreader-opts)
- [Contribute](#contribute)
- [License](#license)
- [Contribute](#contribute-1)

## Install

```console
$ npm i it-length-prefixed
```

## Usage

```js
import { pipe } from 'it-pipe'
import * as lp from 'it-length-prefixed'

const encoded = []

// encode
await pipe(
  [uint8ArrayFromString('hello world')],
  lp.encode(),
  async source => {
    for await (const chunk of source) {
      encoded.push(chunk.slice()) // (.slice converts Uint8ArrayList to Uint8Array)
    }
  }
)

console.log(encoded)
// => [Buffer <0b 68 65 6c 6c 6f 20 77 6f 72 6c 64>]

const decoded = []

// decode
await pipe(
  encoded, // e.g. from above
  lp.decode(),
  async source => {
    for await (const chunk of source) {
      decoded.push(chunk.slice()) // (.slice converts Uint8ArrayList to Uint8Array)
    }
  }
)

console.log(decoded)
// => [Buffer <68 65 6c 6c 6f 20 77 6f 72 6c 64>]
```

## API

```js
import {
  encode, decode
} from 'it-length-prefixed'

import {
  encode
} from 'it-length-prefixed/encode'

import {
  decode,
  MAX_LENGTH_LENGTH,
  MAX_DATA_LENGTH
} from 'it-length-prefixed/decode'
```

### `encode([opts])`

- `opts: Object`, optional
  - `lengthEncoder: Function`: A function that encodes the length that will prefix each message. By default this is a [`varint`](https://www.npmjs.com/package/varint) encoder. It is passed a `value` to encode, an (optional) `target` buffer to write to and an (optional) `offset` to start writing from. The function should encode the `value` into the `target` (or alloc a new Buffer if not specified), set the `lengthEncoder.bytes` value (the number of bytes written) and return the `target`.

Returns a [transform](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#transform-it) that yields [`Uint8ArrayList`](https://www.npmjs.com/package/uint8arraylist) objects. All messages will be prefixed with a length, determined by the `lengthEncoder` function.

### `encode.single(chunk, [opts])`

- `chunk: Buffer|Uint8ArrayList` chunk to encode
- `opts: Object`, optional
  - `lengthEncoder: Function`: See description above. Note that this encoder will *not* be passed a `target` or `offset` and so will need to allocate a buffer to write to.

Returns a `Uint8ArrayList` containing the encoded chunk.

### `decode([opts])`

- `opts: Object`, optional
  - `maxLengthLength`: If provided, will not decode messages whose length section exceeds the size specified, if omitted will use the default of 147 bytes.
  - `maxDataLength`: If provided, will not decode messages whose data section exceeds the size specified, if omitted will use the default of 4MB.
  - `onLength(len: Number)`: Called for every length prefix that is decoded from the stream
  - `onData(data: Uint8ArrayList)`: Called for every chunk of data that is decoded from the stream
  - `lengthDecoder: Function`: A function that decodes the length that prefixes each message. By default this is a [`varint`](https://www.npmjs.com/package/varint) decoder. It is passed some `data` to decode which is a [`Uint8ArrayList`](https://www.npmjs.com/package/uint8arraylist). The function should decode the length, set the `lengthDecoder.bytes` value (the number of bytes read) and return the length. If the length cannot be decoded, the function should throw a `RangeError`.

Returns a [transform](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#transform-it) that yields [`Uint8ArrayList`](https://www.npmjs.com/package/uint8arraylist) objects.

### `decode.fromReader(reader, [opts])`

Behaves like `decode` except it only reads the exact number of bytes needed for each message in `reader`.

- `reader: Reader`: An [it-reader](https://github.com/alanshaw/it-reader)
- `opts: Object`, optional
  - `maxLengthLength`: If provided, will not decode messages whose length section exceeds the size specified, if omitted will use the default of 147 bytes.
  - `maxDataLength`: If provided, will not decode messages whose data section exceeds the size specified, if omitted will use the default of 4MB.
  - `onData(data: Uint8ArrayList)`: Called for every chunk of data that is decoded from the stream
  - `lengthEncoder: Function`: See description above.

Returns a [transform](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#transform-it) that yields [`Uint8ArrayList`](https://www.npmjs.com/package/uint8arraylist) objects.

## Contribute

PRs and issues gladly accepted! Check out the [issues](https://github.com/alanshaw/it-length-prefixed/issues).

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
