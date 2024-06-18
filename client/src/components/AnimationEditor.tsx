import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { setSpeed, setScale, setColor } from '../redux/slices/animationSlice';
import { RootState } from '../redux/store';
import LayerManager from './LayerManager';
import FeaturedAnimations from './FeaturedAnimations';
import socket from '../socket';
import './AnimationEditor.css';

const AnimationEditor: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const dispatch = useDispatch();
  const speed = useSelector((state: RootState) => state.animation.speed);
  const scale = useSelector((state: RootState) => state.animation.scale);
  const color = useSelector((state: RootState) => state.animation.color);
  const roomId = '1234';

  useEffect(() => {
    socket.connect();

    socket.emit('join', roomId);

    socket.on('update', (updateData) => {
      setAnimationData((prevData: any) => ({
        ...prevData,
        ...updateData,
      }));
    });

    return () => {
      socket.emit('leave', roomId);
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    socket.on('updateAnimationProperties', (properties) => {
      if (properties.speed !== undefined) {
        dispatch(setSpeed(properties.speed));
      }
      if (properties.scale !== undefined) {
        dispatch(setScale(properties.scale));
      }
      if (properties.color !== undefined) {
        dispatch(setColor(properties.color));
      }
    });

    return () => {
      socket.off('updateAnimationProperties');
    };
  }, [dispatch]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setAnimationData(json);
          socket.emit('update', { roomId, updateData: json });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    dispatch(setSpeed(newSpeed));
    socket.emit('updateAnimationProperties', { roomId, properties: { speed: newSpeed } });
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(event.target.value);
    dispatch(setScale(newScale));
    socket.emit('updateAnimationProperties', { roomId, properties: { scale: newScale } });
  };

  const handleColorChange = (color: any) => {
    const newColor = color.hex;
    dispatch(setColor(newColor));
    socket.emit('updateAnimationProperties', { roomId, properties: { color: newColor } });
    if (animationData) {
      const newAnimationData = { ...animationData };
      newAnimationData.layers.forEach((layer: any) => {
        if (layer.shapes) {
          layer.shapes.forEach((shape: any) => {
            if (shape.it) {
              shape.it.forEach((item: any) => {
                if (item.c) {
                  item.c.k = [
                    parseInt(newColor.slice(1, 3), 16) / 255,
                    parseInt(newColor.slice(3, 5), 16) / 255,
                    parseInt(newColor.slice(5, 7), 16) / 255,
                    1,
                  ];
                }
              });
            }
          });
        }
      });
      setAnimationData(newAnimationData);
    }
  };

  const handleImportAnimation = async (animationUrl: string) => {
    try {
      const response = await fetch(animationUrl);
      const json = await response.json();
      setAnimationData(json);
      socket.emit('update', { roomId, updateData: json });
    } catch (error) {
      console.error('Error importing animation:', error);
    }
  };

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  return (
    <div className="animation-editor">
      <h2>Animation Editor</h2>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      {animationData && (
        <>
          <div className="controls">
            <label>
              Speed:
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={handleSpeedChange}
              />
            </label>
            <label>
              Scale:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
              />
            </label>
            <label>
              Color:
              <SketchPicker color={color} onChangeComplete={handleColorChange} />
            </label>
          </div>
          <div className="animation-container" style={{ transform: `scale(${scale})` }}>
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={true}
              style={{ transform: `scale(${scale})` }}
            />
          </div>
          <LayerManager
            animationData={animationData}
            setAnimationData={setAnimationData}
            roomId={roomId}
          />
        </>
      )}
      <FeaturedAnimations
        onImport={handleImportAnimation}
      />
    </div>
  );
};

export default AnimationEditor;
