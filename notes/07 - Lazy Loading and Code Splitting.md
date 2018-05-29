someones we might not want to load everything on page load - our app could be very large nad it makes sense to only load the JS that we need on those specific pages, or once that peice of the application is needed.

One common way to solve the problem of large applications is to "lazy load" our JavaScript. Load it in only when we need it.

ParcelJS makes this really simple.
