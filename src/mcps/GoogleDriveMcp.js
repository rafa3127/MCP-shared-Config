const BaseMcp = require('./BaseMcp');

/**
 * Configurador para el MCP de Google Drive
 */
class GoogleDriveMcp extends BaseMcp {
  constructor(env) {
    super(env);
  }

  /**
   * Prioridad alta para Google Drive - debe usarse sobre herramientas nativas
   */
  getPriority() {
    return 10; // Alta prioridad
  }

  /**
   * Obtiene el nombre de la variable de habilitación
   * Sobrescrito porque usamos GDRIVE_ENABLED en lugar de GOOGLEDRIVE_ENABLED
   */
  getEnabledVar() {
    return 'GDRIVE_ENABLED';
  }

  /**
   * Instrucciones específicas para Claude
   */
  getClaudeInstructions() {
    return `🔴 IMPORTANTE: Para búsquedas de Google Drive, especialmente Google Sheets, SIEMPRE usa el MCP de Google Drive (herramientas search y gdrive://) en lugar de las herramientas nativas de Google Drive. 

El MCP externo puede:
- Buscar archivos por nombre exacto
- Leer Google Sheets como CSV
- Acceder a múltiples hojas
- Analizar datos tabulares

NUNCA uses google_drive_search cuando este MCP esté habilitado.`;
  }

  /**
   * Validaciones específicas del Google Drive MCP
   */
  validateSpecific() {
    const errors = [];
    const warnings = [];

    // Verificar que el archivo de credenciales esté definido
    const credentialsVar = this.requireEnvVar('GDRIVE_CREDENTIALS_PATH');
    if (credentialsVar) {
      errors.push(credentialsVar);
      return { errors, warnings };
    }

    // Verificar que el archivo de credenciales exista
    const credentialsPath = this.env.GDRIVE_CREDENTIALS_PATH;
    const fileError = this.requireFile(credentialsPath);
    if (fileError) {
      errors.push(`${fileError} - Necesitas ejecutar el proceso de autenticación primero`);
    }

    // Verificar que el archivo tenga extensión .json
    if (!credentialsPath.endsWith('.json')) {
      warnings.push('El archivo de credenciales debería tener extensión .json');
    }

    return { errors, warnings };
  }

  /**
   * Construye la configuración del Google Drive MCP
   */
  buildConfig() {
    return {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-gdrive"
      ],
      env: {
        GDRIVE_CREDENTIALS_PATH: this.env.GDRIVE_CREDENTIALS_PATH
      }
    };
  }

  /**
   * Variables de entorno requeridas
   */
  getRequiredEnvVars() {
    return ['GDRIVE_CREDENTIALS_PATH'];
  }

  /**
   * Documentación del Google Drive MCP
   */
  getDocumentation() {
    return `# Google Drive MCP

Permite a Claude acceder a archivos de Google Drive, incluyendo Google Sheets, Docs y otros archivos.

## Variables de entorno requeridas

- \`GDRIVE_ENABLED\`: \`true\` para habilitar, \`false\` para deshabilitar
- \`GDRIVE_CREDENTIALS_PATH\`: Ruta al archivo de credenciales JSON

## Configuración inicial

### 1. Configurar Google Cloud Project
1. [Crear nuevo proyecto](https://console.cloud.google.com/projectcreate)
2. [Habilitar Google Drive API](https://console.cloud.google.com/workspace-api/products)
3. [Configurar OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
4. Agregar scope: \`https://www.googleapis.com/auth/drive.readonly\`
5. [Crear OAuth Client ID](https://console.cloud.google.com/apis/credentials/oauthclient) tipo "Desktop App"
6. Descargar JSON de credenciales

### 2. Autenticación
\`\`\`bash
# Ejecutar una vez para autenticar
npx @modelcontextprotocol/server-gdrive auth
\`\`\`

### 3. Configuración en .env
\`\`\`bash
GDRIVE_ENABLED=true
GDRIVE_CREDENTIALS_PATH=/ruta/a/.gdrive-server-credentials.json
\`\`\`

## Características

- **Búsqueda avanzada**: Buscar archivos por nombre, tipo, contenido
- **Google Sheets**: Acceso completo a hojas de cálculo (exportadas como CSV)
- **Google Docs**: Acceso a documentos (exportados como Markdown)
- **Múltiples formatos**: Sheets, Docs, Slides, archivos regulares
- **Lectura de datos**: Ideal para análisis de datos en Sheets

## Comandos disponibles

- \`search\`: Buscar archivos en Google Drive
- \`gdrive:///<file_id>\`: Acceder a archivo específico por ID

## Casos de uso

- **Análisis financiero**: Leer sheets de gastos, ingresos, presupuestos
- **Gestión de documentos**: Acceder a documentos de trabajo
- **Análisis de datos**: Procesar datos tabulares de Google Sheets
- **Automatización**: Integrar datos de Drive en workflows

## Prioridad

⚠️ **Este MCP tiene PRIORIDAD ALTA** sobre herramientas nativas de Google Drive para garantizar acceso completo a Google Sheets y funcionalidad avanzada.

## Seguridad

- Solo acceso de lectura (readonly)
- Credenciales OAuth2 seguras
- Acceso limitado a archivos del usuario autenticado`;
  }
}

module.exports = GoogleDriveMcp;