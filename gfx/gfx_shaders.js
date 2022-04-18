module.exports.DEFAULT_VERTEX_SHADER = `
  attribute vec4 vPosition;
  attribute vec3 vNormal;
  attribute vec2 vTextureCoord;

  uniform mat4 uClipMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uModelMatrix;

  varying vec2 textureCoord;

  void main() {
    gl_Position = uClipMatrix * uProjectionMatrix * uViewMatrix * uModelMatrix * vPosition;
    vNormal;
    textureCoord = vTextureCoord;
  }
`;

module.exports.DEFAULT_PIXEL_SHADER = `
  precision mediump float;
  varying vec2 textureCoord;
  uniform sampler2D uTexture;

  void main() {
    gl_FragColor = texture2D(uTexture, textureCoord);
  }
`;

module.exports.DEBUG_VERTEX_SHADER = `
  attribute vec4 vPosition;

  uniform mat4 uClipMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uModelMatrix;

  void main() {
    gl_Position = uClipMatrix * uProjectionMatrix * uViewMatrix * uModelMatrix * vPosition;
    gl_PointSize = 5.0;
  }
`;

module.exports.DEBUG_PIXEL_SHADER = `
  precision mediump float;
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, 1);
  }
`;
