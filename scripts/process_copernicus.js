const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\napog\\Documents\\P.A.R.A\\1-Projects\\Terremoto\\assets\\Copernicus\\EMSR884_products';
const destDir = 'C:\\Users\\napog\\Documents\\P.A.R.A\\1-Projects\\Terremoto\\public\\data\\copernicus';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const allFolders = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());

const layers = {
  builtUp: [],
  transportation: [],
  groundMovement: [],
  crisisInfo: []
};

allFolders.forEach(folder => {
  const dirPath = path.join(srcDir, folder);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && !f.includes('areaOfInterest'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const features = data.features || [];
      
      if (file.includes('builtUp')) {
        layers.builtUp.push(...features);
      } else if (file.includes('transportation')) {
        layers.transportation.push(...features);
      } else if (file.includes('groundMovement')) {
        layers.groundMovement.push(...features);
      } else if (file.includes('ancillaryCrisisInfo')) {
        layers.crisisInfo.push(...features);
      }
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
    }
  });
});

Object.keys(layers).forEach(layerName => {
  const featureCollection = {
    type: 'FeatureCollection',
    features: layers[layerName]
  };
  fs.writeFileSync(
    path.join(destDir, `${layerName}.geojson`), 
    JSON.stringify(featureCollection)
  );
  console.log(`Wrote ${layers[layerName].length} features to ${layerName}.geojson`);
});
