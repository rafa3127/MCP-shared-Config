# FileSystem MCP

Permite a Claude acceder a archivos y directorios específicos del sistema.

## Variables de entorno requeridas

- `FILESYSTEM_ENABLED`: `true` para habilitar, `false` para deshabilitar
- `FILESYSTEM_ALLOWED_PATHS`: Lista de rutas separadas por comas que Claude puede acceder

## Ejemplo de configuración

```bash
FILESYSTEM_ENABLED=true
FILESYSTEM_ALLOWED_PATHS=~/Desktop/Projects,~/Documents/work,/tmp
```

## Características

- **Acceso controlado**: Solo permite acceso a las rutas especificadas
- **Seguridad**: No puede acceder fuera de las rutas permitidas
- **Multiplataforma**: Funciona en Windows, macOS y Linux
- **Expansión de rutas**: Soporta `~` para el directorio home

## Comandos disponibles

- Leer archivos
- Escribir archivos
- Listar directorios
- Crear directorios
- Eliminar archivos/directorios
- Buscar archivos

## Seguridad

⚠️ **Importante**: Solo agrega rutas que confíes que Claude pueda acceder. El MCP puede leer, escribir y eliminar archivos en las rutas permitidas.