const BaseMcp = require('./BaseMcp');

/**
 * Configurador para el MCP de Playwright
 */
class PlaywrightMcp extends BaseMcp {
  constructor(env) {
    super(env);
  }

  /**
   * Validaciones específicas del Playwright MCP
   */
  validateSpecific() {
    const errors = [];
    const warnings = [];

    // Playwright es bastante independiente, pero podemos validar algunas opciones
    const headlessMode = this.env.PLAYWRIGHT_HEADLESS || 'true';
    
    if (headlessMode !== 'true' && headlessMode !== 'false') {
      warnings.push('PLAYWRIGHT_HEADLESS debe ser "true" o "false". Usando "true" por defecto.');
    }

    // Verificar si hay configuraciones adicionales
    if (this.env.PLAYWRIGHT_TIMEOUT && isNaN(parseInt(this.env.PLAYWRIGHT_TIMEOUT))) {
      warnings.push('PLAYWRIGHT_TIMEOUT debe ser un número en milisegundos.');
    }

    return { errors, warnings };
  }

  /**
   * Construye la configuración del Playwright MCP
   */
  buildConfig() {
    const args = ["@playwright/mcp@latest"];
    
    // Agregar opciones según configuración
    const headless = this.env.PLAYWRIGHT_HEADLESS !== 'false'; // Por defecto true
    if (headless) {
      args.push('--headless');
    }

    // Agregar timeout si está configurado
    if (this.env.PLAYWRIGHT_TIMEOUT) {
      args.push('--timeout', this.env.PLAYWRIGHT_TIMEOUT);
    }

    // Agregar viewport si está configurado
    if (this.env.PLAYWRIGHT_VIEWPORT) {
      args.push('--viewport', this.env.PLAYWRIGHT_VIEWPORT);
    }

    return {
      command: "npx",
      args: args
    };
  }

  /**
   * Variables de entorno requeridas (ninguna es estrictamente requerida)
   */
  getRequiredEnvVars() {
    return []; // Playwright funciona sin variables adicionales
  }

  /**
   * Variables de entorno opcionales
   */
  getOptionalEnvVars() {
    return [
      'PLAYWRIGHT_HEADLESS',
      'PLAYWRIGHT_TIMEOUT', 
      'PLAYWRIGHT_VIEWPORT'
    ];
  }

  /**
   * Documentación del Playwright MCP
   */
  getDocumentation() {
    return `# Playwright MCP

Permite a Claude automatizar navegadores web usando Playwright para scraping, testing y automatización.

## Variables de entorno

### Requeridas
- \`PLAYWRIGHT_ENABLED\`: \`true\` para habilitar, \`false\` para deshabilitar

### Opcionales
- \`PLAYWRIGHT_HEADLESS\`: \`true\` (por defecto) para modo headless, \`false\` para mostrar navegador
- \`PLAYWRIGHT_TIMEOUT\`: Timeout en milisegundos para operaciones (por defecto: 30000)
- \`PLAYWRIGHT_VIEWPORT\`: Tamaño de viewport como "1280x720" (opcional)

## Ejemplo de configuración

\`\`\`bash
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_VIEWPORT=1280x720
\`\`\`

## Características

- **Automatización web**: Navegar, hacer click, llenar formularios
- **Scraping**: Extraer datos de páginas web
- **Screenshots**: Tomar capturas de pantalla
- **Multi-navegador**: Soporta Chrome, Firefox, Safari
- **Modo headless**: Ejecución sin interfaz gráfica
- **Responsive testing**: Simular diferentes dispositivos

## Comandos disponibles

- Navegar a URLs
- Hacer click en elementos
- Llenar formularios
- Extraer texto e información
- Tomar screenshots
- Simular interacciones de usuario
- Esperar por elementos
- Ejecutar JavaScript en la página

## Casos de uso

- **Web scraping**: Extraer datos de sitios web
- **Automatización de formularios**: Llenar y enviar formularios
- **Testing**: Pruebas automatizadas de interfaces
- **Monitoreo**: Verificar cambios en páginas web
- **Generación de PDFs**: Convertir páginas a PDF
- **Screenshots**: Documentación visual de páginas

## Consideraciones

⚠️ **Importante**:
- Respeta los términos de servicio de los sitios web
- Considera los rate limits y no hagas scraping agresivo  
- Algunos sitios web pueden bloquear automatización
- El modo headless es más eficiente para producción`;
  }
}

module.exports = PlaywrightMcp;