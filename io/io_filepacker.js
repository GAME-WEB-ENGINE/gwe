const PATH_SIZE = 255;
const ENTRY_SIZE = PATH_SIZE + 8;
const HEADER_SIZE = 5;

class Header {
  constructor() {
    this.valid = false;
    this.numEntries = 0;
  }
}

class Entry {
  constructor() {
    this.path = '';
    this.offset = 0;
    this.size = 0;
  }
}

class TOC {
  constructor() {
    this.header = new Header();
    this.entries = [];
  }
}

/**
 * Classe représentant un outil de compression/decompression de données binaires à la volée.
 */
class IOFilepacker {
  /**
   * Ouvre un fichier cible et renvoi un descripteur.
   * @return {number} Un entier représentant le descripteur de fichier.
   */
  static openFile(path) {
    return Fs.openSync(path, 'r+');
  }

  /**
   * Ferme un fichier cible.
   * @param {number} fd - Descripteur de fichier.
   * @return {boolean} - Vrai si fermeture réussie.
   */
  static closeFile(fd) {
    return Fs.closeSync(fd);
  }

  /**
   * Compresse le dossier cible dans le package.
   * @param {number} fd - Descripteur de fichier.
   * @param {string} path - Chemin cible à compresser.
   * @param {boolean} recursive - Si vrai, l'opération est récursive.
   */
  static empack(fd, path, recursive) {
    let toc = new TOC();
    CREATE_TOC(path, recursive, toc);

    let offset = HEADER_SIZE + (ENTRY_SIZE * toc.header.numEntries);
    for (let entry of toc.entries) {
      let buf = Fs.readFileSync(entry.path);
      let compressedBuf = Zlib.gzipSync(buf);
      Fs.writeSync(fd, compressedBuf, 0, compressedBuf.byteLength, offset);
      entry.offset = offset;
      entry.size = compressedBuf.byteLength;
      offset += compressedBuf.byteLength;
    }

    toc.header.valid = 1;
    WRITE_TOC(fd, toc);
  }

  /**
   * Décompresse le package dans le dossier cible.
   * @param {number} fd - Descripteur de fichier.
   * @param {string} path - Chemin cible.
   */
  static unpack(fd, path) {
    let toc = new TOC();
    READ_TOC(fd, toc);

    let entry = toc.entries.find(entry => entry.path == path);
    if (!entry) {
      throw new Error('Filepacker::unpack: path not exist in package !');
    }

    let buf = Buffer.alloc(entry.size);
    Fs.readSync(fd, buf, 0, buf.byteLength, entry.offset);
    let uncompressedBuf = Zlib.gunzipSync(buf);

    return uncompressedBuf;
  }
}

function CREATE_TOC(directory, recursive, toc) {
  if (!Fs.statSync(directory).isDirectory()) {
    throw new Error('target path to empack is not a directory : ' + directory);
  }

  let files = Fs.readdirSync(directory);
  for (let file of files) {
    let path = directory + file;
    let stat = Fs.statSync(path);
    if (stat.isFile() && path.length <= PATH_SIZE) {
      let entry = new Entry();
      entry.path = path;
      toc.entries.push(entry);
      toc.header.numEntries++;
    }
    else if (recursive && stat.isDirectory()) {
      CREATE_TOC(path, recursive, toc);
    }
  }
}

function RESET_TOC(toc) {
  toc.header.valid = 0;
  toc.header.numEntries = 0;
  toc.entries = [];
}

function WRITE_TOC(fd, toc) {
  let buf = new Uint8Array(1);
  let offset = 0;

  buf = new Uint8Array(1);
  buf[0] = toc.header.valid;
  Fs.writeSync(fd, buf, 0, buf.byteLength, offset);
  offset += 1;

  buf = new Uint32Array(1);
  buf[0] = toc.header.numEntries;
  Fs.writeSync(fd, buf, 0, buf.byteLength, offset);
  offset += 4;

  for (let i = 0; i < toc.header.numEntries; i++) {
    let entry = toc.entries[i];

    buf = new Uint8Array(PATH_SIZE);
    for (let i = 0; i < PATH_SIZE; i++) buf[i] = entry.path.charCodeAt(i);
    Fs.writeSync(fd, buf, 0, buf.byteLength, offset);
    offset += PATH_SIZE;

    buf = new Uint32Array(1);
    buf[0] = entry.offset;
    Fs.writeSync(fd, buf, 0, buf.byteLength, offset);
    offset += 4;

    buf = new Uint32Array(1);
    buf[0] = entry.size;
    Fs.writeSync(fd, buf, 0, buf.byteLength, offset);
    offset += 4;
  }
}

function READ_TOC(fd, toc) {
  let buf = new Uint8Array(1);
  let offset = 0;

  buf = new Uint8Array(1);
  Fs.readSync(fd, buf, 0, buf.byteLength, offset);
  toc.header.valid = buf[0];
  offset += 1;

  buf = new Uint32Array(1);
  Fs.readSync(fd, buf, 0, buf.byteLength, offset);
  toc.header.numEntries = buf[0];
  offset += 4;

  for (let i = 0; i < toc.header.numEntries; i++) {
    let entry = new Entry();

    buf = new Uint8Array(PATH_SIZE);
    Fs.readSync(fd, buf, 0, buf.byteLength, offset);
    let j = 0; while (buf[j] != 0) entry.path += String.fromCharCode(buf[j++]);
    offset += PATH_SIZE;

    buf = new Uint32Array(1);
    Fs.readSync(fd, buf, 0, buf.byteLength, offset);
    entry.offset = buf[0];
    offset += 4;

    buf = new Uint32Array(1);
    Fs.readSync(fd, buf, 0, buf.byteLength, offset);
    entry.size = buf[0];
    offset += 4;

    toc.entries.push(entry);
  }
}

module.exports.IOFilepacker = IOFilepacker;