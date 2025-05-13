import 'server-only';
import sharp from 'sharp';

async function optimizeImage(imageBuffer: Buffer) {
  const processor = sharp(imageBuffer).resize({
    width: 800,
    height: 800,
    fit: 'inside',
  });

  return await processor
    .webp({
      quality: 50,
    })
    .toBuffer();
}

export const optimizedImage = async (image: string | File) => {
  if (typeof image === 'string' && image.startsWith('data:')) {
    const [format, base64Data] = image.split(',');

    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log(format);

    if (imageBuffer.length > 350 * 1024) {
      return { error: 'error' };
    }

    const { buffer: optimizedImageBuffer } = await optimizeImage(imageBuffer);

    return `data:image/webp;base64,${Buffer.from(optimizedImageBuffer).toString('base64')}`;
  } else if (image instanceof File) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { buffer: optimizedBuffer } = await optimizeImage(buffer);

    return `data:image/webp;base64,${Buffer.from(optimizedBuffer).toString('base64')}`;
  }

  return { error: 'error' };
};
