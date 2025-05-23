#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
require('dotenv').config();

const { Logger, PathHelper, TemplateProcessor } = require('./utils');
const { ConfigValidator, showValidationResults } = require('./validators');
const { McpManager } = require('./mcps');

const program = new Command();

program
  .name('mcp-config-generator')
  .description('🚀 Generador de configuraciones MCP compartidas')
  .version('1.0.0')
  .option('-u, --user <username>', 'Usuario específico (por defecto: usuario actual)')
  .option('-o, --output <path>', 'Ruta de salida personalizada')
  .option('--validate', 'Solo validar configuración sin generar')
  .option('--dry-run', 'Mostrar resultado sin escribir archivo')
  .option('--debug', 'Mostrar información de debug')
  .option('--list-mcps', 'Listar todos los MCPs disponibles')
  .parse();

const options = program.opts();

class McpConfigGenerator {
  constructor() {
    this.templatePath = path.join(__dirname, '..', 'templates', 'config.template.json');
    this.env = process.env;
    this.mcpManager = new McpManager(this.env);
  }
  
  /**
   * Ejecuta el generador principal
   */
  async run() {
    try {
      Logger.log('🚀 Iniciando generador de configuración MCP', 'info');
      
      if (options.debug) {
        Logger.log(`Directorio de trabajo: ${process.cwd()}`, 'debug');
        Logger.log(`Template: ${this.templatePath}`, 'debug');
      }
      
      // Listar MCPs si se solicita
      if (options.listMcps) {
        this.listMcps();
        return;
      }
      
      // Validar configuración
      if (options.validate || !options.dryRun) {
        const isValid = await this.validateConfig();
        if (!isValid && !options.validate) {
          process.exit(1);
        }
        if (options.validate) {
          return;
        }
      }
      
      // Generar configuración
      await this.generateConfig();
      
    } catch (error) {
      Logger.log(`Error: ${error.message}`, 'error');
      if (options.debug) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
  
  /**
   * Valida la configuración actual
   */
  async validateConfig() {
    Logger.log('🔍 Validando configuración...', 'info');
    
    // Mostrar estadísticas de MCPs
    const stats = this.mcpManager.getStats();
    Logger.log(`MCPs disponibles: ${stats.total} | Habilitados: ${stats.enabled} | Deshabilitados: ${stats.disabled}`, 'info');
    
    if (stats.enabled > 0) {
      console.log(`   ✅ Habilitados: ${stats.enabledMcps.join(', ')}`);
    }
    if (stats.disabled > 0) {
      console.log(`   ⏸️  Deshabilitados: ${stats.disabledMcps.join(', ')}`);
    }
    
    // Validar MCPs
    const mcpValidation = this.mcpManager.validateAll();
    const isValid = showValidationResults(mcpValidation);
    
    if (isValid) {
      Logger.log('Configuración lista para generar', 'success');
    }
    
    return isValid;
  }
  
  /**
   * Genera el archivo de configuración
   */
  async generateConfig() {
    // Generar configuración usando el sistema de MCPs
    const mcpConfigs = this.mcpManager.generateAllConfigs();
    
    const fullConfig = {
      mcpServers: mcpConfigs
    };
    
    const configJson = JSON.stringify(fullConfig, null, 2);
    
    if (options.dryRun) {
      Logger.log('Vista previa de configuración generada:', 'info');
      console.log(configJson);
      return;
    }
    
    // Escribir archivo
    await this.writeConfig(configJson);
  }
  
  /**
   * Carga el template de configuración
   */
  async loadTemplate() {
    if (!fs.existsSync(this.templatePath)) {
      Logger.log('Template no encontrado, creando template básico...', 'warning');
      await this.createBasicTemplate();
    }
    
    return fs.readFileSync(this.templatePath, 'utf8');
  }
  
  /**
   * Crea un template básico si no existe
   */
  async createBasicTemplate() {
    const basicTemplate = {
      mcpServers: {}
    };
    
    const templateDir = path.dirname(this.templatePath);
    PathHelper.ensureDirectory(templateDir);
    
    fs.writeFileSync(this.templatePath, JSON.stringify(basicTemplate, null, 2));
    Logger.log('Template básico creado', 'success');
  }
  
  /**
   * Escribe la configuración generada
   */
  async writeConfig(config) {
    const configPath = options.output || PathHelper.getClaudeConfigPath(options.user);
    const configDir = path.dirname(configPath);
    
    // Crear directorio si no existe
    PathHelper.ensureDirectory(configDir);
    
    // Escribir archivo
    fs.writeFileSync(configPath, config);
    Logger.log(`Configuración generada: ${configPath}`, 'success');
    
    // Mostrar resumen
    this.showSummary(config, configPath);
  }
  
  /**
   * Muestra resumen de la configuración generada
   */
  showSummary(config, configPath) {
    try {
      const parsed = JSON.parse(config);
      const serverCount = Object.keys(parsed.mcpServers || {}).length;
      
      Logger.log(`📊 Resumen:`, 'info');
      console.log(`   📁 Archivo: ${configPath}`);
      console.log(`   🔧 MCPs configurados: ${serverCount}`);
      
      if (serverCount > 0) {
        console.log(`   📋 Servidores:`);
        Object.keys(parsed.mcpServers).forEach(server => {
          console.log(`      - ${server}`);
        });
      }
      
    } catch (error) {
      Logger.log('Error al mostrar resumen', 'warning');
    }
  }
  
  /**
   * Lista todos los MCPs disponibles
   */
  listMcps() {
    Logger.log('📋 MCPs disponibles:', 'info');
    
    const mcpInfo = this.mcpManager.getAllMcpInfo();
    
    mcpInfo.forEach(mcp => {
      const status = mcp.enabled ? '✅ Habilitado' : '⚪ Deshabilitado';
      console.log(`\n🔧 ${mcp.displayName}`);
      console.log(`   Estado: ${status}`);
      console.log(`   Variable: ${mcp.enabledVar}`);
      
      if (mcp.enabled) {
        const mcpInstance = this.mcpManager.getMcpByName(mcp.name);
        const requiredVars = mcpInstance.getRequiredEnvVars();
        if (requiredVars.length > 0) {
          console.log(`   Variables requeridas: ${requiredVars.join(', ')}`);
        }
        
        // Mostrar instrucciones especiales si las hay
        if (mcp.instructions) {
          console.log(`   📋 Instrucciones especiales: Configurado para prioridad alta`);
        }
        if (mcp.priority > 1) {
          console.log(`   ⚡ Prioridad: ${mcp.priority} (Alta)`);
        }
      }
    });
    
    const stats = this.mcpManager.getStats();
    console.log(`\n📊 Resumen: ${stats.enabled}/${stats.total} MCPs habilitados`);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const generator = new McpConfigGenerator();
  generator.run();
}

module.exports = McpConfigGenerator;