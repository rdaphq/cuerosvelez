# React.js PDP - Roman Duarte
Este proyecto consiste en una prueba técnica realizada por mi, desde cero, para la prueba técnica de Cueros Velez. Se trata de una página PDP (Product Detail Page) en la que el producto específico se puede añadir y borrar del carrito, se puede ver y detallar el producto, y se muestran productos relacionados al mismo.

## Tecnologías utilizadas
- **Vite** + **React TypeScript**
- **Keen-Slider** (para el slider de imágenes)
- **Sass**

## Funciones y Componentes
El proyecto cuenta con distintas funciones y componentes para cumplir con las expectativas de la prueba técnica:

- **Página de producto:** Componente donde se muestra el producto especificado en la prueba técnica haciendo uso de la API de Cueros Velez.
`/src/components/product/Product.tsx`

- **Navbar:** Componente que se encuentra en la parte superior de la página, que hace función de barra de navegación y cuenta con el branding de Velez y la función importante del carrito.
`/src/components/navbar/Navbar.tsx`

- **Cart:** Componente donde se muestra el carrito al usuario, que contiene cada producto y su cantidad añadida, la suma de todos los productos, función de eliminar productos específicos y botón de "Checkout" (sólo visual).
`/src/components/cart/Cart.tsx`

- **CartContext:** Contexto donde se maneja el estado del carrito, el guardado en memoria local y las funciones para añadir y eliminar productos del carrito.
`/src/context/CartContext.tsx`

## Instalación
Si deseas ejecutar este proyecto en tu máquina local:

- Clona el repositorio en una directorio, establece el directorio en tu terminal y ejecuta este comando para instalar las dependencias.
```bash
npm install
```

- Ejecuta este comando para iniciar el servidor de desarrollo.
```bash
npm run dev
```

- Cuando el servidor de desarrollo está en funcionamiento, visita `http://localhost:5173` en tu navegador de preferencia para ver la página PDP.

## Licencia
Este proyecto no está bajo una licencia, pero pertenece a Cueros Velez. No debe ser copiado, distribuido o modificado sin permiso previo.

### Hecho con ❤️ por Roman