


self.addEventListener("push", e => {
    const data1 = e.data.json();
   
    e.waitUntil(
      self.registration.showNotification(data1.title, {
        body: data1.body,
        icon: data1.icon,
        image: data1.image,
        tag: data1.tag,
      })
    )
  });

