## First a note on how taking photos work

How does it work? Let's talk about it.


## Taking a Photo

Let's first create an empty function in `photo.js` and import it into `app.js.

```js
export function takePhoto(video, canvas, strip) {
  console.log('Taking photooo');
}
```

And then hook that up to when someone clicks the canvas:

```js
canvasEl.addEventListener('click', () => {
  takePhoto(videoEl, canvasEl, strip);
});
```

Let's click that a few times and make sure the event handler works.

Once we're done that, let's work through the rest of the code together:

```js
export function takePhoto(video, canvas, strip) {
  console.log('Taking photooo');
  document.body.classList.add('taking');
  const data = canvas.toDataURL('image/jpeg');
  const img = document.createElement('img');
  img.src = data;
  const link = document.createElement('a');
  link.setAttribute('download', `handsome-${Date.now()}.jpg`);
  link.setAttribute('href', data);
  link.classList.add('full');
  link.appendChild(img);
  strip.insertBefore(link, strip.firstChild);
  setTimeout(() => {
    link.classList.remove('full');
    document.body.classList.remove('taking');
  }, 250);
}
```

## Creating a Countdown Timer

The last step is to be able to use the above takePhoto function after an amount of time.

Waiting time you say? Sounds like something async+await is for!

```js
import wait from 'waait';

// ...

export async function countdown(video, canvas, strip) {
  const span = document.querySelector('.countdown');
  span.textContent = 3;
  await wait(1000);
  span.textContent = 2;
  await wait(1000);
  span.textContent = 1;
  await wait(500);
  span.textContent = '!!🧀!!';
  await wait(200);
  span.textContent = '';
  await wait(300);
  takePhoto(video, canvas, strip);
}

```

And then we import and wire it up:

```js
countdownButton.addEventListener('click', () => {
  countdown(videoEl, canvasEl, strip);
});
```
