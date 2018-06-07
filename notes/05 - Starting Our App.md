## Starting our Photobooth Application

Now that we know about modules, let's start building out out application.

## Organization

There are many schools of though on code organization and it will ultimately boil down to you and your team's preferences. Here is one way to scaffold an application.

```
app.js
src/
lib/
node_modules/
components/
```

**app.js:** With application, you typically have an entry point in your root folder called `index.js`, `app.js`, or `scripts.js`.

**src/** : We are going to have a `src/` folder, inside of that will contain most of the functionality of your application.

**node_modules/** : will contain any installed dependencies

**lib/**: will contain any helper or library code that isn't in an external package

**components/**: This is often more react or componentized specific, but this folder will include the scripts that make display components.


Larger src folders might have nested folders where each folder has an `index.js` file that imports/exports everything from that folder. This allows to you simply `import { takePhoto} from './photo'` instead of `import { takePhoto} from './photo/takePhoto'`

```
src/
  photo/
    index.js
    takePhoto.js
    loadPhoto.js
  video/
    index.js
    loadVideo.js
    filters.js
```

Our application is small, so we only will have a `src/` folder.

## Reviewing index.html

Let's open index.html and review the starter files

## Starting Our Application

Let's open up `app.js` and create a start function(). This function will be the boot up of our application.

We will start by selecting all the elements we talked about earlier.

```js
async function start() {
  const videoEl = document.querySelector('video');
  const canvasEl = document.querySelector('canvas');
  const strip = document.querySelector('.strip');
  const filterButtons = document.querySelectorAll('button.filter');
  const countdownButton = document.querySelector('.count');

  if (!videoEl) throw Error('No video Element Found on the page');

  // next we  will get the video from the webcam
}
```

## Piping in video from the webcam

For this, we are going to make a function inside of `video.js`.

```js
export async function populateVideo(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
  videoEl.srcObject = stream;
  await videoEl.play();
}
```

and then in our `start()`  function run it.

```js
await populateVideo(videoEl);
```

## Piping Video into Canvas

We can't apply filters to, or take photos from `<video>` elements directly. So, we use the `<canvas>` element for this.

We need to take frames from the `<video>` and paint them to the canvas. For that we will make another function in `video.js`.

```js
export async function drawToCanvas(video, canvas, filter) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
}
```

And then in our `start()` function, add the following:

```js
canvasEl.height = videoEl.videoHeight;
canvasEl.width = videoEl.videoWidth;

// start to draw the video
let interval = setInterval(() => {
  drawToCanvas(videoEl, canvasEl);
}, 16);
```
