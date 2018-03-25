const Vibrant = require('node-vibrant');

function invertColor(r, g, b, hex, bw) {
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function getRgbToHex(r, g, b){
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

class ColorExtract {

  getColors(path, cb, cbErr){
    Vibrant.from(path)
      .getPalette()
      .then( (palette) => {
        const dm = palette.DarkMuted;
        const v = palette.Vibrant;
        const lv = palette.LightVibrant;
        const lm = palette.LightMuted;
        const m = palette.Muted;
        const dv = palette.DarkVibrant;
        const arr = [];
        if (dm) arr.push(dm);
        if (v)  arr.push(v);
        if (lv) arr.push(lv);
        if (lm) arr.push(lm);
        if (m)  arr.push(m);
        if (dv) arr.push(dv);
        const rgbColor = arr.reduce( (a, b) => {
          return a._population >= b._population ? a : b;
        })._rgb;
        const color = {
          normal : getRgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]),
          contrast : invertColor(rgbColor[0], rgbColor[1], rgbColor[2])
        }
        cb(color);
      })
      .catch( err => console.log(err));
  }

  invertColor(hex, bw, cb){
    const invertedColor = invertColor(hex, bw);
  }

}

module.exports = ColorExtract;
