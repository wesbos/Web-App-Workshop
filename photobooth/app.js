import { drawToCanvas, populateVideo, detectFaces, drawFaces } from './video';
import { takePhoto, countdown } from './photo';
import registerServiceWorker from './src/registerServiceWorker';

async function start() {
  const videoEl = document.querySelector('video');
  const canvasEl = document.querySelector('canvas');
  const strip = document.querySelector('.strip');
  const filterButtons = document.querySelectorAll('button.filter');
  const countdownButton = document.querySelector('.count');

  if (!videoEl) throw Error('No video Element Found on the page');
  await populateVideo(videoEl);

  canvasEl.height = videoEl.videoHeight;
  canvasEl.width = videoEl.videoWidth;

  // start to draw the video
  let interval = setInterval(() => {
    drawToCanvas(videoEl, canvasEl);
  }, 16);

  filterButtons.forEach(button =>
    button.addEventListener('click', async () => {
      clearInterval(interval);
      // lazy load the filters
      const filters = await import('./filters');
      interval = setInterval(() => {
        drawToCanvas(videoEl, canvasEl, filters[this.dataset.filter]);
      }, 16);
    })
  );

  canvasEl.addEventListener('click', () => {
    takePhoto(videoEl, canvasEl, strip);
  });

  countdownButton.addEventListener('click', () => {
    console.log('Click');
    countdown(videoEl, canvasEl, strip);
  });
}

start();
registerServiceWorker();

// this is just a little bit of code that makes our tooling reload the page if and then the modules are updated
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
  });
}
