## Lazy Loading Code

someones we might not want to load everything on page load - our app could be very large nad it makes sense to only load the JS that we need on those specific pages, or once that peice of the application is needed.

One common way to solve the problem of large applications is to "lazy load" our JavaScript. Load it in only when we need it.

ParcelJS makes this really simple.


## Lazy Loading Filters

We're going to use the filters.js file as an example for this.

First we need to wire up our clicks and event handler. Let's talk through each line because there is a lot going on here:

```js
filterButtons.forEach(button => {
  button.addEventListener('click', async function() {
    clearInterval(interval);
  });
});
```

Next, we can load in the filters. First time we click a button there will be a slight delay while the file is requested. Every time after that it will be instant.


```js
filterButtons.forEach(button => {
  button.addEventListener('click', async function() {
    clearInterval(interval);
    // lazy load the filters
    const filters = await import('./src/filters');
    interval = setInterval(() => {
      drawToCanvas(videoEl, canvasEl, filters[this.dataset.filter]);
    }, 16);
  });
});
```


