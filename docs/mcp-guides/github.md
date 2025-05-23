# GitHub MCP

Permite a Claude interactuar con repositorios de GitHub usando la API de GitHub.

## Variables de entorno requeridas

- `GITHUB_ENABLED`: `true` para habilitar, `false` para deshabilitar
- `GITHUB_TOKEN`: Personal Access Token de GitHub

## Configuración del token

1. Ve a GitHub Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con los permisos necesarios:
   - `repo` - Acceso completo a repositorios privados
   - `public_repo` - Acceso a repositorios públicos
   - `user` - Acceso a información del perfil
   - `gist` - Crear y modificar gists

## Ejemplo de configuración

```bash
GITHUB_ENABLED=true
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

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
- Revisa regularmente los permisos otorgados