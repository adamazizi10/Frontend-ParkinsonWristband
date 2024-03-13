import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../../../App.css';
import PatientDetails from './PatientDetails';
import { MDBContainer } from 'mdb-react-ui-kit';

const REACT_APP_GET_SPECIFIC_PATIENT_DETAILS = process.env.REACT_APP_GET_SPECIFIC_PATIENT_DETAILS;
const REACT_APP_EXTRACT_MICROCONTROLLER_DATA = process.env.REACT_APP_EXTRACT_MICROCONTROLLER_DATA;

function PatientProfile({ patientData, changeState, onPatientDataRecieved }) {
  const [dataFetched, setDataFetched] = useState(false);
  const [fetchingPaused, setFetchingPaused] = useState(true); // Initially paused
  const [allPlotData, setAllPlotData] = useState({
    x: patientData.x || [],
    y: patientData.y || [],
    z: patientData.z || [],
  });
  const [currentBatch, setCurrentBatch] = useState({ x: [], y: [], z: [] });
  const [batchIndex, setBatchIndex] = useState(0);

  const [cameraSettings, setCameraSettings] = useState({
    up: { x: 0, y: 0, z: 1 }, // Z-axis is up
    center: { x: 0, y: 0, z: 0 }, // Focuses on the center of the plot
    eye: { x: 1.5, y: -1.5, z: 0.5 } // Adjusts the camera to a side view
  });

  const toggleFetching = () => {
    setFetchingPaused(prevState => !prevState); // Toggle fetchingPaused state
  };

  const handleFetchMicrocontrollerData = () => {
    fetch(`${REACT_APP_EXTRACT_MICROCONTROLLER_DATA}${patientData.id}`)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          console.log(`The response data is x: ${responseData.x}`)
          console.log(`The response data is: ${responseData}`)
          // Set the current batch to be plotted one by one
          setCurrentBatch({
            x: responseData.x,
            y: responseData.y,
            z: responseData.z,
          });
          setBatchIndex(0); // Reset batch index to start plotting new data from start
          setDataFetched(true);
          onPatientDataRecieved(responseData)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    let timer;
    if (!fetchingPaused && dataFetched && batchIndex < currentBatch.x.length) {
      // Plot one point from the batch every second
      timer = setTimeout(() => {
        setAllPlotData(prevData => ({
          x: [...prevData.x, currentBatch.x[batchIndex]],
          y: [...prevData.y, currentBatch.y[batchIndex]],
          z: [...prevData.z, currentBatch.z[batchIndex]],
        }));
        setBatchIndex(batchIndex + 1);
      }, 850); // Adjust this delay to control how fast points are plotted
    }

    return () => clearTimeout(timer);
  }, [fetchingPaused, dataFetched, batchIndex, currentBatch]);

  useEffect(() => {
    if (!fetchingPaused) {
      const timer = setInterval(() => {
        handleFetchMicrocontrollerData();
      }, 4000); // Adjust timing as necessary

      return () => clearInterval(timer);
    }
  }, [fetchingPaused]);

  const lineTrace = {
    x: allPlotData.x,
    y: allPlotData.y,
    z: allPlotData.z,
    mode: 'lines+markers',
    type: 'scatter3d',
    line: {
      color: 'blue',
      width: 2,
    },
    marker: {
      size: 12,
      symbol: 'circle',
      opacity: 1,
      color: 'red',
    },
  };

  const layout = {
    height: 860,
    width: 820,
    title: `Tremor Results In 3D`,
    scene: {
      xaxis: { range: [Math.min(...allPlotData.x), Math.max(...allPlotData.x)] },
      yaxis: { range: [Math.min(...allPlotData.y), Math.max(...allPlotData.y)] },
      zaxis: { range: [Math.min(...allPlotData.z), Math.max(...allPlotData.z)] },
      camera: cameraSettings,
    },
  };

  return (
    <MDBContainer
      style={{ display: 'flex', padding: '0', height: '100vh' }}
      fluid
      className='background-radial-gradient overflow-hidden ProfilePageContainer'
    >
      <div style={{ backgroundColor: 'white' }}>
        <Plot
          data={[lineTrace]}
          layout={layout}
          onRelayout={(figure) => {
            if (figure.scene && figure.scene.camera) {
              setCameraSettings(figure.scene.camera);
            }
          }}
        />
      </div>
      <div style={{ marginLeft: '180px' }}>
        <PatientDetails dataOfPatient={patientData} />
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'white' }}>
          <button type="button" className="btn btn-primary" onClick={toggleFetching} style={{ marginBottom: '10px', marginRight: '10px' }}>
            {fetchingPaused ? "Start Detection" : "Pause Detection"}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => changeState('dashboardDoctor')} style={{ marginBottom: '10px' }}>
            Dashboard
          </button>
        </div>
      </div>
    </MDBContainer>
  );
}

export default PatientProfile;
