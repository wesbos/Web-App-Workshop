import { drawToCanvas, populateVideo, detectFaces, drawFaces } from './index';
import { takePhoto, countdown } from './photo';

// // 1. Async + Await + Promises
// // 1. Module Loader via Parcel
// // 1. Code Splitting for Filters
// // 1. Offline Support via Service Workers

async function start() {
  const videoEl = document.querySelector('video');
  const canvasEl = document.querySelector('canvas');
  const strip = document.querySelector('.strip');
  const startButton = document.querySelector('button.start');
  const filterButtons = document.querySelectorAll('button.filter');

  if (!videoEl) throw Error('No video Element Found on the page');
  await populateVideo(videoEl);

  canvasEl.height = videoEl.videoHeight;
  canvasEl.width = videoEl.videoWidth;

  // start to draw the video
  let interval = setInterval(() => {
    drawToCanvas(videoEl, canvasEl);
  }, 16);

  filterButtons.forEach(button => button.addEventListener('click', attachFilter));

  async function attachFilter() {
    clearInterval(interval);
    // lazy load the filters
    const filters = await import('./filters');
    interval = setInterval(() => {
      drawToCanvas(videoEl, canvasEl, filters[this.dataset.filter]);
    }, 16);
  }

  const countdownButton = document.querySelector('.count');

  canvasEl.addEventListener('click', () => {
    takePhoto(videoEl, canvasEl, strip);
  });

  countdownButton.addEventListener('click', () => {
    console.log('Click');
    countdown(videoEl, canvasEl, strip);
  });
}

start();

const serviceWorker = false;
// Register Service Worker
if ('serviceWorker' in navigator && serviceWorker) {
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('./service-worker.js', {
      scope: '/',
    });
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    // listen for updates
    registration.onupdatefound = () => {
      alert('Hey, there is an update to this app! Just refresh your browser to see');
    };
  });
}

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
  });
}
