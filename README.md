# Desarrollo local

Aplicación de una página con JavaScript/JSX, Next.js App Router y Tailwind CSS 3. Se utiliza npm y se conserva la fuente Nunito mediante Google Fonts.

## Requisitos

- NVM y Node.js 24.22.0 (ver `.nvmrc`).
- npm 11.19.1.
- Acceso al registro oficial de npm para instalar dependencias.

```bash
nvm use
npm ci --ignore-scripts
```

La instalación no necesita scripts de ciclo de vida: Next.js/SWC, sharp y el resolvedor de ESLint utilizan sus paquetes binarios publicados para la plataforma. Si se cambia la plataforma o las versiones, revisar los scripts y las dependencias opcionales antes de habilitarlos. No utilizar `--omit=optional` para esta instalación.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Desarrollo y compilación usan `--webpack`, el compilador original del proyecto, admitido por Next.js 16. Turbopack no se activa: en este entorno falló al abrir su puerto interno de procesamiento PostCSS.

El servidor abre en `http://localhost:3000`. `start` requiere una compilación previa. ESLint utiliza Flat Config y se ejecuta por separado del build de Next.js 16.

Con `npm run start` activo, desde otra terminal:

```bash
npm run check:production
npm audit
npm audit --omit=dev
```

La comprobación de producción verifica el HTML inicial, el orden de las secciones, metadatos y recursos locales. No sustituye las pruebas del navegador de temas, teclado, modal y tamaños de pantalla.

## Organización

- `app/`: página, layout y CSS global.
- `components/`: presentación, temas e interacción.
- `data/`: contenido editable de la página.
- `public/`: imágenes y currículum.

Los trece iconos SVG usados en habilidades, proyectos y experiencia se exportaron de Simple Icons incluido en `react-icons` 5.0.1, sin añadir dependencias. Fuente: [React Icons](https://github.com/react-icons/react-icons) y [Simple Icons](https://github.com/simple-icons/simple-icons), licencia [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Son recursos locales sin scripts ni referencias externas; las marcas pertenecen a sus respectivos titulares. HTML y CSS utilizan los símbolos HTML5 y CSS3 de esa colección.

No se requieren variables de entorno para las funcionalidades actuales. Los archivos `.env*` se excluyen de Git, salvo `.env.example`. No incluir credenciales en `data/`, recursos públicos ni variables `NEXT_PUBLIC_*`.

## Reproducibilidad y seguridad

Versiones directas fijadas y `package-lock.json` versionado. Usar `npm ci` para reproducirlo y revisar los avisos según sus condiciones; no ejecutar actualizaciones o correcciones forzadas sin validar el resultado.

Para conservar esta política de instalación sin scripts también se puede usar `npm ci --ignore-scripts` en integración continua. El proyecto no contiene automatismos de despliegue.

La configuración remota de Vercel se administra por separado. Antes de un futuro despliegue, revisar Node.js 24.x, rama de producción, comandos de instalación/build y continuidad del dominio. Ningún comando de este documento despliega el sitio.

## Diagnóstico de mantenimiento (16 de octubre de 2026)

- Objetivo instalado: Next.js 16.4.2, React/React DOM 19.3.1, next-themes 0.4.6 y Tailwind CSS 3.4.19.
- Next.js 16.4.2 incluye PostCSS 8.5.23; el procesamiento CSS directo usa PostCSS 8.5.30. SWC queda alineado con Next y sharp 0.35.5 incluye la corrección publicada el 14 de octubre.
- `npm audit --omit=dev`: sin avisos en la comprobación realizada. Esto no garantiza ausencia de vulnerabilidades desconocidas.
- `npm audit`: persisten 9 entradas de desarrollo (7 altas y 2 moderadas), derivadas de dos causas: `braces` 3.0.3, sin parche publicado para el agotamiento de pila, y `postcss-selector-parser` 6.1.4, cuyo parche está en 7.1.6. Se propagan a Tailwind, búsqueda de archivos y configuración de lint. No hay entrada de visitantes hacia esos parsers en esta aplicación. Procesar únicamente código, CSS y patrones de archivos confiables. Se conserva Tailwind 3 por requisito; no se fuerzan parsers de otra versión mayor ni se ocultan avisos con overrides.
- ESLint 10.13.0 tiene soporte activo y Next 16.4.2 documenta compatibilidad. Los plugins transitivos `eslint-plugin-import`, `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún declaran peer dependencies hasta ESLint 9. Se aplica un override de resolución exclusivamente a sus referencias a ESLint dentro de `eslint-config-next`, usando `$eslint` (la versión directa fijada). Justificación: Next 16.4.2 documenta soporte de ESLint 10 y el lint del proyecto se comprobó con esa combinación; ESLint 9 está fuera de soporte. No cambia el código ni la versión de los plugins y no modifica avisos de seguridad. Evita dejar un árbol que npm marque como inválido; no se usan `--force` ni `--legacy-peer-deps`. Retirar esta excepción cuando los plugins amplíen sus rangos oficiales.
- `glob` 10.5.0 corrige el aviso de su CLI, pero su rama está marcada como obsoleta por el mantenedor. Llega a través de Sucrase/Tailwind 3; no se invoca `glob --cmd` en los scripts del proyecto.

Fuentes: [seguridad de Next.js](https://nextjs.org/blog/nextjs-security-update-october-14-2026), [ESLint con Next.js](https://nextjs.org/docs/app/api-reference/config/eslint), [soporte de ESLint](https://eslint.org/version-support/), [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [selector parser](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

`.npmrc` desactiva scripts automáticos de instalación y mantiene la caché en `.cache/npm`. Los scripts explícitos del proyecto (`npm run lint`, `npm run build`, etc.) siguen disponibles. La auditoría completa debe repetirse periódicamente: sus resultados cambian con nuevos avisos.
