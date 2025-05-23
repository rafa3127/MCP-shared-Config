const { Logger } = require('./utils');

/**
 * Validadores para configuraciones MCP
 */

class ConfigValidator {
  constructor(env) {
    this.env = env;
    this.errors = [];
    this.warnings = [];
  }
  
  /**
   * Ejecuta todas las validaciones
   */
  validate() {
    this.validateBasicConfig();
    this.validateMcpConfigs();
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  
  /**
   * Valida configuración básica
   */
  validateBasicConfig() {
    if (!this.env.LOG_LEVEL) {
      this.warnings.push('LOG_LEVEL no definido, usando "info" por defecto');
    }
  }
  
  /**
   * Valida configuraciones específicas de MCPs
   * Se irá expandiendo según los MCPs que se agreguen
   */
  validateMcpConfigs() {
    // Por ahora solo un placeholder
    // Se irá llenando paso a paso con cada MCP
  }
  
  /**
   * Agrega error de validación
   */
  addError(message) {
    this.errors.push(message);
  }
  
  /**
   * Agrega warning de validación
   */
  addWarning(message) {
    this.warnings.push(message);
  }
  
  /**
   * Verifica si una variable requerida existe
   */
  requireEnvVar(varName, mcpName) {
    if (!this.env[varName]) {
      this.addError(`Variable requerida faltante: ${varName} (para ${mcpName})`);
      return false;
    }
    return true;
  }
  
  /**
   * Verifica si un archivo existe
   */
  requireFile(filePath, description) {
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      this.addError(`Archivo no encontrado: ${filePath} (${description})`);
      return false;
    }
    return true;
  }
}

/**
 * Muestra resultados de validación
 */
function showValidationResults(results) {
  if (results.warnings.length > 0) {
    Logger.log('Advertencias encontradas:', 'warning');
    results.warnings.forEach(warning => {
      console.log(`  ⚠️  ${warning}`);
    });
  }
  
  if (results.errors.length > 0) {
    Logger.log('Errores encontrados:', 'error');
    results.errors.forEach(error => {
      console.log(`  ❌ ${error}`);
    });
    return false;
  }
  
  if (results.errors.length === 0 && results.warnings.length === 0) {
    Logger.log('Configuración válida ✨', 'success');
  }
  
  return true;
}

module.exports = {
  ConfigValidator,
  showValidationResults
};