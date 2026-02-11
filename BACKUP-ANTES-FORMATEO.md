# Backup antes de formatear la PC

Guía rápida para no perder el proyecto Naik Dance ni el historial del chat de Cursor.

---

## 1. Proyecto (código y configuración)

### Opción A: Subir todo a GitHub (recomendado)
- Crea un repositorio en GitHub si aún no tienes uno.
- En la carpeta del proyecto (`naikdance-web`), ejecuta:
  ```bash
  git init
  git add .
  git commit -m "Backup antes de formateo"
  git remote add origin https://github.com/TU_USUARIO/naikdance-web.git
  git push -u origin main
  ```
- Así recuperas el código desde cualquier PC clonando el repo.

### Opción B: Copia manual
- Copia toda la carpeta del proyecto a un pendrive o disco externo.
- Incluye la carpeta oculta `.git` si existe (historial de commits).

### Importante: variables de entorno
- **No** subas `.env` a GitHub (debe estar en `.gitignore`).
- Guarda una copia segura de `.env` en otro lado (notas, gestor de contraseñas o archivo en la nube con nombre distinto, ej. `env-backup.txt`).
- Contiene: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_*`, `MERCADOPAGO_*`, `INSTAGRAM_*`, etc.

---

## 2. Historial del chat de Cursor

El historial de conversaciones de Cursor se guarda en tu PC. Para no perderlo:

### Ubicación típica del historial (Windows)
```
C:\Users\Administrator\.cursor\
```
O dentro de:
```
%USERPROFILE%\.cursor\
```

### Qué copiar
- Carpeta `.cursor` completa, o al menos:
  - `projects\` (donde suelen estar los transcripts/chats por proyecto).
  - Cualquier carpeta que veas con nombres de proyecto o "agent-transcripts".

### Cómo recuperarlo después del formateo
1. Instala Cursor de nuevo.
2. Copia la carpeta `.cursor` (o la parte que guardaste) de vuelta a `C:\Users\Administrator\.cursor\`.
3. Abre el proyecto; Cursor podría seguir asociando los chats al mismo path del proyecto.

**Nota:** Si después del formateo abres el proyecto desde otra ruta (ej. `D:\naikdance-web`), los chats antiguos pueden no enlazarse automáticamente, pero los archivos de transcript seguirán en la carpeta que copiaste por si quieres consultarlos.

---

## 3. Checklist rápido

- [ ] Código en GitHub o copiado a pendrive/disco
- [ ] Copia de `.env` guardada en lugar seguro (no en el repo)
- [ ] Carpeta `C:\Users\Administrator\.cursor` (o `%USERPROFILE%\.cursor`) copiada a respaldo
- [ ] Vercel ya está conectado al repo: después del formateo solo clonas y sigues trabajando

---

## 4. Después del formateo

1. Instalar: Node.js, Git, Cursor.
2. Clonar el repo: `git clone https://github.com/TU_USUARIO/naikdance-web.git`
3. Crear `.env` en la raíz del proyecto con los valores que guardaste.
4. `npm install` y luego `npm run dev`.
5. (Opcional) Restaurar la carpeta `.cursor` si quieres conservar el historial de chats.

Si quieres, en el siguiente mensaje podemos revisar punto por punto según cómo tengas ya guardado el proyecto (Git, Vercel, etc.).
