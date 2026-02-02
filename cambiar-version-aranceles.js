#!/usr/bin/env node

/**
 * Script para cambiar entre versiones de Aranceles
 * Uso: node cambiar-version-aranceles.js [1|2]
 */

const fs = require('fs');
const path = require('path');

const PAGE_FILE = path.join(__dirname, 'src', 'app', 'page.tsx');

const IMPORT_V1 = "import Pricing from '@/components/Pricing';";
const IMPORT_V2 = "import Pricing from '@/components/PricingCompact';";

// Obtener versión desde argumentos
const version = process.argv[2];

if (!version || (version !== '1' && version !== '2')) {
  console.log('');
  console.log('🎨 Cambiar Versión de Aranceles');
  console.log('================================');
  console.log('');
  console.log('Uso: node cambiar-version-aranceles.js [1|2]');
  console.log('');
  console.log('Opciones:');
  console.log('  1 - Versión con botones verticales grandes');
  console.log('  2 - Versión con botones horizontales compactos');
  console.log('');
  console.log('Ejemplo: node cambiar-version-aranceles.js 1');
  console.log('');
  process.exit(1);
}

// Leer archivo
try {
  let content = fs.readFileSync(PAGE_FILE, 'utf8');
  
  // Determinar versión actual
  const currentV1 = content.includes(IMPORT_V1);
  const currentV2 = content.includes(IMPORT_V2);
  
  if (version === '1') {
    if (currentV1) {
      console.log('✅ Ya estás usando la Versión 1 (Botones Verticales)');
      process.exit(0);
    }
    // Cambiar a V1
    content = content.replace(IMPORT_V2, IMPORT_V1);
    fs.writeFileSync(PAGE_FILE, content, 'utf8');
    console.log('✅ Cambiado a Versión 1: Botones Verticales Grandes');
    console.log('🔄 El sitio se actualizará automáticamente si está en desarrollo');
  } else if (version === '2') {
    if (currentV2) {
      console.log('✅ Ya estás usando la Versión 2 (Botones Horizontales)');
      process.exit(0);
    }
    // Cambiar a V2
    content = content.replace(IMPORT_V1, IMPORT_V2);
    fs.writeFileSync(PAGE_FILE, content, 'utf8');
    console.log('✅ Cambiado a Versión 2: Botones Horizontales Compactos');
    console.log('🔄 El sitio se actualizará automáticamente si está en desarrollo');
  }
  
  console.log('');
  console.log('📸 Ahora podés tomar screenshots de esta versión!');
  console.log('');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
