import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../../App.css';
import PatientDetails from './PatientDetails';
import { MDBContainer } from 'mdb-react-ui-kit';

function UserProfile({ userData, changeState }) {
  const [data, setData] = useState({
    t: [],
    x: [],
    y: [],
    z: [],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotData, setPlotData] = useState({
    x: [data.x[currentIndex]],
    y: [data.y[currentIndex]],
    z: [data.z[currentIndex]],
  });

  const [dataFetched, setDataFetched] = useState(false);

  const [cameraSettings, setCameraSettings] = useState({
    up: { x: 0, y: 0, z: 1 }, // Define the up direction
    center: { x: 0, y: 0, z: 0 }, // Define the camera center point
  });

  useEffect(() => {
    // Fetch data from the backend server
    fetch('http://localhost:3001/extract-data')
      .then((response) => response.json())
      .then((responseData) => {
        // Update the state with the fetched data
        setData({
          t: responseData.t,
          x: responseData.x,
          y: responseData.y,
          z: responseData.z,
        });
        setDataFetched(true); // Signal that data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (dataFetched) {
      const timer = setInterval(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < data.t.length) {
          setCurrentIndex(nextIndex);
          setPlotData({
            x: [...plotData.x, data.x[nextIndex]],
            y: [...plotData.y, data.y[nextIndex]],
            z: [...plotData.z, data.z[nextIndex]],
          });
        }
      }, 1000); // 1-second delay

      return () => clearInterval(timer);
    }
  }, [currentIndex, dataFetched, data.t.length, data.x, data.y, data.z, plotData]);

  const lineTrace = {
    x: plotData.x,
    y: plotData.y,
    z: plotData.z,
    mode: 'lines+markers', // Display both lines and markers
    type: 'scatter3d',
    line: {
      color: 'blue', // Color of the line
      width: 2, // Width of the line
    },
    marker: {
      size: 12,
      symbol: 'circle',
      opacity: 1,
      color: 'red',
    },
  };

  const layout = {
    height: 820,
    width: 820,
    title: `Tremor Results In 3D`,
    scene: {
      xaxis: { range: [0, Math.max(...data.x)] },
      yaxis: { range: [0, Math.max(...data.y)] },
      zaxis: { range: [0, Math.max(...data.z)] },
      camera: cameraSettings, // Set camera settings
    },
  };

  return (
    <MDBContainer
      style={{ display: 'flex', padding: '0' }}
      fluid
      className=' background-radial-gradient overflow-hidden ProfilePageContainer'
    >
      <div>
        {dataFetched ? (
          <Plot
            data={[lineTrace]}
            layout={layout}
            onRelayout={(figure) => {
              if (figure.scene && figure.scene.camera) {
                // Update the camera settings
                setCameraSettings(figure.scene.camera);
              }
            }}
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div style={{ marginLeft: '180px' }}>
        <PatientDetails userData={userData} Data={data} />
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'white' }}>
          <span style={{color: 'white' }} >Add a <a onClick={() => changeState('registerPatient')} style={{color: '#22c1c3'}} href='#'><u>new Patient</u></a></span>
          <a style={{color: 'white' }} href='#'> or <a onClick={() => changeState('searchPatient')} style={{color: '#22c1c3'}} href='#'><u>Search</u></a> an Exisiting One</a>
        </div>
      </div>

    </MDBContainer>
  );
}

export default UserProfile;
