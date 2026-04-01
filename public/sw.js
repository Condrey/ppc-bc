self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/favicon-96x96.png",
      badge: "/web-app-manifest-192x192.png",
      image: data.image,
      vibrate: [200, 100, 200, 100, 200],
      tag: data.tag || "general",
      renotify: true,
      requirementInteraction: data.important || false,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "3",
        url: data.url || "/",
      },
      actions: [
        {
          action: "open",
          title: "Open",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options),
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});
