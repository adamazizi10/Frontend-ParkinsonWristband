import React, { useState } from 'react';
import AddPatient from './components/Patient/AddPatient/AddPatient';
import PatientProfile from './components/Patient/PatientProfile/PatientProfile';
import SearchPatient from './components/Patient/SearchPatient/SearchProfile';
import RegisterDoctor from './components/Doctor/RegisterDoctor/RegisterDoctor';
import SignInDoctor from './components/Doctor/RegisterDoctor/SignInDoctor';
import DashboardDoctor from './components/Doctor/RegisterDoctor/DashboardDoctor';

function App() {
  const [currentState, setCurrentState] = useState('signinDoctor');
  const [patientData, setPatientData] = useState(null);
  const [patientFirstAndLastName, setPatientFirstAndLastName] = useState(null)
  const [doctorData, setDoctorData] = useState(null)

  const changeState = (newState) => {
    setCurrentState(newState);
  }
  const onPatientDataRecieved = (data) => {
    setPatientData(data);
  };

  const onPatientFirstAndLastNameRecieved = (data) => {
    setPatientFirstAndLastName(data);
  };

  const onDoctorDataRecieved = (data) => {
    setDoctorData(data);
  };
  
  return (
    <>
      {currentState === 'addPatient' && <AddPatient doctorData={doctorData} patientFirstAndLastName={patientFirstAndLastName} onPatientFirstAndLastNameRecieved={onPatientFirstAndLastNameRecieved} onPatientDataRecieved={onPatientDataRecieved} changeState={changeState} />}
      {currentState === 'patientProfile' && <PatientProfile patientFirstAndLastName={patientFirstAndLastName} onPatientFirstAndLastNameRecieved={onPatientFirstAndLastNameRecieved} patientData={patientData} changeState={changeState} onPatientDataRecieved={onPatientDataRecieved}/>}
      {currentState === 'searchPatient' && <SearchPatient patientFirstAndLastName={patientFirstAndLastName} onPatientFirstAndLastNameRecieved={onPatientFirstAndLastNameRecieved} SignedInDoctorData={doctorData} onPatientDataRecieved={onPatientDataRecieved} changeState={changeState}/>}
      {currentState === 'registerDoctor' && <RegisterDoctor onDoctorDataRecieved={onDoctorDataRecieved} changeState={changeState}/>}
      {currentState === 'signinDoctor' && <SignInDoctor onDoctorDataRecieved={onDoctorDataRecieved} changeState={changeState}/>}
      {currentState === 'dashboardDoctor' && <DashboardDoctor doctorData={doctorData} changeState={changeState}/>}
      
    </>

  );
}

export default App;