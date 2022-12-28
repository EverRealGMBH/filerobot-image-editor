const releaseCanvas = (canvas) => {
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
    desynchronized: true,
  });
  ctx && ctx.clearRect(0, 0, 1, 1);
};

export default releaseCanvas;
