# 📋 Documento de Requerimientos de Software (REQUIREMENTS.md)

**Proyecto:** Sistema de Help Desk (Mesa de Ayuda) - Departamento de Sistemas  
**Entorno de Despliegue:** Servidor Local (On-Premise / Red LAN)  
**Concurrencia Estimada:** 5 Usuarios Agentes Simultáneos  
**Versión:** 1.0.0  
**Fecha:** Agosto 2026  

---

## 1. Visión General del Producto
El sistema es una solución interna de Mesa de Ayuda diseñada para gestionar, priorizar y dar seguimiento a las solicitudes de soporte técnico dirigidas al Departamento de Sistemas. Su arquitectura está optimizada para ser desplegada en un servidor local, garantizando alta velocidad de respuesta en LAN, actualización en tiempo real y cero costos operativos de infraestructura en la nube.

---

## 2. Alcance del Sistema (Scope)

### Dentro del Alcance (In Scope)
* Gestión completa del ciclo de vida de tickets (Creación, Asignación, Transición de Estados, Resolución, Cierre).
* Tablero interactivo (Dashboard) en tiempo real para agentes del departamento.
* Hilo de comentarios y notas internas privadas entre técnicos.
* Sistema de carga de archivos adjuntos local (imágenes de error, logs, capturas).
* Historial de auditoría de cambios por cada ticket.
* Autenticación de usuarios y control de acceso basado en roles (RBAC).

### Fuera del Alcance (Out of Scope)
* Integración con proveedores de correo en la nube o envío masivo externo.
* Almacenamiento en buckets de la nube (AWS S3, GCP Storage).
* Multi-tenancy o soporte para múltiples organizaciones independientes.

---

## 3. Requerimientos Funcionales (RF)

### 3.1. Gestión de Usuarios y Autenticación
* **RF-01 (Autenticación):** El sistema debe permitir el inicio de sesión seguro mediante credenciales (correo y contraseña / JWT).
* **RF-02 (Roles de Usuario):** El sistema debe manejar al menos tres roles con permisos diferenciados:
  * `USER` (Usuario final/Solicitante): Crea tickets y consulta únicamente sus solicitudes.
  * `AGENT` (Técnico de Sistemas): Visualiza, se asigna, responde y gestiona estados de tickets.
  * `ADMIN` (Administrador): Gestiona usuarios, categorías y configuraciones del sistema.

### 3.2. Gestión de Tickets
* **RF-03 (Creación de Ticket):** Cualquier usuario autenticado debe poder crear un ticket indicando: Título, Descripción detallada, Categoría y Prioridad (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
* **RF-04 (Máquina de Estados de Ticket):** El ticket debe seguir un flujo estricto de estados sin saltos no permitidos:
  $$\text{OPEN} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{WAITING\_USER} \longrightarrow \text{RESOLVED} \longrightarrow \text{CLOSED}$$
* **RF-05 (Asignación de Agente):** Un agente debe poder asignarse un ticket o reasignarlo a otro técnico del departamento.
* **RF-06 (Filtros y Búsqueda):** El panel de agentes debe permitir filtrar tickets por estado, prioridad, agente asignado y búsqueda por texto en título/código.

### 3.3. Interacción y Tiempo Real
* **RF-07 (Comentarios y Respuestas):** Los usuarios y agentes deben poder comentar dentro del hilo del ticket.
* **RF-08 (Notas Internas):** Los agentes deben poder redactar notas privadas dentro del ticket, visibles **únicamente** para el personal del departamento de sistemas.
* **RF-09 (Notificaciones en Tiempo Real):** El sistema debe actualizar el panel del agente mediante WebSockets cuando se cree un nuevo ticket o cambie el estado/comentario de un ticket activo sin recargar la página.
* **RF-10 (Archivos Adjuntos):** Se debe permitir adjuntar archivos (imágenes PNG/JPG, PDFs, archivos de texto/logs) con un límite máximo configurado por archivo.

### 3.4. Auditoría y Métricas
* **RF-11 (Registro de Auditoría):** Cada cambio de estado, asignación o modificación crítica debe registrarse automáticamente en una tabla de auditoría indicando: Fecha, Usuario que realizó la acción, Valor anterior y Valor nuevo.

---

## 4. Requerimientos No Funcionales (RNF)

### 4.1. Rendimiento y Concurrencia
* **RNF-01 (Tiempo de Respuesta):** Las peticiones HTTP en la red local (LAN) deben responder en menos de 100 ms.
* **RNF-02 (Capacidad):** Soportar el trabajo simultáneo fluido de al menos 5 agentes procesando tickets al mismo tiempo sin degradación de memoria.

### 4.2. Arquitectura y Robustez
* **RNF-03 (End-to-End Type Safety):** El 100% del código de la API y el Frontend debe estar fuertemente tipado mediante TypeScript (`strict: true`) y esquemas de validación Zod en tiempo de ejecución.
* **RNF-04 (Persistencia Relacional):** Garantía de transacciones ACID en la base de datos PostgreSQL mediante Prisma ORM para evitar inconsistencias en asignaciones simultáneas.

### 4.3. Despliegue y Mantenibilidad
* **RNF-05 (Despliegue Local):** El sistema completo (Backend, Frontend y Base de Datos) debe ser capaz de ejecutarse en un entorno local mediante `docker-compose up -d`.
* **RNF-06 (Almacenamiento Local):** Los archivos subidos deben guardarse en un volumen o carpeta persistente mapeada en el servidor local.

---

## 5. Matriz de Trazabilidad Técnica

| Requerimiento | Componente Tecnológico | Ubicación / Implementación |
| :--- | :--- | :--- |
| **RF-01, RF-02** | Express/Fastify + JWT | `apps/api/src/modules/auth` |
| **RF-03 a RF-06** | Prisma ORM + PostgreSQL | `packages/database/prisma/schema.prisma` |
| **RF-08, RF-09** | Socket.io | `apps/api/src/gateways` |
| **RF-10** | FS / Uploads Local | `apps/api/uploads/` |
| **RNF-03** | Zod + TypeScript | `packages/validators/` |
| **RNF-05** | Docker Compose | `docker-compose.yml` |