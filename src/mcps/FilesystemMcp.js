const BaseMcp = require('./BaseMcp');

/**
 * Configurador para el MCP de FileSystem
 */
class FilesystemMcp extends BaseMcp {
  constructor(env) {
    super(env);
  }

  /**
   * Validaciones específicas del FileSystem MCP
   */
  validateSpecific() {
    const errors = [];
    const warnings = [];

    // Verificar que las rutas permitidas estén definidas
    const pathsVar = this.requireEnvVar('FILESYSTEM_ALLOWED_PATHS');
    if (pathsVar) {
      errors.push(pathsVar);
      return { errors, warnings };
    }

    // Verificar que las rutas existan
    const allowedPaths = this.env.FILESYSTEM_ALLOWED_PATHS.split(',').map(p => p.trim());
    
    for (const path of allowedPaths) {
      if (!path) continue;
      
      const dirError = this.requireDirectory(path);
      if (dirError) {
        errors.push(dirError);
      }
    }

    // Advertencia si no hay rutas configuradas
    if (allowedPaths.length === 0 || (allowedPaths.length === 1 && !allowedPaths[0])) {
      warnings.push('No hay rutas permitidas configuradas para FileSystem MCP');
    }

    return { errors, warnings };
  }

  /**
   * Construye la configuración del FileSystem MCP
   */
  buildConfig() {
    const allowedPaths = this.env.FILESYSTEM_ALLOWED_PATHS
      .split(',')
      .map(p => p.trim())
      .filter(p => p); // Filtrar paths vacíos

    return {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        ...allowedPaths
      ]
    };
  }

  /**
   * Variables de entorno requeridas
   */
  getRequiredEnvVars() {
    return ['FILESYSTEM_ALLOWED_PATHS'];
  }

  /**
   * Documentación del FileSystem MCP
   */
  getDocumentation() {
    return `# FileSystem MCP

Permite a Claude acceder a archivos y directorios específicos del sistema.

## Variables de entorno requeridas

- \`FILESYSTEM_ENABLED\`: \`true\` para habilitar, \`false\` para deshabilitar
- \`FILESYSTEM_ALLOWED_PATHS\`: Lista de rutas separadas por comas que Claude puede acceder

## Ejemplo de configuración

\`\`\`bash
FILESYSTEM_ENABLED=true
FILESYSTEM_ALLOWED_PATHS=~/Desktop/Projects,~/Documents/work,/tmp
\`\`\`

## Características

- **Acceso controlado**: Solo permite acceso a las rutas especificadas
- **Seguridad**: No puede acceder fuera de las rutas permitidas
- **Multiplataforma**: Funciona en Windows, macOS y Linux
- **Expansión de rutas**: Soporta \`~\` para el directorio home

## Comandos disponibles

- Leer archivos
- Escribir archivos
- Listar directorios
- Crear directorios
- Eliminar archivos/directorios
- Buscar archivos

## Seguridad

⚠️ **Importante**: Solo agrega rutas que confíes que Claude pueda acceder. El MCP puede leer, escribir y eliminar archivos en las rutas permitidas.`;
  }
}

module.exports = FilesystemMcp;