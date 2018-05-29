export async function drawToCanvas(video, canvas, filter) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  if (filter) {
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixels = filter(pixels);
    ctx.putImageData(pixels, 0, 0);
  }
}

export async function start() {
  // look for the video element
  const video = document.querySelector('video');
  if (!video) throw Error('No video Element Found on the page');
}

export async function populateVideo(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
  videoEl.srcObject = stream;
  await videoEl.play();
}
