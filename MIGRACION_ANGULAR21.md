# Migracion directa a Angular 21

## Resultado actual

- Base nueva creada en `clientAngular21-base` con Angular 21.
- Codigo legacy del proyecto copiado sobre esa base.
- Build validado con `npm run buildDev` en Node 20.
- No se uso `--legacy-peer-deps` en este workspace.

## Cambios tecnicos aplicados

- **Runtime/tooling**
  - Angular actualizado a `21.x`.
  - TypeScript actualizado a `5.9.x`.
  - RxJS actualizado a `7.8.x` y eliminado `rxjs-compat`.
  - Scripts de `package.json` adaptados al flujo antiguo (`buildDev`, `buildStaging`, `buildProd`, etc.).

- **Configuracion Angular**
  - `angular.json` adaptado a builder moderno (`@angular/build:application`).
  - Configuraciones de entorno restauradas (`develop`, `staging`, `production`) con `fileReplacements`.
  - Assets, scripts y estilos ajustados para el frontend existente.
  - `app.scss` reactivado en el pipeline global, incluyendo `scss/core` tras corregir rutas legacy de assets.
  - `sweetalert2` marcado en `allowedCommonJsDependencies` para eliminar warning de build no bloqueante.

- **Compatibilidad de codigo**
  - Refactor de varios usos antiguos de RxJS (`.filter/.map/.mergeMap/.catch`) a `pipe(...)` donde bloqueaba compilacion.
  - Eliminados imports obsoletos (`rxjs/add/*`, `rxjs/Rx`, `rxjs/Subscription`).
  - Ajustes de API para `ngx-cookieconsent` y `@ngx-translate/http-loader`.
  - Se removio `ngx-perfect-scrollbar` del codigo y de dependencias para evitar bloqueos de compilacion.
  - Se removio `CustomFormsModule` (`ngx-custom-validators`) por incompatibilidad directa con Angular 21 (sin uso activo restante en plantillas).
  - Servicios clave migrados a estado con Signals: `LayoutService`, `EventsService`, `LangService`.
  - Componentes principales de layout/nav y paginas land migrados a consumo de Signals (`effect`) y limpieza de listeners con unsubscribe explícito.
  - Cambio de idioma migrado a Signal compartido (`currentLanguage`) en `EventsService`.
  - Manejo de `http-error` migrado a lectura reactiva desde `lastEvent` (sin listener manual en `AppComponent`).
  - Corregido error runtime por clave vacia en `translate.instant(...)` durante inicializacion de idioma.

## Decisiones para destrabar compilacion

- Se priorizo **tener build estable en Angular 21** antes de refactor funcional profundo.
- Se reactivo `app.scss` por fases, corrigiendo primero rutas que bloqueaban compilacion.

## Estado de seguridad

- Instalacion limpia en esta base con `npm install` y auditoria sin hallazgos en el lock actual:
  - `found 0 vulnerabilities`

## Pendientes recomendados (siguiente iteracion)

1. **Estilos legacy**
   - Reducir warnings de deprecacion Sass (migrar gradualmente de `@import` a `@use`, slash division, y funciones de color deprecadas).
   - Ya se migro un primer bloque de slash-division en `scss/mixins/_chartist.scss` usando `sass:math` (los warnings repetitivos bajaron de `820` a `808`).
   - Limpiar SCSS legacy no usado y revisar regla CSS con selector `%` reportada por el builder.

## Comandos utiles

- Build dev:
  - `npm run buildDev`
- Serve:
  - `npm start`
- Build prod:
  - `npm run buildProd`

