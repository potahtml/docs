// gzip + base64 round-trip for the iframe payload. The playground
// transforms code in the parent, packages it, compresses it here, and
// hands it to the preview iframe via the URL hash. Ported from the old
// docs site (projects/docs/src/lib/compress.js).

import {
	compressSync,
	decompressSync,
	strToU8,
	strFromU8,
} from 'fflate'

function base64ToBytes(base64) {
	return Uint8Array.from(atob(base64), m => m.codePointAt(0))
}

function bytesToBase64(bytes) {
	return btoa(String.fromCodePoint(...bytes))
}

export function compress(s) {
	return bytesToBase64(compressSync(strToU8(JSON.stringify(s))))
}

export function uncompress(s) {
	return JSON.parse(strFromU8(decompressSync(base64ToBytes(s))))
}
