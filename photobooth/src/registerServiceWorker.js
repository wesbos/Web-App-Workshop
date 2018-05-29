export default function registerServiceWorker() {
  // Register Service Worker
  if ('serviceWorker' in navigator && serviceWorker) {
    window.addEventListener('load', async () => {
      const registration = await navigator.serviceWorker.register('../service-worker.js', {
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
}
