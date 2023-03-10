import {Shader} from "./shader.js";
import {vertSrc, fragSrc} from "./shaders.js";
function createIndexBuffer(gl, indices) {
  const buffer = gl.createBuffer();
  if (buffer == null) {
    return null;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return buffer;
}
function createVertexBuffer(gl, vertices) {
  const buffer = gl.createBuffer();
  if (buffer == null) {
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return buffer;
}
function initVertexAttribs(gl, shader, location, size) {
  const loc = gl.getAttribLocation(shader, location);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc);
}
class Renderer {
  constructor(gl, shader) {
    this.gl = gl;
    this.shader = shader;
    this.scaleLocation = gl.getUniformLocation(shader.program, "u_scale");
    this.translationLocation = gl.getUniformLocation(shader.program, "u_translation");
    this.zoomLocation = gl.getUniformLocation(shader.program, "u_zoom");
  }
  static create(gl) {
    const vertices = [
      -0.5,
      0.5,
      -0.5,
      -0.5,
      0.5,
      -0.5,
      0.5,
      0.5
    ];
    const uvs = [
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1
    ];
    const indices = [0, 1, 2, 2, 3, 0];
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const shader = Shader.create(gl, vertSrc, fragSrc);
    if (shader == null) {
      return null;
    }
    shader.use();
    const verticesBuffer = createVertexBuffer(gl, vertices);
    initVertexAttribs(gl, shader.program, "a_coord", 2);
    const uvsBuffer = createVertexBuffer(gl, uvs);
    initVertexAttribs(gl, shader.program, "a_texCoord", 2);
    const indexBuffer = createIndexBuffer(gl, indices);
    return new Renderer(gl, shader);
  }
  drawRect() {
    const {gl} = this;
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
  clear() {
    const {gl} = this;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  setViewportSize(width, height) {
    const max = Math.max(width, height);
    this.setScale(height / max, width / max);
    this.gl.viewport(0, 0, width, height);
  }
  setTranslation(x, y) {
    const {gl, translationLocation: location} = this;
    gl.uniform2f(location, x, y);
  }
  setScale(vertical, horizontal) {
    const {gl, scaleLocation: location} = this;
    gl.uniform2f(location, vertical, horizontal);
    ;
  }
  setZoom(amount) {
    const {gl, zoomLocation} = this;
    gl.uniform1f(zoomLocation, amount);
  }
}
export {
  Renderer
};
