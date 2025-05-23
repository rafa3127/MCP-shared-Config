const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

/**
 * Utilidades comunes para el generador de configuración MCP
 */

class Logger {
  static log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      debug: chalk.gray
    };
    
    const icon = {
      info: 'ℹ',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    };
    
    console.log(colors[type](`${icon[type]} ${message}`));
  }
}

class PathHelper {
  /**
   * Obtiene la ruta de configuración de Claude según el sistema operativo
   */
  static getClaudeConfigPath(username) {
    const user = username || os.userInfo().username;
    
    switch (process.platform) {
      case 'darwin': // macOS
        return path.join('/Users', user, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      
      case 'win32': // Windows
        return path.join('C:', 'Users', user, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
      
      default: // Linux
        return path.join('/home', user, '.config', 'Claude', 'claude_desktop_config.json');
    }
  }
  
  /**
   * Crea directorio si no existe
   */
  static ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      Logger.log(`Directorio creado: ${dirPath}`, 'success');
    }
  }
}

class TemplateProcessor {
  /**
   * Procesa template con variables de entorno
   */
  static process(templateContent, variables) {
    let processed = templateContent;
    
    // Reemplazar variables simples {{VARIABLE}}
    Object.keys(variables).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(placeholder, variables[key] || '');
    });
    
    // Procesar condicionales {{#if VARIABLE}}...{{/if}}
    processed = processed.replace(
      /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g,
      (match, condition, content) => {
        return this.isEnabled(variables[condition]) ? content : '';
      }
    );
    
    return this.cleanupJson(processed);
  }
  
  /**
   * Verifica si una variable está habilitada
   */
  static isEnabled(value) {
    return value === 'true' || value === true;
  }
  
  /**
   * Limpia y formatea JSON
   */
  static cleanupJson(jsonString) {
    // Remover comas finales
    let cleaned = jsonString.replace(/,(\s*[}\]])/g, '$1');
    // Remover comas duplicadas
    cleaned = cleaned.replace(/,\s*,/g, ',');
    // Remover comas antes de llaves de cierre en objetos vacíos
    cleaned = cleaned.replace(/,(\s*})/g, '$1');
    
    try {
      const parsed = JSON.parse(cleaned);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      Logger.log(`Error formateando JSON: ${error.message}`, 'error');
      return cleaned;
    }
  }
}

module.exports = {
  Logger,
  PathHelper,
  TemplateProcessor
};