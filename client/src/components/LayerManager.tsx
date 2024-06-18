import React, { useState, useEffect } from 'react';
import './LayerManager.css';
import socket from '../socket';

interface Layer {
  ind: number;
  nm: string;
}

interface AnimationData {
  layers: Layer[];
}

interface LayerManagerProps {
  animationData: AnimationData;
  setAnimationData: (data: AnimationData | ((prevData: AnimationData) => AnimationData)) => void;
  roomId: string;
}

const LayerManager: React.FC<LayerManagerProps> = ({ animationData, setAnimationData, roomId }) => {
  const [selectedLayers, setSelectedLayers] = useState<number[]>([]);

  useEffect(() => {
    socket.on('updateLayerManagement', (layers: Layer[]) => {
      setAnimationData((prevData) => ({
        ...prevData,
        layers,
      }));
    });

    return () => {
      socket.off('updateLayerManagement');
    };
  }, [setAnimationData]);

  const handleLayerSelect = (layerInd: number) => {
    setSelectedLayers((prevSelectedLayers) =>
      prevSelectedLayers.includes(layerInd)
        ? prevSelectedLayers.filter((ind) => ind !== layerInd)
        : [...prevSelectedLayers, layerInd]
    );
  };

  const removeSelectedLayers = () => {
    const updatedLayers = animationData.layers.filter(
      (layer) => !selectedLayers.includes(layer.ind)
    );
    setAnimationData({
      ...animationData,
      layers: updatedLayers,
    });
    socket.emit('updateLayerManagement', { roomId, layers: updatedLayers });
    setSelectedLayers([]);
  };

  return (
    <div>
      <h3>Layer Manager</h3>
      <ul>
        {animationData.layers.map((layer) => (
          <li key={layer.ind}>
            <label>
              <input
                type="checkbox"
                checked={selectedLayers.includes(layer.ind)}
                onChange={() => handleLayerSelect(layer.ind)}
              />
              {layer.nm}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={removeSelectedLayers} disabled={selectedLayers.length === 0}>
        Remove Selected Layers
      </button>
    </div>
  );
};

export default LayerManager;
