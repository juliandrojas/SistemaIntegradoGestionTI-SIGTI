# Trabajo colaborativo con Git

Este proyecto usa `development` como rama de integración y `master` como rama estable. No se desarrollan cambios directamente en ninguna de esas ramas.

## Configuración inicial

Cada integrante debe clonar el repositorio, instalar las dependencias y activar estas opciones locales:

```powershell
git clone https://github.com/juliandrojas/SistemaIntegradoGestionTI-SIGTI.git
cd SistemaIntegradoGestionTI-SIGTI
npm install
cd server; npm install; cd ..
cd client; npm install; cd ..
git config pull.rebase true
git config fetch.prune true
```

`package-lock.json` se comparte en Git. Las carpetas `node_modules` se generan localmente y nunca se deben confirmar.

## Flujo para cada tarea

1. Actualiza tu rama local antes de empezar:

   ```powershell
   git switch development
   git pull --rebase origin development
   ```

2. Crea una rama para una sola tarea:

   ```powershell
   git switch -c feature/nombre-corto
   ```

   Usa `fix/` para correcciones y `docs/` para documentación. Ejemplos: `feature/registro-usuarios`, `fix/validacion-login`.

3. Trabaja, prueba y revisa tus cambios:

   ```powershell
   git status
   git diff
   ```

   Ejecuta las comprobaciones aplicables al componente que modificaste antes de abrir el Pull Request.

4. Confirma cambios pequeños y claros usando Conventional Commits:

   ```powershell
   git add ruta/del/archivo
   git commit -m "feat: agrega registro de usuarios"
   ```

   Prefijos sugeridos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

5. Antes de publicar, incorpora lo nuevo de `development`:

   ```powershell
   git fetch origin
   git rebase origin/development
   ```

   Si aparecen conflictos, resuélvelos, ejecuta las pruebas y continúa con `git rebase --continue`.

6. Publica la rama y crea un Pull Request hacia `development`:

   ```powershell
   git push -u origin feature/nombre-corto
   ```

   El otro integrante revisa el Pull Request; se integra solo cuando esté aprobado y las verificaciones pasen.

## Acuerdos para evitar conflictos

- Avisen antes de modificar el mismo módulo, archivo de configuración o `package-lock.json`.
- No hagan `push --force` sobre `development` ni `master`.
- Cada Pull Request debe describir qué cambia, cómo se probó y cualquier tarea pendiente.
- Quien integre un Pull Request elimina la rama remota después de fusionarla.
- Si un cambio es urgente, igualmente creen una rama `fix/…` y un Pull Request breve.

## Publicación a `master`

Cuando una versión de `development` esté probada, creen un Pull Request de `development` hacia `master`. Así `master` siempre queda como una versión estable y recuperable.

## Limpieza pendiente del repositorio

Hay dependencias ya rastreadas por Git. El archivo `.gitignore` evita que se agreguen nuevas, pero no deja de rastrear las existentes. Una sola persona debe ejecutar una vez lo siguiente en una rama dedicada y abrir un Pull Request:

```powershell
git rm -r --cached node_modules server/node_modules
git add .gitignore
git commit -m "chore: deja de versionar dependencias instaladas"
git push -u origin chore/remove-node-modules
```

Después de fusionarlo, todos deben ejecutar `git pull` y `npm install` en la raíz, `server` y `client` según corresponda.
