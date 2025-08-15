import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
const port = 3000

app.use('/libs', express.static('libs'))
app.use(express.static('public'))

const obtenerTitulo = (arg)=>{
  if(arg === 'sketch.js') return 'p5' 
  return path.basename(arg,'.js')
}

const obtenerSketch = ()=>{
  const args = process.argv
  const fileArg = args.find(arg => arg.startsWith('--file='))
  return fileArg ? fileArg.split('=')[1] : 'sketch.js'
}

const obtenerLibrerias = () =>{
  const libsPath = path.join(process.cwd(), 'libs')

  try{
    const archivos = fs.readdirSync(libsPath)
    return archivos
      .filter(archivo => archivo.endsWith('js'))
      .map(archivo => `<script src="libs/${archivo}"></script>`)
      .join('\n ')
  }catch(error){
    return "<---- N0 se encontro nada --obtenerLibrerias()--->"
  }
}

app.get('/', (req, res) => {
  const libsScripts = obtenerLibrerias()
  const mainFile = obtenerSketch()
  const titulo = obtenerTitulo(mainFile)
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>${titulo}</title>
        <link rel="stylesheet" href="assets/style.css">
        ${libsScripts}
    </head>
    <body>
      <script src="${mainFile}"></script>
    </body>
    </html>
  `)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
