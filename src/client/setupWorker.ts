export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log(
            'Service worker are registered with the scope :',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}
