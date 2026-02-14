# Banco Confía - Banca Móvil

Este proyecto es una aplicación web progresiva (PWA) construida con React que simula la experiencia de una aplicación bancaria nativa.

## Características

- **Autenticación Segura:** Ingreso mediante número de cuenta, tarjeta o DNI con validación de PIN.
- **Dashboard Interactivo:** Vista rápida de saldo, accesos directos y últimos movimientos.
- **Transferencias:** Flujo completo para enviar dinero a contactos favoritos o terceros.
- **Pagos de Servicios:** Búsqueda de empresas, selección de recibos y pago de deudas (Ej: Entel, Luz del Sur).
- **Historial de Movimientos:** Listado detallado de transacciones con filtros y vistas de detalle.
- **Seguridad:** Flujo de recuperación de PIN y bloqueo simulado tras intentos fallidos.

## Credenciales de Acceso

Para probar la aplicación, utiliza las siguientes credenciales simuladas:

- **Usuario:** Nicolás
- **Método de acceso:** Cualquiera (Cuenta, Tarjeta o DNI)
- **PIN:** `123456`

> **Nota:** Si ingresas un PIN incorrecto 3 veces, se mostrará una pantalla de bloqueo simulada. El PIN correcto siempre es `123456`.

## Datos para Pruebas

### Transferencias a Terceros
Para simular la validación exitosa de una cuenta a terceros, utiliza el siguiente número:

- **Cuenta válida:** `194-88888888-0-01`
- **Titular:** María González

Cualquier otro número simulará una cuenta no válida o no encontrada.

## Tecnologías

- React 18
- Tailwind CSS
- Lucide React (Iconos)
- TypeScript

## Instalación y Uso

1.  Clonar el repositorio.
2.  Instalar dependencias (aunque este entorno usa ESM modules directamente).
3.  Ejecutar `npm start` o abrir el archivo `index.html` en un servidor local.