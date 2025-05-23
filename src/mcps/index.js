const FilesystemMcp = require('./FilesystemMcp');
const GithubMcp = require('./GithubMcp');
const PlaywrightMcp = require('./PlaywrightMcp');
const GoogleDriveMcp = require('./GoogleDriveMcp');

/**
 * Registro central de todos los MCPs disponibles
 * 
 * Para agregar un nuevo MCP:
 * 1. Crear la clase configuradora en ./NombreMcp.js
 * 2. Importarla arriba
 * 3. Agregarla al array AVAILABLE_MCPS
 * 4. Para deshabilitarla temporalmente, comentar la línea
 */

const AVAILABLE_MCPS = [
  FilesystemMcp,
  GithubMcp,
  PlaywrightMcp,
  GoogleDriveMcp,
  // BraveSearchMcp,      // <- Comentar para deshabilitar temporalmente
];

/**
 * Gestor de MCPs
 */
class McpManager {
  constructor(env) {
    this.env = env;
    this.mcps = this.initializeMcps();
  }

  /**
   * Inicializa todas las instancias de MCP
   */
  initializeMcps() {
    return AVAILABLE_MCPS.map(McpClass => new McpClass(this.env));
  }

  /**
   * Obtiene todos los MCPs
   */
  getAllMcps() {
    return this.mcps;
  }

  /**
   * Obtiene solo los MCPs habilitados
   */
  getEnabledMcps() {
    return this.mcps.filter(mcp => mcp.isEnabled());
  }

  /**
   * Obtiene un MCP por nombre
   */
  getMcpByName(name) {
    return this.mcps.find(mcp => mcp.name === name.toLowerCase());
  }

  /**
   * Valida todos los MCPs habilitados
   */
  validateAll() {
    const results = {
      isValid: true,
      errors: [],
      warnings: [],
      mcpResults: {}
    };

    for (const mcp of this.getEnabledMcps()) {
      const validation = mcp.validate();
      results.mcpResults[mcp.name] = validation;

      if (!validation.isValid) {
        results.isValid = false;
        results.errors.push(...validation.errors.map(err => `[${mcp.displayName}] ${err}`));
      }

      results.warnings.push(...validation.warnings.map(warn => `[${mcp.displayName}] ${warn}`));
    }

    return results;
  }

  /**
   * Genera la configuración completa de todos los MCPs habilitados
   */
  generateAllConfigs() {
    const configs = {};

    for (const mcp of this.getEnabledMcps()) {
      const config = mcp.generateConfig();
      if (config) {
        configs[mcp.name] = config;
      }
    }

    return configs;
  }

  /**
   * Obtiene información de todos los MCPs
   */
  getAllMcpInfo() {
    return this.mcps.map(mcp => mcp.getInfo());
  }

  /**
   * Obtiene estadísticas de MCPs
   */
  getStats() {
    const total = this.mcps.length;
    const enabled = this.getEnabledMcps().length;
    const disabled = total - enabled;

    return {
      total,
      enabled,
      disabled,
      enabledMcps: this.getEnabledMcps().map(mcp => mcp.displayName),
      disabledMcps: this.mcps.filter(mcp => !mcp.isEnabled()).map(mcp => mcp.displayName)
    };
  }
}

module.exports = {
  McpManager,
  AVAILABLE_MCPS
};