// ============================================================
// CYBER HAYAT — compact offline QR code generator (byte mode, error correction M, versions 1–6, up to 106 bytes).
// CH_QR.draw(canvas, text) -> true on success, false if the text is too long.
// ============================================================
(function(){
  "use strict";
  // [version]: [total codewords, EC codewords per block, blocks, data bytes capacity, alignment positions]
  const V = { 1:[26,10,1,14,[]], 2:[44,16,1,26,[6,18]], 3:[70,26,1,42,[6,22]], 4:[100,18,2,62,[6,26]], 5:[134,24,2,84,[6,30]], 6:[172,16,4,106,[6,34]] };
  function mul(x, y){ let z = 0; for(let i = 7; i >= 0; i--){ z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 0xFF; }
  function divisor(deg){ const r = new Array(deg).fill(0); r[deg - 1] = 1; let root = 1;
    for(let i = 0; i < deg; i++){ for(let j = 0; j < r.length; j++){ r[j] = mul(r[j], root); if(j + 1 < r.length) r[j] ^= r[j + 1]; } root = mul(root, 2); } return r; }
  function remainder(data, div){ const r = div.map(() => 0); for(const b of data){ const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); } return r; }
  const bit = (x, i) => ((x >>> i) & 1) !== 0;

  function encode(text){
    const bytes = Array.from(new TextEncoder().encode(text));
    let ver = 0; for(let v = 1; v <= 6; v++){ if(bytes.length <= V[v][3]){ ver = v; break; } }
    if(!ver) return null;
    const [total, ecLen, blocks] = V[ver];
    const dataCw = total - ecLen * blocks;
    const bits = []; const put = (val, n) => { for(let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, 8); bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, dataCw * 8 - bits.length));
    while(bits.length % 8) bits.push(0);
    const cw = []; for(let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    for(let pad = 0xEC; cw.length < dataCw; pad ^= 0xEC ^ 0x11) cw.push(pad);
    const per = dataCw / blocks, div = divisor(ecLen), dataBlocks = [], ecBlocks = [];
    for(let b = 0; b < blocks; b++){ const d = cw.slice(b * per, (b + 1) * per); dataBlocks.push(d); ecBlocks.push(remainder(d, div)); }
    const out = [];
    for(let i = 0; i < per; i++) dataBlocks.forEach(d => out.push(d[i]));
    for(let i = 0; i < ecLen; i++) ecBlocks.forEach(e => out.push(e[i]));
    return { ver, out };
  }

  function build(text){
    const enc = encode(text); if(!enc) return null;
    const ver = enc.ver, size = 17 + ver * 4;
    const m = Array.from({ length: size }, () => new Array(size).fill(false)), fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (x, y, d) => { m[y][x] = d; fn[y][x] = true; };
    for(let i = 0; i < size; i++){ set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => { for(let dy = -4; dy <= 4; dy++) for(let dx = -4; dx <= 4; dx++){ const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy; if(x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4); } };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    const al = V[ver][4];
    al.forEach((ax, i) => al.forEach((ay, j) => { if((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
      for(let dy = -2; dy <= 2; dy++) for(let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }));
    const formatBits = mask => {
      const data = (0 << 3) | mask; let rem = data; for(let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const bits = ((data << 10) | rem) ^ 0x5412;
      for(let i = 0; i <= 5; i++) set(8, i, bit(bits, i));
      set(8, 7, bit(bits, 6)); set(8, 8, bit(bits, 7)); set(7, 8, bit(bits, 8));
      for(let i = 9; i < 15; i++) set(14 - i, 8, bit(bits, i));
      for(let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(bits, i));
      for(let i = 8; i < 15; i++) set(8, size - 15 + i, bit(bits, i));
      set(8, size - 8, true);
    };
    formatBits(0);
    let i = 0;
    for(let right = size - 1; right >= 1; right -= 2){
      if(right === 6) right = 5;
      for(let vert = 0; vert < size; vert++) for(let j = 0; j < 2; j++){
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if(!fn[y][x] && i < enc.out.length * 8){ m[y][x] = bit(enc.out[i >>> 3], 7 - (i & 7)); i++; }
      }
    }
    for(let y = 0; y < size; y++) for(let x = 0; x < size; x++) if(!fn[y][x] && (x + y) % 2 === 0) m[y][x] = !m[y][x];
    formatBits(0);
    return m;
  }
  function draw(canvas, text, px){
    const m = build(text); if(!m) return false;
    const n = m.length, quiet = 4, scale = Math.max(2, Math.floor((px || 320) / (n + quiet * 2)));
    canvas.width = canvas.height = (n + quiet * 2) * scale;
    const c = canvas.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, canvas.width, canvas.height); c.fillStyle = "#000";
    for(let y = 0; y < n; y++) for(let x = 0; x < n; x++) if(m[y][x]) c.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
    return true;
  }
  window.CH_QR = { draw, MAX_BYTES: 106 };
})();
