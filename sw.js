self.addEventListener('push', (e) => {
  let d = {}
  try { d = e.data.json() } catch { d = { title: 'G.MAX', body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.title || 'G.MAX', {
    body: d.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: d.url || '/branch/' },
    tag: d.tag,
    renotify: !!d.tag,
    vibrate: [200, 100, 200],
  }))
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || '/branch/'
  e.waitUntil((async () => {
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of list) { if (c.url.includes(url) && 'focus' in c) return c.focus() }
    if (list[0] && 'navigate' in list[0]) { await list[0].navigate(url); return list[0].focus() }
    return clients.openWindow(url)
  })())
})