class Shader {
  constructor(gl, program) {
    this.program = program;
    this.gl = gl;
  }
  static create(gl, vertSrc, fragSrc) {
    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    if (frag == null) {
      throw new Error("Failed to create fragment shader");
    }
    gl.shaderSource(frag, fragSrc);
    const vert = gl.createShader(gl.VERTEX_SHADER);
    if (vert == null) {
      return null;
    }
    gl.shaderSource(vert, vertSrc);
    const program = gl.createProgram();
    if (program == null) {
      return null;
    }
    function checkShader(shader) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.log(gl.getShaderInfoLog(shader));
    }
    gl.compileShader(vert);
    gl.compileShader(frag);
    checkShader(vert);
    checkShader(frag);
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    return new Shader(gl, program);
  }
  use() {
    this.gl.useProgram(this.program);
  }
}
export {
  Shader
};
