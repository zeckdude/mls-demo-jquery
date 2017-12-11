var attribution = '&copy <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var detectRetina = true;
var mapBoxAccessToken = 'pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA';

var layers = {
  grayscale: {
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    isMapBox: false
  },
  basic: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0939ma8002h2sn787k9ye4n/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  another: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0ah6u9o000f2rno9feszoec/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  emerald: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0ahszig000c2rpiq7bnehiz/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  light: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0aiq63z000i2smut4o8a2kl/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  runner: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0aiwt2c000p2ss4e9zail8o/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  streets: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0aj03o1000i2rp8oakz1f99/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  },
  swissSki: {
    url: 'https://api.mapbox.com/styles/v1/zeckdude/cj0aj20fd000r2ss479i5y5ec/tiles/256/{z}/{x}/{y}',
    isMapBox: true
  }
};

function getTileLayer(name) {
  var urlAddOn = layers[name].isMapBox ? '?access_token=' + mapBoxAccessToken : '';
  return L.tileLayer(layers[name].url + urlAddOn, {
    attribution: attribution,
    detectRetina: detectRetina
  });
}


// var grayScaleMap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var basic = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0939ma8002h2sn787k9ye4n/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var another = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0ah6u9o000f2rno9feszoec/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var emerald = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0ahszig000c2rpiq7bnehiz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var light = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aiq63z000i2smut4o8a2kl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var runner = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aiwt2c000p2ss4e9zail8o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var streets = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aj03o1000i2rp8oakz1f99/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
//
// var swissSki = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aj20fd000r2ss479i5y5ec/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
//   attribution: attribution,
//   detectRetina: detectRetina
// });
