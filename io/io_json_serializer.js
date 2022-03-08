let fs = require('fs');

class IOJSONSerializer {
  static fromFile(object, path) {
    let json = JSON.parse(fs.readFileSync(path));
    IOJSONSerializer.fromJSON(object, json);
  }

  static toFile(object, path) {
    // à écrire.
  }

  static fromJSON(object, json) {
    return object.fromJSON(json);
  }

  static toJSON(object) {
    return object.toJSON();
  }
}

module.exports.IOJSONSerializer = IOJSONSerializer;