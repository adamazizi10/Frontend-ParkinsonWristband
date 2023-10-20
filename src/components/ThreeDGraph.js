import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../App.css'

const Data = {
  t: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  x: [4, 6, 1, 8, 2, 3, 9, 5, 7, 4],
  y: [2, 3, 5, 4, 7, 1, 6, 9, 8, 10],
  z: [7, 9, 2, 6, 3, 8, 4, 1, 5, 3],
};

function ThreeDGraph() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotData, setPlotData] = useState({
    x: [Data.x[currentIndex]],
    y: [Data.y[currentIndex]],
    z: [Data.z[currentIndex]],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < Data.t.length) {
        setCurrentIndex(nextIndex);
        setPlotData({
          x: [Data.x[nextIndex]],
          y: [Data.y[nextIndex]],
          z: [Data.z[nextIndex]],
        });
      }
    }, 1000); // 1-second delay

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div style={{ display: 'flex' }}>
      <div className='first' style={{ flex: 1, marginTop: '450px', marginLeft: '200px'}}>
        <h2>t = {Data.t[currentIndex]}</h2>
      </div>
      <div className='second' style={{ flex: 1 }}>
        <Plot
          data={[
            {
              x: plotData.x,
              y: plotData.y,
              z: plotData.z,
              mode: 'markers',
              type: 'scatter3d',
              marker: {
                size: 12,
                symbol: 'circle',
                opacity: 1,
                color: 'red',
              },
            },
          ]}
          layout={{
            height: 800,
            width: 1200,
            title: `3D Graph`,
            scene: {
              xaxis: { range: [0, Math.max(...Data.x)] },
              yaxis: { range: [0, Math.max(...Data.y)] },
              zaxis: { range: [0, Math.max(...Data.z)] },
            },
          }}
          onRelayout={(figure) => console.log(figure)}
        />
      </div>
    </div>
  );
}

export default ThreeDGraph;
