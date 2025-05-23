# MCP Shared Configuration

Repositorio para compartir configuraciones de MCP entre múltiples usuarios de forma centralizada.

## 🏗️ Arquitectura del proyecto

```
mcp-shared-config/
├── README.md              # Documentación principal
├── .env.example           # Template de variables de entorno
├── .gitignore            # Archivos a ignorar
├── package.json          # Dependencias y scripts
├── src/
│   ├── generate.js       # Script principal de generación
│   ├── validators.js     # Validaciones de configuración
│   └── utils.js          # Utilidades comunes
├── templates/
│   └── config.template.json  # Template base de configuración
└── docs/
    └── mcp-guides/       # Guías específicas por MCP
```

## 🚀 Configuración inicial

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/mcp-shared-config.git
cd mcp-shared-config
```

2. **Instala dependencias:**
```bash
npm install
```

3. **Configura variables:**
```bash
cp .env.example .env
nano .env  # Edita con tus valores
```

## 📋 Comandos disponibles

```bash
# Generar para usuario específico
npm run generate -- --user nombre_usuario

# Generar para usuario actual
npm run generate

# Validar configuración
npm run validate

# Ver configuración sin generar archivo
npm run preview

# Mostrar ayuda
npm run help
```

## 🔧 Próximos pasos

- [ ] Configurar primer MCP
- [ ] Validar generación
- [ ] Probar con múltiples usuarios
- [ ] Documentar MCPs específicos