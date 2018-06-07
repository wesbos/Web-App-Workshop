## Async + Await

Now that we are comfortable with Promises, we're going to learn about Async + Await.

Promises are great, but the syntax is stil a little callback-y.

This is where async+await comes in. Remember this PHP code?

```php
$weather = getTheWeatherFor('Dayton');
$pictures = getPicturesOfWeather(weather);
$resizedPictures = resizePicturesOfWeather(pictures);
uploadNewPictures($resizedPictures);
// Done!
```

This reads nicely, but falls apart when we try to do things that aren't sequential:

```php
$wes = getWes();
$scott = getScott();
// we have both
```

The above code will wait and block scott, while wes is being fetched.

Async + Await is the best of both worlds - we get synchronous looking code without blocking anything else on the page.

## How Async Await Works

First, async+await is _just syntax_ added on top of promises. That means it's not a replacement or promises, it's a new way to work with functions that return promises.

Remember this promise based code?

```js
getTheWeatherFor('Dayton')
  .then((weather) => {
    return getPicturesOfWeather(weather);
  })
  .then((pictures) => {
    return resizePicturesOfWeather(pictures);
  })
  .then((resizedPictures) => {
    return uploadNewPictures(resizedPictures);
  })
  .then(() => {console.log('Done');
  })
```

The first thing we need to do is create an `async function` to wrap all of our code in. This will make sense why in just a second.

```js
async function go() {
  // here we go
}
```

You can also mark other types of functions as async:


```js
// anon functions
$('.thing').on('click', async function() {...})

// arrow function
const go = async () => { ... }

// method syntax
const wes = {
  async go() {

  }
}
```

Then, once we are inside of a function marked as `async`, we can use `await` in front of promise functions.

Remember this code?

```js
const weatherPromise = getTheWeatherFor('dayton');
```

Now we can do this:

```js
async function go() {
  const weather = await getTheWeatherFor('dayton');
}

go();
```

The `getTheWeatherFor()` function returns a promise, but we don't put the promise into our weather variable, we just temporarily pause our `go()` function until `getTheWeatherFor` resolves.

This is awesome because our previous example now looks like this:


```js
async function go() {
  const weather = await getTheWeatherFor('Dayton');
  const pictures = await getPicturesOfWeather(weather);
  const resizedPictures = await resizePicturesOfWeather(pictures);
  console.log('Gonna upload them now');
  await uploadNewPictures(resizedPictures);
  console.log('Done!');
}
```

## Code Along: Built in Promise APIs

Let's refactor our fetch examples.

## Code Along: Using With our other promises

Let's create a function called `breathe()` that uses our wait function from earlier.

## Error Handling

Once nice thing about Promises is that we can chain a single catch() on the end of our promise chain.

With Async + Await there are a few error handling techniques:

### try / catch

The simplest is to wrap our code in a try/catch. Depending on where you want to handle your errors, you can put the try/catch in different spots.

```js
async function go() {
  try {
    const weather = await getTheWeatherFor('Dayton');
    const pictures = await getPicturesOfWeather(weather);
    // ....
  }
  catch(err) {
    // handle error
  }
}
```


### .catch()

The above is great if you want to handle the error when you author it, but if you want to handle the error as you call it, we can chain a .catch() onto an async function.

This is because all async functions are promises in themselves.

```js
go().catch(handleError);
```

### High Order Function

The way this works is that we just write functions without any error handling

```js
async function yolo() {
  const wes = await fetch('oops.com');
}
```

and then we will wrap that function in a high order function that tacks a .catch() onto the end.

```js
function handleError(fn) {
  return function(...parans) {
    return fn(...params).catch(function(err) {
      // Handle the error here
    })
  }
}
```

Now we can make any unsafe function safe again:

```js
const safeYolo = handleError(yolo);
safeYolo();
```
