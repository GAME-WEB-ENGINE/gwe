let { DEFAULT_VERTEX_SHADER, DEFAULT_PIXEL_SHADER, DEBUG_VERTEX_SHADER, DEBUG_PIXEL_SHADER } = require('./gfx_shaders');
let { ProjectionModeEnum, GfxView } = require('./gfx_view');
let { Utils } = require('../helpers');

class GfxManager {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.views = [];
    this.defaultShader = null;
    this.defaultShaderUniforms = {};
    this.debugShader = null;
    this.debugShaderUniforms = {};
    this.showDebug = false;

    this.canvas = document.getElementById('CANVAS');
    if (!this.canvas) {
      throw new Error('GfxManager::GfxManager: CANVAS not found');
    }

    this.gl = this.canvas.getContext('webgl2');
    if (!this.gl) {
      throw new Error('GfxManager::GfxManager: Your browser not support WebGL2');
    }

    this.views[0] = new GfxView();

    this.defaultShader = CREATE_SHADER_PROGRAM(this.gl, DEFAULT_VERTEX_SHADER, DEFAULT_PIXEL_SHADER);
    this.defaultShaderUniforms.pMatrix = this.gl.getUniformLocation(this.defaultShader, 'uProjectionMatrix');
    this.defaultShaderUniforms.vMatrix = this.gl.getUniformLocation(this.defaultShader, 'uViewMatrix');
    this.defaultShaderUniforms.mMatrix = this.gl.getUniformLocation(this.defaultShader, 'uModelMatrix');
    this.defaultShaderUniforms.position = this.gl.getAttribLocation(this.defaultShader, 'vPosition');
    this.defaultShaderUniforms.normal = this.gl.getAttribLocation(this.defaultShader, 'vNormal');
    this.defaultShaderUniforms.textureCoord = this.gl.getAttribLocation(this.defaultShader, 'vTextureCoord');
    this.defaultShaderUniforms.texture = this.gl.getUniformLocation(this.defaultShader, 'uTexture');

    this.debugShader = CREATE_SHADER_PROGRAM(this.gl, DEBUG_VERTEX_SHADER, DEBUG_PIXEL_SHADER);
    this.debugShaderUniforms.pMatrix = this.gl.getUniformLocation(this.debugShader, 'uProjectionMatrix');
    this.debugShaderUniforms.vMatrix = this.gl.getUniformLocation(this.debugShader, 'uViewMatrix');
    this.debugShaderUniforms.mMatrix = this.gl.getUniformLocation(this.debugShader, 'uModelMatrix');
    this.debugShaderUniforms.color = this.gl.getUniformLocation(this.debugShader, 'uColor');
    this.debugShaderUniforms.position = this.gl.getAttribLocation(this.debugShader, 'vPosition');

    this.canvas.addEventListener('webglcontextlost', (event) => event.preventDefault(), false);
  }

  update() {
    if (this.canvas.width != this.canvas.clientWidth || this.canvas.height != this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
  }

  getWidth() {
    return this.canvas.clientWidth;
  }

  getHeight() {
    return this.canvas.clientHeight;
  }

  getGLContext() {
    return this.gl;
  }

  getView(index) {
    return this.views[index];
  }

  getNumViews() {
    return this.views.length;
  }

  addView(view) {
    this.views.push(view);
  }

  changeView(index, view) {
    this.views[index] = view;
  }

  removeView(view) {
    this.views.splice(this.views.indexOf(view), 1);
  }

  releaseViews() {
    this.views = [];
  }

  getShowDebug() {
    return this.showDebug;
  }

  setShowDebug(showDebug) {
    this.showDebug = showDebug;
  }

  clear(viewIndex) {
    let view = this.views[viewIndex];
    let viewport = view.getViewport();
    let x = this.canvas.clientWidth * viewport.xFactor;
    let y = this.canvas.clientHeight * viewport.yFactor;
    let width = this.canvas.clientWidth * viewport.widthFactor;
    let height = this.canvas.clientHeight * viewport.heightFactor;

    let viewMatrix = view.getCameraViewMatrix();
    let projectionMatrix = Utils.MAT4_IDENTITY();
    let backgroundColor = view.getBackgroundColor();
    let projectionMode = view.getProjectionMode();
    let perspectiveFovy = view.getPerspectiveFovy();
    let perspectiveNear = view.getPerspectiveNear();
    let perspectiveFar = view.getPerspectiveFar();
    let orthographicDepth = view.getOrthographicDepth();

    if (projectionMode == ProjectionModeEnum.PERSPECTIVE) {
      projectionMatrix = Utils.MAT4_PERSPECTIVE(perspectiveFovy, width / height, perspectiveNear, perspectiveFar);
    }
    else if (projectionMode == ProjectionModeEnum.ORTHOGRAPHIC) {
      projectionMatrix = Utils.MAT4_ORTHOGRAPHIC(width, height, orthographicDepth);
    }
    else {
      throw new Error('GfxManager::setView(): ProjectionMode not valid !');
    }

    this.gl.viewport(x, y, width, height);
    this.gl.scissor(x, y, width, height);

    this.gl.enable(this.gl.SCISSOR_TEST);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.defaultShader);
    this.gl.uniformMatrix4fv(this.defaultShaderUniforms.pMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.defaultShaderUniforms.vMatrix, false, viewMatrix);

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.pMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.vMatrix, false, viewMatrix);
  }

  drawMesh(matrix, numVertices, vertices, normals, textureCoords, texture) {
    this.gl.useProgram(this.defaultShader);
    this.gl.uniformMatrix4fv(this.defaultShaderUniforms.mMatrix, false, matrix);

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.defaultShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.defaultShaderUniforms.position);

    let normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.defaultShaderUniforms.normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.defaultShaderUniforms.normal);

    let textureCoordsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.defaultShaderUniforms.textureCoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.defaultShaderUniforms.textureCoord);

    if (texture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glt);
      this.gl.uniform1i(this.defaultShaderUniforms.texture, 0);
    }

    this.gl.drawArrays(this.gl.TRIANGLES, 0, numVertices);
  }

  drawDebugSphere(matrix, radius, step, color = [1, 1, 1]) {
    if (!this.showDebug) {
      return;
    }

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let angleStep = (Math.PI * 0.5) / step;
    let vertices = [];
    let numVertices = 0;

    for (let i = step * -1; i <= step; i++) {
      let r = Math.cos(i * angleStep) * radius;
      let y = Math.sin(i * angleStep) * radius;
      for (let j = 0; j <= step * 4; j++) {
        let z = Math.sin(j * angleStep) * r;
        let x = Math.cos(j * angleStep) * Math.cos(i * angleStep) * radius;
        vertices.push(x, y, z);
        numVertices++;
      }
    }

    for (let i = step * -1; i <= step; i++) {
      for (let j = 0; j <= step * 4; j++) {
        let x = Math.cos(j * angleStep) * radius * Math.cos(i * angleStep);
        let y = Math.sin(j * angleStep) * radius;
        let z = Math.cos(j * angleStep) * radius * Math.sin(i * angleStep);
        vertices.push(x, y, z);
        numVertices++;
      }
    }

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);

    this.gl.uniform3fv(this.debugShaderUniforms.color, color);
    this.gl.drawArrays(this.gl.LINE_STRIP, 0, numVertices);
  }

  drawDebugAxes(matrix, size) {
    if (!this.showDebug) {
      return;
    }

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let axes = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

    for (let i = 0; i < axes.length; i++) {
      let vertices = [];
      vertices.push(0, 0, 0);
      vertices.push(Utils.VEC3_SCALE(axes[i], size));
      let vertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);
      this.gl.uniform3fv(this.debugShaderUniforms.color, axes[i]);
      this.gl.drawArrays(this.gl.LINES, 0, 2);
    }
  }

  drawDebugGrid(matrix, extend, spacing, color = [1, 1, 1]) {
    if (!this.showDebug) {
      return;
    }

    let nbCells = extend * 2;
    let gridSize = nbCells * spacing;
    let left = -gridSize * 0.5;
    let top = -gridSize * 0.5;
    let vertices = [];
    let numVertices = 0;

    for (let i = 0; i <= nbCells; i++) {
      let vLineFromX = left + (i * spacing);
      let vLineFromY = top;
      let vLineFromZ = 0;
      let vLineDestX = left + (i * spacing);
      let vLineDestY = top + gridSize;
      let vLineDestZ = 0;
      let hLineFromX = left;
      let hLineFromY = top + (i * spacing);
      let hLineFromZ = 0;
      let hLineDestX = left + gridSize;
      let hLineDestY = top + (i * spacing);
      let hLineDestZ = 0;
      vertices.push(vLineFromX, vLineFromY, vLineFromZ, vLineDestX, vLineDestY, vLineDestZ);
      vertices.push(hLineFromX, hLineFromY, hLineFromZ, hLineDestX, hLineDestY, hLineDestZ);
      numVertices += 4;
    }

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);
    this.gl.uniform3fv(this.debugShaderUniforms.color, color);
    this.gl.drawArrays(this.gl.LINES, 0, numVertices);
  }

  drawDebugBoundingBox(matrix, min, max, color = [1, 1, 1]) {
    if (!this.showDebug) {
      return;
    }

    let a = [min[0], min[1], min[2]];
    let b = [max[0], min[1], min[2]];
    let c = [max[0], max[1], min[2]];
    let d = [min[0], max[1], min[2]];
    let e = [min[0], max[1], max[2]];
    let f = [max[0], max[1], max[2]];
    let g = [max[0], min[1], max[2]];
    let h = [min[0], min[1], max[2]];

    let vertices = [];
    vertices.push(...a, ...b, ...h, ...g);
    vertices.push(...d, ...c, ...e, ...f);
    vertices.push(...a, ...d, ...h, ...e);
    vertices.push(...b, ...c, ...g, ...f);
    vertices.push(...d, ...e, ...c, ...f);
    vertices.push(...a, ...h, ...b, ...g);

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);
    this.gl.uniform3fv(this.debugShaderUniforms.color, color);
    this.gl.drawArrays(this.gl.LINES, 0, 24);
  }

  drawDebugLines(matrix, numVertices, vertices, color = [1, 1, 1]) {
    if (!this.showDebug) {
      return;
    }

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);
    this.gl.uniform3fv(this.debugShaderUniforms.color, color);
    this.gl.drawArrays(this.gl.LINES, 0, numVertices);
  }

  drawDebugPoints(matrix, numVertices, vertices, color = [1, 1, 1]) {
    if (!this.showDebug) {
      return;
    }

    this.gl.useProgram(this.debugShader);
    this.gl.uniformMatrix4fv(this.debugShaderUniforms.mMatrix, false, matrix);

    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.debugShaderUniforms.position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.debugShaderUniforms.position);
    this.gl.uniform3fv(this.debugShaderUniforms.color, color);
    this.gl.drawArrays(this.gl.POINTS, 0, numVertices);
  }
}

function CREATE_SHADER_PROGRAM(gl, vsSource, fsSource) {
  let vertexShader = CREATE_SHADER(gl, gl.VERTEX_SHADER, vsSource);
  let fragmentShader = CREATE_SHADER(gl, gl.FRAGMENT_SHADER, fsSource);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('CREATE_SHADER_PROGRAM: fail to init program shader' + gl.getProgramInfoLog(shaderProgram));
  }

  return shaderProgram;
}

function CREATE_SHADER(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error('CREATE_SHADER: An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

module.exports.gfxManager = new GfxManager();