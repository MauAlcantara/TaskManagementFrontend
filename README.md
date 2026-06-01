"¿Por qué elegiste esta forma de manejar el formulario?"
Se implementaron Formularios Reactivos (`ReactiveFormsModule`) en lugar de Formularios Basados en Plantillas (Template-driven). Esta decisión permite mantener el control del estado y las reglas de validación (como `Validators.required`) directamente en la lógica del componente (TypeScript). Esto resulta en un HTML mucho más limpio, facilita la escalabilidad y prepara el terreno para la futura implementación de pruebas unitarias.

"¿Qué pasa si el usuario hace clic en 'Guardar' dos veces seguido?"
Se previene el envío múltiple mediante una bandera de estado llamada `isSubmitting`. Al realizar el primer clic con un formulario válido, esta variable cambia a `true`, lo que desactiva dinámicamente el botón en el DOM (`[disabled]="taskForm.invalid || isSubmitting"`) y cambia su etiqueta a "Guardando...". Esto bloquea peticiones POST accidentales o duplicadas hacia el servidor.

"¿Cómo sabe tu app que la tarea se creó correctamente?"
La comunicación con el backend se maneja mediante programación asíncrona con RxJS. El método `subscribe()` escucha la respuesta del servidor. Únicamente cuando el backend procesa exitosamente el POST y devuelve un código HTTP favorable junto con el nuevo objeto de la tarea, se ejecuta el bloque `next:`. En ese momento exacto, la nueva tarea se inserta al inicio del arreglo visual (`unshift()`) y se dispara una notificación de éxito, garantizando que el frontend y la base de datos estén sincronizados.


"Si el backend falla, ¿qué ve el usuario?"
En caso de un error en el servidor, el flujo asíncrono entra al bloque `error:`. La interfaz no se congela ni se rompe; en su lugar, se invoca el componente `MatSnackBar` de Angular Material para mostrar una notificación flotante y amigable al usuario indicando: *"Error al crear la tarea. Intenta de nuevo"*. Esto asegura una buena experiencia de usuario previniendo la incertidumbre.

"¿Por qué reseteaste (o no reseteaste) el formulario después de guardar?"
En esta implementación, no fue necesario llamar explícitamente a `this.taskForm.reset()`. Al utilizar `MatDialog`, el ciclo de vida del componente `TaskDialogComponent` se destruye por completo al cerrarse el modal. La próxima vez que se requiera agregar una tarea, Angular instanciará el componente desde cero, garantizando que el formulario y sus estados de validación nazcan completamente limpios por defecto, optimizando la memoria y evitando estados residuales.
