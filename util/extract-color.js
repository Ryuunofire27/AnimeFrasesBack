const Vibrant = require('node-vibrant');

function padZero(str, _len) {
  const len = _len || 2;
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function invertColor(_r, _g, _b) {
  const r = (255 - _r).toString(16);
  const g = (255 - _g).toString(16);
  const b = (255 - _b).toString(16);
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
}

function getRgbToHex(_r, _g, _b) {
  const r = _r.toString(16);
  const g = _g.toString(16);
  const b = _b.toString(16);
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
}

class ColorExtract {
  getColors(path, cb) {
    Vibrant.from(path)
      .getPalette()
      .then((palette) => {
        const dm = palette.DarkMuted;
        const v = palette.Vibrant;
        const lv = palette.LightVibrant;
        const lm = palette.LightMuted;
        const m = palette.Muted;
        const dv = palette.DarkVibrant;
        const arr = [];
        if (dm) arr.push(dm);
        if (v) arr.push(v);
        if (lv) arr.push(lv);
        if (lm) arr.push(lm);
        if (m) arr.push(m);
        if (dv) arr.push(dv);
        const rgbColor = arr.reduce((a, b) => a._population >= b._population ? a : b)._rgb;
        const color = {
          normal: getRgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]),
          contrast: invertColor(rgbColor[0], rgbColor[1], rgbColor[2]),
        };
        cb(color);
      })
      .catch(err => console.log(err));
  }
}

module.exports = ColorExtract;
