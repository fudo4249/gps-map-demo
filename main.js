const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      gsi: {
        type: 'raster',
        tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '地図データ：国土地理院'
      }
    },
    layers: [{
      id: 'gsi-layer',
      type: 'raster',
      source: 'gsi'
    }]
  },
  center: [139.7671, 35.6812],
  zoom: 14
});

// 現在地取得
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude } = pos.coords;
    map.setCenter([longitude, latitude]);
    new maplibregl.Marker({ color: 'red' })
      .setLngLat([longitude, latitude])
      .addTo(map);
  },
  () => {
    const fallback = [139.7638, 35.6759]; // 有楽町
    map.setCenter(fallback);
    new maplibregl.Marker({ color: 'red' }).setLngLat(fallback).addTo(map);
  }
);

map.on('load', () => {
  // 用途地域レイヤー
  const fillLayers = [
    { id: 'shougyou', file: './data/SHOUGYOU.geojson', color: 'rgb(255, 0, 0)' },              // 赤
    { id: 'kinsho', file: './data/KINSHO.geojson', color: 'rgb(255, 182, 193)' },             // さくら色
    { id: 'juusen', file: './data/JUUSEN.geojson', color: 'rgb(144, 238, 144)' }              // きみどり
  ];

  fillLayers.forEach(({ id, file, color }) => {
    map.addSource(id, {
      type: 'geojson',
      data: file
    });
    map.addLayer({
      id: `${id}-layer`,
      type: 'fill',
      source: id,
      paint: {
        'fill-color': color,
        'fill-opacity': 0.4
      }
    });
  });

  // SHINJUKU（青線）
  map.addSource('shinjuku', {
    type: 'geojson',
    data: './data/SHINJUKU.geojson'
  });
  map.addLayer({
    id: 'shinjuku-layer',
    type: 'line',
    source: 'shinjuku',
    paint: {
      'line-color': 'blue',
      'line-width': 5
    }
  });

  // SHIBUYA（赤線）
  map.addSource('shibuya', {
    type: 'geojson',
    data: './data/SHIBUYA.geojson'
  });
  map.addLayer({
    id: 'shibuya-layer',
    type: 'line',
    source: 'shibuya',
    paint: {
      'line-color': 'red',
      'line-width': 5
    }
  });

  // チェックボックス制御
  document.getElementById('toggle-shinjuku').addEventListener('change', (e) => {
    map.setLayoutProperty('shinjuku-layer', 'visibility', e.target.checked ? 'visible' : 'none');
  });

  document.getElementById('toggle-shibuya').addEventListener('change', (e) => {
    map.setLayoutProperty('shibuya-layer', 'visibility', e.target.checked ? 'visible' : 'none');
  });
});
