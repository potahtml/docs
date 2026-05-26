import { updateBlacklist } from 'pota/store'

const frame = document.createElement('iframe')
document.body.append(frame)

updateBlacklist(frame.contentWindow)

// now `mutable(...)` will treat instances of frame.contentWindow.Date
// as opaque, just like instances of the host's Date.
