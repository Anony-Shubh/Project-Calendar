const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
  });
};
activateEvent();

self.addEventListener("push", (event) => {

  event.waitUntil(
    self.registration.showNotification(JSON.parse(event.data.text()).title, {
      body: JSON.parse(event.data.text()).body,
      icon: "/logo.jpg",
      badge: "/logo.jpg",
    })
  );
});
