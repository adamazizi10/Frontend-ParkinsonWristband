import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../../../App.css';
import PatientDetails from './PatientDetails';
import { MDBContainer } from 'mdb-react-ui-kit';

const REACT_APP_GET_SPECIFIC_PATIENT_DETAILS = process.env.REACT_APP_GET_SPECIFIC_PATIENT_DETAILS;
const REACT_APP_EXTRACT_MICROCONTROLLER_DATA = process.env.REACT_APP_EXTRACT_MICROCONTROLLER_DATA;

function PatientProfile({ patientData, changeState, onPatientDataRecieved }) {
  const [dataFetched, setDataFetched] = useState(false);
  const [resetPlot, setResetPlot] = useState(false);
  const [fetchingInterval, setFetchingInterval] = useState(null);
  const [fetchingPaused, setFetchingPaused] = useState(true); // Initially paused

  const dataOfPatient = patientData;
  if (!dataOfPatient.x || !dataOfPatient.y || !dataOfPatient.z || !dataOfPatient.t || !dataOfPatient.parkinson_status) {
    patientData.x = [0];
    patientData.y = [0];
    patientData.z = [0];
    patientData.t = [0];
    patientData.parkinson_status = "Not Detected";
    // add extra features here
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotData, setPlotData] = useState({
    x: [dataOfPatient.x[currentIndex]],
    y: [dataOfPatient.y[currentIndex]],
    z: [dataOfPatient.z[currentIndex]],
  });

  const [cameraSettings, setCameraSettings] = useState({
    up: { x: 0, y: 0, z: 1 }, // Z-axis is up
    center: { x: 0, y: 0, z: 0 }, // Focuses on the center of the plot
    eye: { x: 1.5, y: -1.5, z: 0.5 } // Adjusts the camera to a side view
  });
  
  

  const toggleFetching = () => {
    setFetchingPaused(prevState => !prevState); // Toggle fetchingPaused state
  };

  const handleViewPatient = () => {
    fetch(`${REACT_APP_GET_SPECIFIC_PATIENT_DETAILS}${dataOfPatient.id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        onPatientDataRecieved(data);

      })
      .catch((error) => console.error('Error fetching patient details:', error));
  };

  const handleFetchMicrocontrollerData = () => {
    fetch(`${REACT_APP_EXTRACT_MICROCONTROLLER_DATA}${dataOfPatient.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Page not found or cannot be accessed and database empty');
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData) {

          // handleViewPatient();
          onPatientDataRecieved(responseData);
          setResetPlot(true);
          setDataFetched(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
      });
  };

  const handleStopMicrocontrollerData = () => {
    fetch(`${REACT_APP_EXTRACT_MICROCONTROLLER_DATA}${dataOfPatient.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: 'Stop' }) // Sending the string "Stop" as JSON data
    })
    .then(response => {
      // Handle response here
      console.log('Request sent:', response);
    })
    .catch(error => {
      // Handle error here
      console.error('Error sending request:', error);
    });
  };

  useEffect(() => {
    if (!fetchingPaused) {
      const timer = setInterval(() => {
        handleFetchMicrocontrollerData();
      }, 5000); // Fetch every 5 seconds
  
      setFetchingInterval(timer);
  
      return () => clearInterval(timer);
    } else {
      clearInterval(fetchingInterval); // Clear interval if fetching is paused
      handleStopMicrocontrollerData(); // Call handleStopMicrocontrollerData when fetching is paused
    }
  }, [fetchingPaused]);
  
  

  useEffect(() => {
    if (dataFetched && resetPlot) {
      setCurrentIndex(0);
      setPlotData({
        x: [dataOfPatient.x[0]],
        y: [dataOfPatient.y[0]],
        z: [dataOfPatient.z[0]],
      });
      setResetPlot(false);
    }

    if (dataFetched && !resetPlot) {
      const timer = setInterval(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < dataOfPatient.t.length) {
          setCurrentIndex(nextIndex);
          setPlotData({
            x: [...plotData.x, dataOfPatient.x[nextIndex]],
            y: [...plotData.y, dataOfPatient.y[nextIndex]],
            z: [...plotData.z, dataOfPatient.z[nextIndex]],
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentIndex, dataFetched, dataOfPatient.t.length, dataOfPatient.x, dataOfPatient.y, dataOfPatient.z, plotData, resetPlot]);

  const lineTrace = {
    x: plotData.x,
    y: plotData.y,
    z: plotData.z,
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
      xaxis: { range: [Math.min(dataOfPatient.x), Math.max(...dataOfPatient.x)] },
      yaxis: { range: [Math.min(dataOfPatient.y), Math.max(...dataOfPatient.y)] },
      zaxis: { range: [Math.min(dataOfPatient.z), Math.max(...dataOfPatient.z)] },
      camera: cameraSettings,
    },
  };

  return (
    <MDBContainer
      style={{ display: 'flex', padding: '0', height: '100vh' }}
      fluid
      className=' background-radial-gradient overflow-hidden ProfilePageContainer'
    >
      <div style={{ backgroundColor: 'white' }}>
        <Plot
          key={currentIndex}
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
        <PatientDetails dataOfPatient={dataOfPatient} />
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'white' }}>
          <button type="button" style={{ marginBottom: '10px', marginRight: '10px' }} className="btn btn-primary" onClick={toggleFetching}>
            {fetchingPaused ? "Start Detection" : "Pause Detection"}
          </button>
          <button type="button" style={{ marginBottom: '10px' }} className="btn btn-primary" onClick={() => changeState('dashboardDoctor')}>
            Dashboard
          </button>
        </div>

      </div>
    </MDBContainer>
  );
}

export default PatientProfile;
















