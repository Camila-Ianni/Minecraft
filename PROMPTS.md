# Bitácora de Asistencia de Inteligencia Artificial (PROMPTS.md)

**Materia:** Plataformas de Desarrollo  
**Evaluación:** Examen Parcial Práctico  
**Tema:** Consumo de APIs REST, Manipulación de JSON y Renderizado Dinámico en el DOM  
**Estudiante:** Alumno  
**Año Lectivo:** 2026  

---

## 1. Modelo o Agente de IA Utilizado
- **Modelo:** Google Gemini (vía Antigravity AI Coding Assistant).
- **Rol:** Soporte en la concepción arquitectónica, estructuración modular en JavaScript Vanilla, diseño de algoritmos de filtrado en memoria y resolución de problemas de asincronismo y manipulación del DOM.

---

## 2. Listado de Prompts Más Relevantes y Consultas de Depuración

### Prompt 1: Arquitectura de Asincronismo y Consumo de API
> *"¿Cómo estructurar un cliente asíncrono en JavaScript Vanilla con `async/await` y `fetch()` para consumir los endpoints de Mobs, Ítems y Biomas de la API de Astroworld (`https://api.astroworldmc.com/api/v1/`), garantizando el manejo seguro de errores HTTP y excepciones de red mediante `try/catch`?"*
* **Propósito:** Diseñar un módulo `api.js` reutilizable, desacoplado de la interfaz gráfica y que no dependa de librerías externas (como Axios).

### Prompt 2: Lógica de Filtrado y Búsqueda Reactiva en Memoria
> *"Necesito implementar un sistema de filtrado multidimensional en tiempo real sobre un arreglo de objetos JSON en memoria. El usuario debe poder buscar por texto mediante el evento `input` y filtrar simultáneamente por categorías/tipos con un `<select>`, actualizando el DOM de forma fluida sin recargar la página."*
* **Propósito:** Cumplir con la consigna de filtrado interactivo en el DOM, optimizando el rendimiento mediante filtrado en memoria con métodos nativos (`Array.prototype.filter`, `includes`).

### Prompt 3: Renderizado Dinámico y Manejo de Estados de UI
> *"¿Cómo estructurar la manipulación del DOM para gestionar los tres estados mandatorios de la interfaz (Cargando con spinner temático, Sin Resultados con mensaje claro, y Error de Red con botón interactivo de reintento) usando funciones puras en `dom.js`?"*
* **Propósito:** Asegurar una experiencia de usuario clara, manejando adecuadamente el ciclo de vida de las peticiones asíncronas y el feedback visual.

### Prompt 4: Maquetación Semántica y Pantalla de Inicio Temática (Main Menu)
> *"Diseñar una pantalla de inicio clásica de Minecraft en HTML5 y CSS3 nativo (Grid/Flexbox) con el logotipo, texto splash oscilante, botones biselados de piedra y transición suave al explorador de la API al hacer clic en 'Singleplayer'."*
* **Propósito:** Lograr una presentación visual de alto impacto estético, respetando la estructura semántica HTML5 y la adaptabilidad responsiva sin frameworks de CSS.

---

## 3. Justificación de Sugerencias Aceptadas y Descartadas

### ✅ Sugerencias Aceptadas
1. **Separación Modular del Código (`api.js`, `dom.js`, `menu.js`, `app.js`):**  
   *Justificación:* Permite mantener una alta cohesión y bajo acoplamiento, facilitando el mantenimiento, la depuración y la legibilidad del código Vanilla JS.
2. **Generación Dinámica de Filtros según la Entidad:**  
   *Justificación:* Al cambiar entre Mobs, Ítems o Biomas, los selectores de filtro se actualizan dinámicamente con las categorías reales provenientes de los datos, evitando opciones vacías.
3. **Efecto de Audio Sintetizado con Web Audio API:**  
   *Justificación:* Se implementó el sonido clásico de clic de botón de Minecraft mediante síntesis por código, evitando dependencias de archivos de audio externos que pudieran fallar por rutas relativas o bloqueos del navegador.
4. **Manejo Integral de Excepciones y Reintentos:**  
   *Justificación:* Se capturan tanto errores de red (fallo de conexión) como respuestas HTTP no exitosas (`!response.ok`), proporcionando un botón para reintentar la petición sin tener que refrescar toda la web.

### ❌ Sugerencias Descartadas
1. **Uso de Axios o librerías de componentes UI (Bootstrap / Tailwind):**  
   *Justificación:* **Descartado tajantemente** para respetar la consigna del examen que prohíbe el uso de librerías externas o frameworks de JavaScript/CSS, optando por `fetch()` nativo y CSS3 puro.
2. **Almacenamiento en caché estática en archivos `.json` locales:**  
   *Justificación:* **Descartado** porque la consigna exige de manera explícita que las peticiones sean HTTP/HTTPS remotas en vivo a una API REST externa.
3. **Paginación del lado del servidor con múltiples peticiones:**  
   *Justificación:* **Descartado** en favor de la carga inicial del set de datos y filtrado en memoria en el cliente, logrando una búsqueda instantánea en tiempo real sin latencia de red para cada pulsación de tecla.
