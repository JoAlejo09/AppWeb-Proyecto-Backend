# CHANGELOG - Documentación Actualizaciones

Todos los cambios desarrollados en el Componente Backend serán documentados en este documento

## [0.2.1] - 2025-08-05
### Actualización
- Funcionalidad Citas
  - Ajuste de rutas API
  - Modificación de almacenamiento de información de Stripe
## [0.2.0] - 2025-08-05
### Agregado
- Implementación de API Stripe para pagos en línea.
- Funcionalidad Citas
    - Diseño de modelo Citas
    - Diseño controlador para Citas
    - Creación de rutas añadidas a Paciente
    - Seguridad JWT
### Eliminación
- Componente AuthSocial que no estaba implementado en Passport
## [0.1.0] - 2025-08-05
### Agregado
- Lanzamiento del Componente Backend
- Implementación de modelos (Usuario, Recursos)
  - Usuario: Modelo Compartido que registra a Administrador y Paciente
  - Recurso: Modelo que registra la información y recursos que contiene la página (documentos, videos, encuestas, etc.).
- Implementación de controladores acorde a Roles de Usuario (administrador y paciente)
  - Usuario_controller: Para funcionalidades compartidas entre Administrador y Paciente
    - Registrar : Endpoint para registrar nuevo Usuario.
    - Recuperar Password: Endpoint para recuperar password.
    - Login: Endpoint para que el usuario inicie sesión.
    - ComprobarTokenPassword: Endpoint para autorizar a usuario cambio de password.
    - Cambiar Password: Endpoint para cambiar la contraseña del usuario autorizado.
  - Administrador_controller : Para Rol Administrador
  - Paciente_controller : Para Rol Paciente
-  Implementaciónn de rutas para acceso a API correspondiente
-  Implementación de mecanismo de autenticación JWT
