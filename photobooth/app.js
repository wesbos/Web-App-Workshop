// lets go!

// this is just a little bit of code that makes our tooling reload the page if and then the modules are updated. For development only
if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload();
  });
}
