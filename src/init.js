function init(canvas) {
  initContext(canvas)
  initShaders(ctx)
  override(canvas)
  return ctx
}



function override(canvas) {
  return extend(canvas,
                { appendChild: svgDomProxy
                , querySelectorAll: querySelectorAll
                , querySelector: querySelector
                })

}

function compileShader (type, src) {
  var shader = ctx.createShader(type)
  ctx.shaderSource(shader, src)
  ctx.compileShader(shader)
  if (! ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) throw new Error(ctx.getShaderInfoLog(shader))

  return shader
}

function initShaders() {
  var vertexShader = compileShader(ctx.VERTEX_SHADER, pathgl.vertex)
  var fragmentShader = compileShader(ctx.FRAGMENT_SHADER, pathgl.fragment)
  program = ctx.createProgram()
  ctx.attachShader(program, vertexShader)
  ctx.attachShader(program, fragmentShader)
  ctx.linkProgram(program)

  rgb = ctx.getUniformLocation(program, 'rgb')

  if (! ctx.getProgramParameter(program, ctx.LINK_STATUS)) return console.error("Shader is broken")

  ctx.useProgram(program)

  program.vertexPositionLoc = ctx.getAttribLocation(program, "aVertexPosition")
  ctx.enableVertexAttribArray(program.vertexPositionLoc)

  program.pMatrixLoc = ctx.getUniformLocation(program, "uPMatrix")
  ctx.uniformMatrix4fv(program.pMatrixLoc, 0, pmatrix)
}

function initContext(canvas) {
  canv = canvas

  ctx = canvas.getContext('webgl', { antialias: false })
  if (! ctx) return
  ctx.viewportWidth = canvas.width
  ctx.viewportHeight = canvas.height
}