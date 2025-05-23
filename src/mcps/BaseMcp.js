/**
 * Clase base abstracta para configuradores de MCP
 */
class BaseMcp {
  constructor(env) {
    this.env = env;
    this.name = this.constructor.name.replace('Mcp', '').toLowerCase();
    this.displayName = this.getDisplayName();
  }

  /**
   * Verifica si este MCP está habilitado
   */
  isEnabled() {
    const enabledVar = this.getEnabledVar();
    return this.env[enabledVar] === 'true';
  }

  /**
   * Obtiene el nombre de la variable de habilitación
   */
  getEnabledVar() {
    return `${this.name.toUpperCase()}_ENABLED`;
  }

  /**
   * Obtiene el nombre para mostrar del MCP
   */
  getDisplayName() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  /**
   * Valida la configuración del MCP
   * @returns {Object} { isValid: boolean, errors: string[], warnings: string[] }
   */
  validate() {
    const errors = [];
    const warnings = [];

    if (!this.isEnabled()) {
      return { isValid: true, errors, warnings };
    }

    // Validaciones específicas del MCP (implementadas por clases hijas)
    const specificValidation = this.validateSpecific();
    errors.push(...specificValidation.errors);
    warnings.push(...specificValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Genera la configuración JSON para este MCP
   * @returns {Object|null} Configuración del servidor o null si no está habilitado
   */
  generateConfig() {
    if (!this.isEnabled()) {
      return null;
    }

    return this.buildConfig();
  }

  /**
   * Obtiene información del MCP para logging
   */
  getInfo() {
    return {
      name: this.name,
      displayName: this.displayName,
      enabled: this.isEnabled(),
      enabledVar: this.getEnabledVar(),
      priority: this.getPriority(),
      instructions: this.getClaudeInstructions()
    };
  }

  /**
   * Prioridad del MCP (mayor número = mayor prioridad)
   * Usado para resolver conflictos entre herramientas nativas y MCPs
   */
  getPriority() {
    return 1; // Por defecto, prioridad normal
  }

  /**
   * Instrucciones específicas para Claude sobre cómo usar este MCP
   */
  getClaudeInstructions() {
    return null; // Por defecto, sin instrucciones especiales
  }

  // Métodos abstractos que deben implementar las clases hijas
  
  /**
   * Validaciones específicas del MCP
   * @returns {Object} { errors: string[], warnings: string[] }
   */
  validateSpecific() {
    throw new Error(`validateSpecific() debe ser implementado por ${this.constructor.name}`);
  }

  /**
   * Construye la configuración específica del MCP
   * @returns {Object} Configuración del servidor
   */
  buildConfig() {
    throw new Error(`buildConfig() debe ser implementado por ${this.constructor.name}`);
  }

  /**
   * Obtiene la lista de variables de entorno requeridas
   * @returns {string[]} Array de nombres de variables
   */
  getRequiredEnvVars() {
    throw new Error(`getRequiredEnvVars() debe ser implementado por ${this.constructor.name}`);
  }

  /**
   * Obtiene la documentación del MCP
   * @returns {string} Documentación en markdown
   */
  getDocumentation() {
    return `# ${this.displayName} MCP\n\nDocumentación pendiente.`;
  }

  // Métodos auxiliares
  
  /**
   * Verifica si una variable de entorno requerida existe
   */
  requireEnvVar(varName) {
    if (!this.env[varName]) {
      return `Variable requerida faltante: ${varName}`;
    }
    return null;
  }

  /**
   * Verifica si un archivo existe
   */
  requireFile(filePath) {
    const fs = require('fs');
    const path = require('path');
    
    // Expandir ~ a directorio home
    const expandedPath = filePath.startsWith('~') 
      ? path.join(require('os').homedir(), filePath.slice(1))
      : filePath;
    
    if (!fs.existsSync(expandedPath)) {
      return `Archivo no encontrado: ${filePath}`;
    }
    return null;
  }

  /**
   * Verifica si un directorio existe
   */
  requireDirectory(dirPath) {
    const fs = require('fs');
    const path = require('path');
    
    // Expandir ~ a directorio home
    const expandedPath = dirPath.startsWith('~') 
      ? path.join(require('os').homedir(), dirPath.slice(1))
      : dirPath;
    
    if (!fs.existsSync(expandedPath)) {
      return `Directorio no encontrado: ${dirPath}`;
    }
    
    const stats = fs.statSync(expandedPath);
    if (!stats.isDirectory()) {
      return `La ruta no es un directorio: ${dirPath}`;
    }
    
    return null;
  }
}

module.exports = BaseMcp;