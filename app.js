const status = document.getElementById('status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let map;
function japan(duration = 0) {
  map.fitBounds([[127, 26], [146.5, 46]], {bearing:180, pitch:0, padding:{top:110,bottom:150,left:45,right:45}, duration, maxZoom:5});
}
async function start() {
  try {
    const response = await fetch('./map-style.json');
    if (!response.ok) throw new Error('style');
    const style = await response.json();
    map = new maplibregl.Map({container:'map',style,center:[137,37],zoom:4,bearing:180,pitch:0,maxPitch:0,minZoom:-2,maxZoom:19,dragRotate:false,pitchWithRotate:false,touchPitch:false,keyboard:false,attributionControl:{compact:true},renderWorldCopies:true});
    map.touchZoomRotate.disableRotation();
    japan();
    map.addControl(new maplibregl.ScaleControl({unit:'metric'}),'bottom-left');
    map.on('load',()=>{status.hidden=true;});
    let errorTimer;
    map.on('error',()=>{clearTimeout(errorTimer); errorTimer=setTimeout(()=>{if(!map.areTilesLoaded()){status.textContent='地図の一部を読み込めません。通信環境を確認して再読み込みしてください。';status.hidden=false;}},5000);});
    map.on('idle',()=>{clearTimeout(errorTimer);status.hidden=true;});
    document.getElementById('japan').onclick=()=>japan(reducedMotion?0:900);
    document.getElementById('world').onclick=()=>map.flyTo({center:[137,0],zoom:Math.max(-2,Math.min(Math.log2(innerWidth/512),Math.log2((innerHeight-180)/512))-.1),bearing:180,pitch:0,duration:reducedMotion?0:1000});
    document.getElementById('plus').onclick=()=>map.zoomIn({duration:reducedMotion?0:250});
    document.getElementById('minus').onclick=()=>map.zoomOut({duration:reducedMotion?0:250});
  } catch(error) {status.textContent='地図を読み込めませんでした。通信環境を確認して再読み込みしてください。';}
}
start();

