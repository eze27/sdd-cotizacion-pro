const MAX_BYTES = 2 * 1024 * 1024;
const MAX_WIDTH = 400;

// Acepta PNG o JPG de hasta 2 MB; devuelve un data URL reducido a 400 px de ancho como máximo.
export function processLogo(file) {
  return new Promise((resolve, reject) => {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      reject(new Error('El logo debe ser una imagen PNG o JPG.'));
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error('El logo pesa más de 2 MB. Elige una imagen más pequeña.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.9));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen. Prueba con otra.'));
    };
    img.src = url;
  });
}
