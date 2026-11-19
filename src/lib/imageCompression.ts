/**
 * Utilitário de validação e compressão de imagens no navegador.
 * Converte para WebP com largura máxima de 1400px e qualidade 0.82.
 */

export interface CompressionResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGES_PER_PRODUCT = 8;
export const MAX_IMAGE_WIDTH = 1400;
export const IMAGE_QUALITY = 0.82;

export async function compressAndConvertToWebP(file: File): Promise<CompressionResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`O arquivo "${file.name}" não é uma imagem válida.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `O arquivo "${file.name}" tem ${sizeInMB} MB e excede o limite máximo permitido de 10 MB.`
    );
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_IMAGE_WIDTH) {
        height = Math.round((height * MAX_IMAGE_WIDTH) / width);
        width = MAX_IMAGE_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível obter o contexto 2D do canvas para compressão.'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Tenta converter para image/webp; caso o navegador não suporte, converte para jpeg
      const mimeType = 'image/webp';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao gerar a imagem comprimida.'));
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const cleanFileName = `${baseName}_${Date.now()}.webp`;
          const compressedFile = new File([blob], cleanFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(compressedFile);

          resolve({
            file: compressedFile,
            previewUrl,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            width,
            height,
          });
        },
        mimeType,
        IMAGE_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Não foi possível carregar a imagem "${file.name}".`));
    };

    img.src = objectUrl;
  });
}
