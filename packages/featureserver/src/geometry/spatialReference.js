const defaultSR = { wkid: 4326 }
const mercatorSR = { wkid: 102100, latestWkid: 3857 }

module.exports = function (sr) {
  if (!sr) return defaultSR
  else if (sr === 4326 || sr.wkid === 4326 || sr.latestWkid === 4326) return defaultSR
  else if (sr === 102100 || sr === 3857 || sr.wkid === 102100 || sr.latestWkid === 3857) return mercatorSR
  else if (typeof sr === 'number') return { wkid: sr }
  else {
    return {
      wkid: sr.wkid || sr.latestWkid,
      latestWkid: sr.latestWkid || sr.wkid
    }
  }
}
