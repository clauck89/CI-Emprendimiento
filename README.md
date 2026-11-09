# Plataforma Educativa (ODS 4: Educación de Calidad)

Este proyecto de base tecnológica es una plataforma educativa web de alto rendimiento y bajo consumo de datos, enfocada en la enseñanza de habilidades tecnológicas para estudiantes en zonas periféricas.

## Arquitectura del Proyecto

El sistema utiliza una arquitectura desacoplada (Headless CMS) orquestada con Docker:

* **Frontend:** Vue 3 + Vite (SPA/PWA) para una experiencia de usuario rápida y fluida.
* **Backend:** Headless WordPress (FPM) para la gestión ágil de contenidos vía API REST.
* **Servidor Web:** Nginx (Proxy inverso).
* **Base de Datos:** MySQL 8.0.

## Requisitos Previos

Para levantar este proyecto en un entorno local, necesitas tener instalado:
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Instrucciones de Instalación y Ejecución

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/clauck89/CI-Emprendimiento.git](https://github.com/clauck89/CI-Emprendimiento.git)
