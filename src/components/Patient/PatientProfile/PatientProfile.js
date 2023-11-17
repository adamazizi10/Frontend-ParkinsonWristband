import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import '../../../App.css';
import PatientDetails from './PatientDetails';
import { MDBContainer } from 'mdb-react-ui-kit';

function PatientProfile({ patientData, changeState, onPatientDataRecieved }) {
  const [dataFetched, setDataFetched] = useState(false);
  const [resetPlot, setResetPlot] = useState(false);

  const dataOfPatient = patientData;
  if (!dataOfPatient.x || !dataOfPatient.y || !dataOfPatient.z || !dataOfPatient.t || !dataOfPatient.parkinson_status) {
    patientData.x = [0];
    patientData.y = [0];
    patientData.z = [0];
    patientData.t = [0];
    patientData.parkinson_status = "Not Detected";
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotData, setPlotData] = useState({
    x: [dataOfPatient.x[currentIndex]],
    y: [dataOfPatient.y[currentIndex]],
    z: [dataOfPatient.z[currentIndex]],
  });

  const [cameraSettings, setCameraSettings] = useState({
    up: { x: 0, y: 0, z: 1 },
    center: { x: 0, y: 0, z: 0 },
  });

  const handleViewPatient = () => {
    fetch(`http://localhost:3001/get-specific-patient-details/${dataOfPatient.id}`)
      .then((response) => response.json())
      .then((data) => {
        onPatientDataRecieved(data);
      })
      .catch((error) => console.error('Error fetching patient details:', error));
  };

  const handleFetchMicrocontrollerData = () => {
    fetch(`http://localhost:3001/extract-microcontroller-data/${dataOfPatient.id}`)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          handleViewPatient();
          setResetPlot(true);
          setDataFetched(true) // Set the state to reset the plot
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    if (dataFetched && resetPlot) { // Check if resetPlot is true
      setCurrentIndex(0); // Reset current index
      setPlotData({
        x: [dataOfPatient.x[0]],
        y: [dataOfPatient.y[0]],
        z: [dataOfPatient.z[0]],
      });
      setResetPlot(false); // Reset the state to false after resetting the plot
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
      xaxis: { range: [0, Math.max(...dataOfPatient.x)] },
      yaxis: { range: [0, Math.max(...dataOfPatient.y)] },
      zaxis: { range: [0, Math.max(...dataOfPatient.z)] },
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
          <button type="button" style={{ marginBottom: '10px', marginRight: '10px' }} className="btn btn-primary" onClick={() => handleFetchMicrocontrollerData()}>
            {dataOfPatient.parkinson_status === "Not Detected" ? "Start Detection" : "Redetect"}
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
