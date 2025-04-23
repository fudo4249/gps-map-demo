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

// 現在地の取得（マップ読み込み後に実行）
map.on('load', () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      map.setCenter([coords.longitude, coords.latitude]);
      new maplibregl.Marker({ color: 'red' })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(map);
    },
    () => {
      const fallback = [139.7638, 35.6759]; // 有楽町 fallback
      map.setCenter(fallback);
      new maplibregl.Marker({ color: 'red' }).setLngLat(fallback).addTo(map);
    }
  );

  // 用途地域（fillレイヤー）
  const fills = [
    { id: 'shougyou', file: './data/SHOUGYOU.geojson', color: 'rgb(255, 0, 0)', checkboxId: 'toggle-shougyou' },           // 赤
    { id: 'kinsho',   file: './data/KINSHO.geojson',   color: 'rgb(255, 182, 193)', checkboxId: 'toggle-shougyou' },       // さくら
    { id: 'juusen',   file: './data/JUUSEN_filtered.geojson', color: 'rgb(144, 238, 144)', checkboxId: 'toggle-jusen' },// きみどり
    { id: 'junko',    file: './data/JUNKO.geojson',    color: 'rgb(128, 0, 128)',  checkboxId: 'toggle-kougyou' },         // 紫
    { id: 'kougyo',   file: './data/KOUGYO.geojson',   color: 'rgb(0, 0, 0)',checkboxId: 'toggle-kougyou' }              // 黒
  ];

  fills.forEach(({ id, file, color,checkboxId }) => {
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

    document.getElementById(checkboxId).addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      map.setLayoutProperty(`${id}-layer`, 'visibility', visibility);
    });

  });

  // エリア線（lineレイヤー）
  const lines = [
    { id: 'chiyoda',     file: './data/千代田区_boundary.geojson',    color: 'red',    checkboxId: 'toggle-23ku' },
    { id: 'chuou',       file: './data/中央区_boundary.geojson',      color: 'blue',   checkboxId: 'toggle-23ku' },
    { id: 'minato',      file: './data/港区_boundary.geojson',        color: 'green',  checkboxId: 'toggle-23ku' },
    { id: 'shinjuku',    file: './data/新宿区_boundary.geojson',      color: 'yellow', checkboxId: 'toggle-23ku' },
    { id: 'bunkyo',      file: './data/文京区_boundary.geojson',      color: 'purple', checkboxId: 'toggle-23ku' },
    { id: 'taito',       file: './data/台東区_boundary.geojson',      color: 'orange', checkboxId: 'toggle-23ku' },
    { id: 'sumida',      file: './data/墨田区_boundary.geojson',      color: 'pink',   checkboxId: 'toggle-23ku' },
    { id: 'koto',        file: './data/江東区_boundary.geojson',      color: 'brown',  checkboxId: 'toggle-23ku' },
    { id: 'shinagawa',   file: './data/品川区_boundary.geojson',      color: 'gray',   checkboxId: 'toggle-23ku' },
    { id: 'meguro',      file: './data/目黒区_boundary.geojson',      color: 'cyan',   checkboxId: 'toggle-23ku' },
    { id: 'ota',         file: './data/大田区_boundary.geojson',       color: 'lime',   checkboxId: 'toggle-23ku' },
    { id: 'setagaya',    file: './data/世田谷区_boundary.geojson',    color: 'red',    checkboxId: 'toggle-23ku' },
    { id: 'shibuya',     file: './data/渋谷区_boundary.geojson',      color: 'blue',   checkboxId: 'toggle-23ku' },
    { id: 'nakano',      file: './data/中野区_boundary.geojson',      color: 'green',  checkboxId: 'toggle-23ku' },
    { id: 'suginami',    file: './data/杉並区_boundary.geojson',      color: 'yellow', checkboxId: 'toggle-23ku' },
    { id: 'toshima',     file: './data/豊島区_boundary.geojson',      color: 'purple', checkboxId: 'toggle-23ku' },
    { id: 'kita',        file: './data/北区_boundary.geojson',        color: 'orange', checkboxId: 'toggle-23ku' },
    { id: 'arakawa',     file: './data/荒川区_boundary.geojson',      color: 'pink',   checkboxId: 'toggle-23ku' },
    { id: 'itabashi',    file: './data/板橋区_boundary.geojson',      color: 'brown',  checkboxId: 'toggle-23ku' },
    { id: 'nerima',      file: './data/練馬区_boundary.geojson',      color: 'gray',   checkboxId: 'toggle-23ku' },
    { id: 'adachi',      file: './data/足立区_boundary.geojson',      color: 'cyan',   checkboxId: 'toggle-23ku' },
    { id: 'katsushika',  file: './data/葛飾区_boundary.geojson',      color: 'lime',   checkboxId: 'toggle-23ku' },
    { id: 'edogawa',     file: './data/江戸川区_boundary.geojson',    color: 'red',    checkboxId: 'toggle-23ku' }
  ];
  
  
  

  lines.forEach(({ id, file, color ,checkboxId}) => {
    map.addSource(id, {
      type: 'geojson',
      data: file
    });
    map.addLayer({
      id: `${id}-layer`,
      type: 'line',
      source: id,
      paint: {
        'line-color': color,
        'line-width': 5
      }
    });

    document.getElementById(checkboxId).addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      map.setLayoutProperty(`${id}-layer`, 'visibility', visibility);
    });
  });
});
