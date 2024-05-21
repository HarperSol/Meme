import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { setupThumbnailPreviews } from './thumbnailPreview';

const layers = {
  Background: ['background-1.png', 'background-2.png', 'background-3.png', 'background-4.png', 'background-5.png', 'background-6.png', 'background-7.png', 'background-8.png', 'background-9.png', 'background-10.png'],
  Face: ['face-1.png'],
  Outfit: ['outfit-0.png', 'outfit-1.png', 'outfit-2.png', 'outfit-3.png', 'outfit-4.png', 'outfit-5.png', 'outfit-6.png', 'outfit-7.png'],
  Glasses: ['glasses-0.png', 'glasses-1.png', 'glasses-2.png', 'glasses-3.png', 'glasses-4.png', 'glasses-5.png', 'glasses-6.png', 'glasses-7.png', 'glasses-8.png', 'glasses-9.png', 'glasses-10.png'],
  Hats: ['hat-0.png', 'hat-1.png', 'hat-2.png', 'hat-3.png', 'hat-4.png', 'hat-5.png', 'hat-6.png', 'hat-7.png', 'hat-8.png', 'hat-9.png', 'hat-10.png', 'hat-11.png'],
  Accessories: ['accessory-0.png', 'accessory-1.png', 'accessory-2.png', 'accessory-3.png', 'accessory-4.png', 'accessory-5.png', 'accessory-6.png', 'accessory-7.png', 'accessory-8.png'],
  Hands: ['hands-0.png', 'hands-1.png', 'hands-2.png', 'hands-3.png', 'hands-4.png', 'hands-5.png', 'hands-6.png', 'hands-7.png', 'hands-8.png', 'hands-9.png', 'hands-10.png'],
};

function App() {
  const [selectedLayers, setSelectedLayers] = useState({
    Background: 'background-1.png',
    Face: 'face-1.png',
    Outfit: 'outfit-0.png',
    Glasses: 'glasses-0.png',
    Hats: 'hat-0.png',
    Accessories: 'accessory-0.png',
    Hands: 'hands-0.png',
  });

  const handleLayerChange = (layer, item) => {
    setSelectedLayers((prevState) => ({
      ...prevState,
      [layer]: item,
    }));
  };

  useEffect(() => {
    const imageFilenames = [
      ...Object.values(layers).reduce((acc, val) => acc.concat(val), [])
    ];
    setupThumbnailPreviews(imageFilenames);
  }, []);

  const scrollContainerRefs = useRef({});

  const scrollLeft = (layer) => {
    scrollContainerRefs.current[layer].scrollBy({
      left: -100,
      behavior: 'smooth'
    });
  };

  const scrollRight = (layer) => {
    scrollContainerRefs.current[layer].scrollBy({
      left: 100,
      behavior: 'smooth'
    });
  };

  const randomizeLayers = () => {
    const randomSelection = {};
    for (const layer in layers) {
      const layerItems = layers[layer];
      const randomIndex = Math.floor(Math.random() * layerItems.length);
      randomSelection[layer] = layerItems[randomIndex];
    }
    setSelectedLayers(randomSelection);
  };

  const downloadImage = () => {
    // Functionality to download the generated image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const images = Object.keys(selectedLayers).map((layer) => {
      const image = new Image();
      image.src = `/images/${selectedLayers[layer]}`;
      return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
      });
    });

    Promise.all(images).then((loadedImages) => {
      canvas.width = loadedImages[0].width;
      canvas.height = loadedImages[0].height;
      loadedImages.forEach((image) => {
        ctx.drawImage(image, 0, 0);
      });

      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'my_meme.png';
      link.click();
    });
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="header-container">
          <h1>Ruby Meme Maker</h1>
        </div>
        <div className="character">
          {Object.keys(selectedLayers).map((layer, index) => (
            <img
              key={layer}
              src={`/images/${selectedLayers[layer]}`}
              alt={layer}
              className="layer"
            />
          ))}
          <div className="download-container" style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)' }}>
            <button className="randomize-button" onClick={randomizeLayers}>Randomize</button>
            <button className="download-button" onClick={downloadImage}>Download</button>
          </div>
        </div>
      </div>
      <div className="sidebar">
        <div className="control-group">
        </div>
        {Object.keys(layers).map((layer) => (
          <div key={layer} className="control-group">
            <h3>{layer}</h3>
            <button className="scroll-button left" onClick={() => scrollLeft(layer)}>{"<"}</button>
            <div className="control-group-buttons" ref={(el) => scrollContainerRefs.current[layer] = el}>
              {layers[layer].map((item) => (
                <button key={item} onClick={() => handleLayerChange(layer, item)} className="item">
                  <img src={`/images/${item}`} alt={item} />
                </button>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollRight(layer)}>{">"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
