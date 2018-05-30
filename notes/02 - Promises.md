## Promises

Flow control in JavaScript is hard.

Promises are an iou for something that will happen in the future.

* ajax call returning data
* access to a user's webcam
* resizing an image

All of the above things take time and will finish, or _resolve_ in the future. If we want to write some code that runs after the above functions resolve, we have had to resort to callbacks in the past:

```js
getSomeData(function(data) {
  console.log('The Data came back');
  showTheData(data);
})
```

This can very easily get out of control when you need to orchestrate 3-4 calls, one after another:

```js
getTheWeatherFor('Dayton', function(weather) {
  getPicturesOfWeather(weather, function(pictures) {
    resizePicturesOfWeather(pictures, function(resizedPictures) {
      uploadNewPictures(resizedPictures, function() {
        console.log('Finally Done!');
      });
    })
  });
});
```

This is referred to callback hell - 4 simple tasks, each one happening one after another and they must all be nested inside of each other.

Further complexity is added when some functions need to be fired sequentially, and others can be fired off at the same time - concurrently.

And don't even get me started on error handing!

```js
getTheWeatherFor('Dayton', function(weather) {
  getPicturesOfWeather(weather, function(pictures) {
    resizePicturesOfWeather(pictures, function(resizedPictures) {
      uploadNewPictures(resizedPictures, function() {
        console.log('Finally Done!');
      }, function(err) {
        handleError(err);
      });
    }, function(err) {
      handleError(err);
    });
  }, function(err) {
    handleError(err);
  });
}, function(err) {
  handleError(err);
});
```

## Why do we do it this way?

Almost everything in JavaScript is asynchronous — it doesn't wait for anyone. This is different than many other programming languages which are syncronous and can be easily read top to bottom:

```php
$weather = getTheWeatherFor('Dayton');
$pictures = getPicturesOfWeather(weather);
$resizedPictures - resizePicturesOfWeather(pictures);
uploadNewPictures($resizedPictures);
// Done!
```

## Enter Promises

Promises are here to save us from callback hell and enter the promise land.

Promises are a standard part JavaScript as of ES6 and are quickly becoming the defacto way to write flow control.

* They are universal - no libraries needed
* Used in standard browser APIs: Fetch, getUserMedia, Animation APIs
* Most open source libraries are now built on Promises
* Easy to convert existing callback to code to Promises
* Easy to write your own!

The way Promises work is that you run a function, and that function will not immediately return the data (because it will take time), but it _will_ immediately return a promise.

Remember we said a promise is an IOU for something?

Let's take the first function `getTheWeatherFor()` — you might think you can do this:

```js
const weather = getTheWeatherFor('Dayton');
console.log(weather);
```

However we can't do that because JavaScript will not wait for the first line to return data before it moves onto the next line. It's asynchronous!

So, what we do is make the `getTheWeatherFor()` function return a promise that looks like this:

```js
const weatherPromise = getTheWeatherFor('dayton');
```

And _then_ we listen for that promise to return our data, this is called _resolving_.

```js
weatherPromise.then(function(weather) {
  console.log('Back with the weather!');
  console.log(weather);
})
```

uhh..

Isn't that just another callback?

The power comes when we want to chain everything. Remember callback hell? This is significantly cleaned up like so:

```js
getTheWeatherFor('Dayton')
  .then(function(weather) {
    return getPicturesOfWeather(weather);
  })
  .then(function(pictures) {
    return resizePicturesOfWeather(pictures);
  })
  .then(function(resizedPictures) {
    return uploadNewPictures(resizedPictures);
  })
  .then(function() {
    console.log('Done');
  });
```

By returning a promise from a .then() funciton, we can chain them for as long as we like!

Even better, if an error were to happen anywhere along the .then() chain, we can catch it with a single `.catch()` chained onto the end:

```js
getTheWeatherFor('Dayton')
  .then(function(weather) {
    return getPicturesOfWeather(weather);
  })
  .then(function(pictures) {
    return resizePicturesOfWeather(pictures);
  })
  .then(function(resizedPictures) {
    return uploadNewPictures(resizedPictures);
  })
  .then(function() {
    console.log('Done');
  })
  .catch(function(err) {
    console.log('Something Happened!', err);
  })
```

You'll often see these used in conjunction with Arrow functions:

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
  .catch((err) => {
    console.log('Something Happened!', err);
  })
```

And implicit return

```js
getTheWeatherFor('Dayton')
  .then((weather) => getPicturesOfWeather(weather))
  .then((pictures) => resizePicturesOfWeather(pictures))
  .then((resizedPictures) =>uploadNewPictures(resizedPictures))
  .then(() => {
    console.log('Done!);
  })
  .catch((err) => {
    console.log('Something Happened!', err);
  })
```
## Code Along: Using Existing Promises

Okay - let's write some code.

Open up `promises-START.html` in the `scratchpad` directory in both your editor and your browser.

We're going to use a built in browser API called fetch to fetch some data from this url:

https://api.github.com/users/wesbos

## Code Along: Creating a Promise Function

Now there are many other browser APIs that are built on promises, and we will see a few today, but we also need to know how to create our own promises.

Together, let's create a function called `wait()` that:

1. Can be passed any number of miliseconds to wait
1. After the number of miliseconds has passed, return a wise quote.
1. If the number of miliseconds is less than 300, error out

We should be able to:

1. Call it once
1. Chain it multiple times

## Code Along: Working with Multiple Promises - Promise.all()

Another neat part of working with promises is that you can fire requests off concurrently -  this saves time!

Let's write some code to:

1. wait(600) and wait(2000) - wait for both to be resolved afer 2000ms
1. Fetch both
  * https://api.github.com/users/wesbos
  * https://api.github.com/users/stolinski


## Additonal Info

There are a few other methds we won't go into, but are worth noting:

* somePromise.finally(); - whatever happens, run this
* Promse.race(); - run this after the first one comes back
