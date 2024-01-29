function addImportmap() {
  /* adds to the page the freaking importmap */

  const props = uncompress(
    decodeURIComponent(window.location.hash.substring(1)),
  )

  let importmap =
    (props && props.importmap) ||
    `{

  "comment": "If you change the reactive lib with the playground dropdown, then you dont need to change the imports here.",

  "imports": {
    "pota": "/dist/preview/standalone/standalone.no-min.js",
    "pota/jsx-runtime": "/dist/preview/standalone/standalone.no-min.js",
    "pota/router": "/dist/preview/standalone/standalone.no-min.js",
    "pota/hooks": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins": "/dist/preview/standalone/standalone.no-min.js",
    "pota/plugins/bind": "/dist/preview/standalone/standalone.no-min.js",
    "x/articles/": "/pages/%40articles/"
  }
}`

  if (props && props.lib && props.lib !== 'solid') {
    importmap = importmap.replace(
      /standalone\/standalone.no-min.js/g,
      'standalone/standalone.' + props.lib + '.no-min.js',
    )
  }

  // create importmap

  const map = document.createElement('script')
  map.setAttribute('type', 'importmap')
  map.textContent = importmap
  document.head.append(map)
}

// LIB STUFF

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array,
  u16 = Uint16Array,
  i32 = Int32Array
// fixed length extra bits
var fleb = new u8([
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4,
  4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0,
])
// fixed distance extra bits
var fdeb = new u8([
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
  10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0,
])
// code length index map
var clim = new u8([
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
])
// get base, reverse index map from extra bits
var freb = function (eb, start) {
  var b = new u16(31)
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1]
  }
  // numbers here are at max 18 bits
  var r = new i32(b[30])
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = ((j - b[i]) << 5) | i
    }
  }
  return {
    b: b,
    r: r,
  }
}
var _a = freb(fleb, 2),
  fl = _a.b,
  revfl = _a.r
// we can ignore the fact that the other numbers are wrong; they never happen anyway
;(fl[28] = 258), (revfl[258] = 28)
var _b = freb(fdeb, 0),
  fd = _b.b
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768)
for (var i = 0; i < 32768; ++i) {
  // reverse table algorithm from SO
  var x = ((i & 0xaaaa) >> 1) | ((i & 0x5555) << 1)
  x = ((x & 0xcccc) >> 2) | ((x & 0x3333) << 2)
  x = ((x & 0xf0f0) >> 4) | ((x & 0x0f0f) << 4)
  rev[i] = (((x & 0xff00) >> 8) | ((x & 0x00ff) << 8)) >> 1
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = function (cd, mb, r) {
  var s = cd.length
  // index
  var i = 0
  // u16 "map": index -> # of codes with bit length = index
  var l = new u16(mb)
  // length of cd must be 288 (total # of codes)
  for (; i < s; ++i) {
    if (cd[i]) ++l[cd[i] - 1]
  }
  // u16 "map": index -> minimum code for bit length = index
  var le = new u16(mb)
  for (i = 1; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1
  }
  var co
  if (r) {
    // u16 "map": index -> number of actual bits, symbol for code
    co = new u16(1 << mb)
    // bits to remove for reverser
    var rvb = 15 - mb
    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        var sv = (i << 4) | cd[i]
        // free bits
        var r_1 = mb - cd[i]
        // start value
        var v = le[cd[i] - 1]++ << r_1
        // m is end value
        for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >> rvb] = sv
        }
      }
    }
  } else {
    co = new u16(s)
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i])
      }
    }
  }
  return co
}
// fixed length tree
var flt = new u8(288)
for (var i = 0; i < 144; ++i) flt[i] = 8
for (var i = 144; i < 256; ++i) flt[i] = 9
for (var i = 256; i < 280; ++i) flt[i] = 7
for (var i = 280; i < 288; ++i) flt[i] = 8
// fixed distance tree
var fdt = new u8(32)
for (var i = 0; i < 32; ++i) fdt[i] = 5
// fixed length map
var flrm = /*#__PURE__*/ hMap(flt, 9, 1)
// fixed distance map
var fdrm = /*#__PURE__*/ hMap(fdt, 5, 1)
// find max of array
var max = function (a) {
  var m = a[0]
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m) m = a[i]
  }
  return m
}
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
  var o = (p / 8) | 0
  return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m
}
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
  var o = (p / 8) | 0
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7)
}
// get end of byte
var shft = function (p) {
  return ((p + 7) / 8) | 0
}
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
  if (s == null || s < 0) s = 0
  if (e == null || e > v.length) e = v.length
  // can't use .constructor in case user-supplied
  return new u8(v.subarray(s, e))
}
// error codes
var ec = [
  'unexpected EOF',
  'invalid block type',
  'invalid length/literal',
  'invalid distance',
  'stream finished',
  'no stream handler',
  ,
  'no callback',
  'invalid UTF-8 data',
  'extra field too long',
  'date not in range 1980-2099',
  'filename too long',
  'stream finishing',
  'invalid zip data',
  // determined by unknown compression method
]
var err = function (ind, msg, nt) {
  var e = new Error(msg || ec[ind])
  e.code = ind
  if (Error.captureStackTrace) Error.captureStackTrace(e, err)
  if (!nt) throw e
  return e
}
// expands raw DEFLATE data
var inflt = function (dat, st, buf, dict) {
  // source length       dict length
  var sl = dat.length,
    dl = dict ? dict.length : 0
  if (!sl || (st.f && !st.l)) return buf || new u8(0)
  var noBuf = !buf
  // have to estimate size
  var resize = noBuf || st.i != 2
  // no state
  var noSt = st.i
  // Assumes roughly 33% compression ratio average
  if (noBuf) buf = new u8(sl * 3)
  // ensure buffer can fit at least l elements
  var cbuf = function (l) {
    var bl = buf.length
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      var nbuf = new u8(Math.max(bl * 2, l))
      nbuf.set(buf)
      buf = nbuf
    }
  }
  //  last chunk         bitpos           bytes
  var final = st.f || 0,
    pos = st.p || 0,
    bt = st.b || 0,
    lm = st.l,
    dm = st.d,
    lbt = st.m,
    dbt = st.n
  // total bits
  var tbts = sl * 8
  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      final = bits(dat, pos, 1)
      // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
      var type = bits(dat, pos + 1, 3)
      pos += 3
      if (!type) {
        // go to end of byte boundary
        var s = shft(pos) + 4,
          l = dat[s - 4] | (dat[s - 3] << 8),
          t = s + l
        if (t > sl) {
          if (noSt) err(0)
          break
        }
        // ensure size
        if (resize) cbuf(bt + l)
        // Copy over uncompressed data
        buf.set(dat.subarray(s, t), bt)
        // Get new bitpos, update byte count
        ;(st.b = bt += l), (st.p = pos = t * 8), (st.f = final)
        continue
      } else if (type == 1)
        (lm = flrm), (dm = fdrm), (lbt = 9), (dbt = 5)
      else if (type == 2) {
        //  literal                            lengths
        var hLit = bits(dat, pos, 31) + 257,
          hcLen = bits(dat, pos + 10, 15) + 4
        var tl = hLit + bits(dat, pos + 5, 31) + 1
        pos += 14
        // length+distance tree
        var ldt = new u8(tl)
        // code length tree
        var clt = new u8(19)
        for (var i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7)
        }
        pos += hcLen * 3
        // code lengths bits
        var clb = max(clt),
          clbmsk = (1 << clb) - 1
        // code lengths map
        var clm = hMap(clt, clb, 1)
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)]
          // bits read
          pos += r & 15
          // symbol
          var s = r >> 4
          // code length to copy
          if (s < 16) {
            ldt[i++] = s
          } else {
            //  copy   count
            var c = 0,
              n = 0
            if (s == 16)
              (n = 3 + bits(dat, pos, 3)),
                (pos += 2),
                (c = ldt[i - 1])
            else if (s == 17) (n = 3 + bits(dat, pos, 7)), (pos += 3)
            else if (s == 18)
              (n = 11 + bits(dat, pos, 127)), (pos += 7)
            while (n--) ldt[i++] = c
          }
        }
        //    length tree                 distance tree
        var lt = ldt.subarray(0, hLit),
          dt = ldt.subarray(hLit)
        // max length bits
        lbt = max(lt)
        // max dist bits
        dbt = max(dt)
        lm = hMap(lt, lbt, 1)
        dm = hMap(dt, dbt, 1)
      } else err(1)
      if (pos > tbts) {
        if (noSt) err(0)
        break
      }
    }
    // Make sure the buffer can hold this + the largest possible addition
    // Maximum chunk size (practically, theoretically infinite) is 2^17
    if (resize) cbuf(bt + 131072)
    var lms = (1 << lbt) - 1,
      dms = (1 << dbt) - 1
    var lpos = pos
    for (; ; lpos = pos) {
      // bits read, code
      var c = lm[bits16(dat, pos) & lms],
        sym = c >> 4
      pos += c & 15
      if (pos > tbts) {
        if (noSt) err(0)
        break
      }
      if (!c) err(2)
      if (sym < 256) buf[bt++] = sym
      else if (sym == 256) {
        ;(lpos = pos), (lm = null)
        break
      } else {
        var add = sym - 254
        // no extra bits needed if less
        if (sym > 264) {
          // index
          var i = sym - 257,
            b = fleb[i]
          add = bits(dat, pos, (1 << b) - 1) + fl[i]
          pos += b
        }
        // dist
        var d = dm[bits16(dat, pos) & dms],
          dsym = d >> 4
        if (!d) err(3)
        pos += d & 15
        var dt = fd[dsym]
        if (dsym > 3) {
          var b = fdeb[dsym]
          ;(dt += bits16(dat, pos) & ((1 << b) - 1)), (pos += b)
        }
        if (pos > tbts) {
          if (noSt) err(0)
          break
        }
        if (resize) cbuf(bt + 131072)
        var end = bt + add
        if (bt < dt) {
          var shift = dl - dt,
            dend = Math.min(dt, end)
          if (shift + bt < 0) err(3)
          for (; bt < dend; ++bt) buf[bt] = dict[shift + bt]
        }
        for (; bt < end; ++bt) buf[bt] = buf[bt - dt]
      }
    }
    ;(st.l = lm), (st.p = lpos), (st.b = bt), (st.f = final)
    if (lm) (final = 1), (st.m = lbt), (st.d = dm), (st.n = dbt)
  } while (!final)
  // don't reallocate for streams or user buffers
  return bt != buf.length && noBuf
    ? slc(buf, 0, bt)
    : buf.subarray(0, bt)
}
// empty
var et = /*#__PURE__*/ new u8(0)
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, 'invalid gzip data')
  var flg = d[3]
  var st = 10
  if (flg & 4) st += (d[10] | (d[11] << 8)) + 2
  for (
    var zs = ((flg >> 3) & 1) + ((flg >> 4) & 1);
    zs > 0;
    zs -= !d[st++]
  );
  return st + (flg & 2)
}
// gzip length
var gzl = function (d) {
  var l = d.length
  return (
    (d[l - 4] |
      (d[l - 3] << 8) |
      (d[l - 2] << 16) |
      (d[l - 1] << 24)) >>>
    0
  )
}
// zlib start
var zls = function (d, dict) {
  if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || ((d[0] << 8) | d[1]) % 31)
    err(6, 'invalid zlib data')
  if (((d[1] >> 5) & 1) == +!dict)
    err(
      6,
      'invalid zlib data: ' +
        (d[1] & 32 ? 'need' : 'unexpected') +
        ' dictionary',
    )
  return ((d[1] >> 3) & 4) + 2
}
/**
 * Expands DEFLATE data with no wrapper
 *
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function inflateSync(data, opts) {
  return inflt(
    data,
    {
      i: 2,
    },
    opts && opts.out,
    opts && opts.dictionary,
  )
}
/**
 * Expands GZIP data
 *
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function gunzipSync(data, opts) {
  var st = gzs(data)
  if (st + 8 > data.length) err(6, 'invalid gzip data')
  return inflt(
    data.subarray(st, -8),
    {
      i: 2,
    },
    (opts && opts.out) || new u8(gzl(data)),
    opts && opts.dictionary,
  )
}
/**
 * Expands Zlib data
 *
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function unzlibSync(data, opts) {
  return inflt(
    data.subarray(zls(data, opts && opts.dictionary), -4),
    {
      i: 2,
    },
    opts && opts.out,
    opts && opts.dictionary,
  )
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically
 * detecting the format
 *
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function decompressSync(data, opts) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8
    ? gunzipSync(data, opts)
    : (data[0] & 15) != 8 ||
        data[0] >> 4 > 7 ||
        ((data[0] << 8) | data[1]) % 31
      ? inflateSync(data, opts)
      : unzlibSync(data, opts)
}
// text decoder
var td =
  typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder()
// text decoder stream
var tds = 0
try {
  td.decode(et, {
    stream: true,
  })
  tds = 1
} catch (e) {}
// decode UTF8
var dutf8 = function (d) {
  for (var r = '', i = 0; ; ) {
    var c = d[i++]
    var eb = (c > 127) + (c > 223) + (c > 239)
    if (i + eb > d.length)
      return {
        s: r,
        r: slc(d, i - 1),
      }
    if (!eb) r += String.fromCharCode(c)
    else if (eb == 3) {
      ;(c =
        (((c & 15) << 18) |
          ((d[i++] & 63) << 12) |
          ((d[i++] & 63) << 6) |
          (d[i++] & 63)) -
        65536),
        (r += String.fromCharCode(
          55296 | (c >> 10),
          56320 | (c & 1023),
        ))
    } else if (eb & 1)
      r += String.fromCharCode(((c & 31) << 6) | (d[i++] & 63))
    else
      r += String.fromCharCode(
        ((c & 15) << 12) | ((d[i++] & 63) << 6) | (d[i++] & 63),
      )
  }
}
/**
 * Converts a Uint8Array to a string
 *
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This
 *   should not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = ''
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384))
    return r
  } else if (td) {
    return td.decode(dat)
  } else {
    var _a = dutf8(dat),
      s = _a.s,
      r = _a.r
    if (r.length) err(8)
    return s
  }
}

function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), m => m.codePointAt(0))
}
function uncompress(s) {
  return JSON.parse(strFromU8(decompressSync(base64ToBytes(s))))
}

addImportmap()
