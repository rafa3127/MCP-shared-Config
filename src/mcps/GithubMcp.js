const BaseMcp = require('./BaseMcp');

/**
 * Configurador para el MCP de GitHub
 */
class GithubMcp extends BaseMcp {
  constructor(env) {
    super(env);
  }

  /**
   * Validaciones específicas del GitHub MCP
   */
  validateSpecific() {
    const errors = [];
    const warnings = [];

    // Verificar que el token de GitHub esté definido
    const tokenVar = this.requireEnvVar('GITHUB_TOKEN');
    if (tokenVar) {
      errors.push(tokenVar);
      return { errors, warnings };
    }

    // Validar formato básico del token (debe empezar con ghp_, gho_, ghu_, ghs_, o ghr_)
    const token = this.env.GITHUB_TOKEN;
    const validPrefixes = ['ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_', 'github_pat_'];
    const hasValidPrefix = validPrefixes.some(prefix => token.startsWith(prefix));
    
    if (!hasValidPrefix) {
      warnings.push('El token de GitHub no tiene un prefijo reconocido. Asegúrate de usar un Personal Access Token válido.');
    }

    // Verificar longitud mínima del token
    if (token.length < 20) {
      errors.push('El token de GitHub parece ser demasiado corto. Verifica que sea un Personal Access Token válido.');
    }

    return { errors, warnings };
  }

  /**
   * Construye la configuración del GitHub MCP
   */
  buildConfig() {
    return {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: this.env.GITHUB_TOKEN
      }
    };
  }

  /**
   * Variables de entorno requeridas
   */
  getRequiredEnvVars() {
    return ['GITHUB_TOKEN'];
  }

  /**
   * Documentación del GitHub MCP
   */
  getDocumentation() {
    return `# GitHub MCP

Permite a Claude interactuar con repositorios de GitHub usando la API de GitHub.

## Variables de entorno requeridas

- \`GITHUB_ENABLED\`: \`true\` para habilitar, \`false\` para deshabilitar
- \`GITHUB_TOKEN\`: Personal Access Token de GitHub

## Configuración del token

1. Ve a GitHub Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con los permisos necesarios:
   - \`repo\` - Acceso completo a repositorios privados
   - \`public_repo\` - Acceso a repositorios públicos
   - \`user\` - Acceso a información del perfil
   - \`gist\` - Crear y modificar gists

## Ejemplo de configuración

\`\`\`bash
GITHUB_ENABLED=true
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

## Características

- **Gestión de repositorios**: Crear, clonar, explorar repositorios
- **Issues y Pull Requests**: Crear, listar, comentar issues y PRs
- **Archivos**: Leer, escribir, crear archivos en repositorios
- **Búsqueda**: Buscar repositorios, usuarios, código
- **Releases**: Gestionar releases y tags
- **Gists**: Crear y gestionar gists

## Comandos disponibles

- Buscar repositorios
- Crear y gestionar issues
- Crear pull requests
- Leer y escribir archivos
- Explorar estructura de repositorios
- Gestionar colaboradores
- Crear releases

## Seguridad

⚠️ **Importante**: 
- Usa un token con los permisos mínimos necesarios
- No compartas tu token de GitHub
- Considera usar tokens con fecha de expiración
- Revisa regularmente los permisos otorgados`;
  }
}

module.exports = GithubMcp;