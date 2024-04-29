import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../../../App.css';
import PatientDetails from './PatientDetails';
import { MDBContainer } from 'mdb-react-ui-kit';

const REACT_APP_GET_SPECIFIC_PATIENT_DETAILS = `${process.env.REACT_APP_API_BASE_URL}/get-specific-patient-details/`;
const REACT_APP_EXTRACT_MICROCONTROLLER_DATA = `${process.env.REACT_APP_API_BASE_URL}/extract-microcontroller-data/`;
const REACT_APP_STORE_LAST_SET_OF_DATA = `${process.env.REACT_APP_API_BASE_URL}/store-last-set-of-data/`;

function PatientProfile({ patientData, changeState, onPatientDataRecieved, patientFirstAndLastName }) {
  const fetchController = new AbortController();
  const { signal } = fetchController; // Destructure the signal for ease of use

  const [startDetection, setStartDetection] = useState()
  const [stopDetection, setStopDetection] = useState()
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
    fetch(`${REACT_APP_EXTRACT_MICROCONTROLLER_DATA}${patientData.id}`, { signal })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData && responseData.x !== undefined) {
          console.log(`The response data is: ${JSON.stringify(responseData)}`);
          // Set the current batch to be plotted one by one
          setCurrentBatch({
            x: responseData.x,
            y: responseData.y,
            z: responseData.z
          });
          setBatchIndex(0); // Reset batch index to start plotting new data from start
          setDataFetched(true);
          onPatientDataRecieved(responseData)
          console.log(`fetchingpaused state is: ${fetchingPaused}`)
          if (!fetchingPaused) {
            // If fetching is not paused, continue fetching recursively
            handleFetchMicrocontrollerData();
          }
        } else {
          console.log('No data or undefined Data, recalling handleFetchMicrocontrollerData();')
          handleFetchMicrocontrollerData();
          console.log(`The response data is: ${JSON.stringify(responseData)}`);
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching data:', error);
        }
      });
  };

  const handleStoreLastSetOfDataDueToPauseDetection = () => {
    console.log(`patient id is: ${patientFirstAndLastName.id}`)
    fetch(`${REACT_APP_STORE_LAST_SET_OF_DATA}${patientFirstAndLastName.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data sent successfully:', data);
        // Handle response if needed
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle error if needed
      });
  }

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
      }, 595); // delay to control how fast points are plotted
    }

    //good ones
    // 395 2000
    //595 3000
    return () => clearTimeout(timer);
  }, [fetchingPaused, dataFetched, batchIndex, currentBatch]);

  useEffect(() => {
    if (!fetchingPaused) {
      handleFetchMicrocontrollerData();
    } else {
      handleStoreLastSetOfDataDueToPauseDetection();
      // Abort fetching if component unmounts or fetching is paused
      fetchController.abort();
    }
    return () => {
      if (fetchingPaused || signal) {
        // Abort fetching if component unmounts or fetching is paused
        fetchController.abort();
      }
    };
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

  //layout for still data
  // const layout = {
  //   height: 860,
  //   width: 820,
  //   title: `Tremor Results In 3D`,
  //   scene: {
  //     xaxis: { 
  //       range: [-1, 1],
  //       tickvals: [-1, -0.8, -.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]
  //      },
  //     yaxis: { 
  //       range: [-1, 1],
  //       tickvals: [-1, -0.8, -.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]
  //      },
  //     zaxis: { 
  //       range: [8, 10],
  //       tickvals: [8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10]
  //      },
  //     camera: cameraSettings,
  //   },
  // };

  //layout for max min data
  const layout = {
    height: 860,
    width: 820,
    title: `Tremor Results In 3D`,
    scene: {
      xaxis: {
        range: [Math.min(...allPlotData.x), Math.max(...allPlotData.x)],
      },
      yaxis: {
        range: [Math.min(...allPlotData.y), Math.max(...allPlotData.y)]
      },
      zaxis: {
        range: [Math.min(...allPlotData.z), Math.max(...allPlotData.z)]
      },
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
        <PatientDetails dataOfPatient={patientData} patientFirstAndLastName={patientFirstAndLastName} />
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