export function generateCuponeraCode(type: string): string {
  const prefix = 'NAIK';
  
  const typeMap: Record<string, string> = {
    'Clase Suelta - 1 Hora': '1C',
    'Pack X2 - 2 Clases': '2C',
    'Pack X3 - 3 Clases': '3C',
    'Cuponeras - 4 Clases': '4C',
    'Cuponeras - 8 Clases': '8C',
    'Cuponeras - 12 y 16 Clases': '12C',
    'Pase Full - Acceso Ilimitado': 'FULL',
  };
  
  const typeCode = typeMap[type] || 'CUP';
  
  const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${prefix}-${typeCode}-${randomCode}`;
}
