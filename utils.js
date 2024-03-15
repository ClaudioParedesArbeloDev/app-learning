// Importar la función fileURLToPath del módulo 'url'
import {fileURLToPath} from 'url'

// Importar la función dirname del módulo 'path'
import { dirname } from 'path'

// Utilizar la función fileURLToPath para obtener la ruta de archivo del módulo actual
const __filename = fileURLToPath(import.meta.url)

// Utilizar la función dirname para obtener el nombre del directorio del archivo actual
const __dirname = dirname(__filename)

// Exportar el nombre del directorio del archivo actual como el valor predeterminado del módulo
export default __dirname