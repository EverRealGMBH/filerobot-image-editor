import releaseCanvas from 'utils/releaseCanvas';

const imageToBase64 = (image) => {
  if (image instanceof HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = image.width;
    canvas.height = image.height;
    ctx && ctx.drawImage(image, 0, 0);
    const canvasDataURL = canvas.toDataURL();
    releaseCanvas(canvas);

    return canvasDataURL;
  }

  return '';
};

export default imageToBase64;
