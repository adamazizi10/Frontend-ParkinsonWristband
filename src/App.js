import React, { useState } from 'react';
import RegisterPatient from './components/RegisterPatient/RegisterPatient';
import UserProfile from './components/UserProfile/UserProfile';
import SearchPatient from './components/SearchPatient/SearchProfile';

function App() {
  const [currentState, setCurrentState] = useState('registerPatient');
  const [userData, setUserData] = useState(null);

  const changeState = (newState) => {
    setCurrentState(newState);
  }
  const onDataReceived = (data) => {
    setUserData(data);
  };

  return (
    <>
      {currentState === 'registerPatient' && <RegisterPatient onDataReceived={onDataReceived} changeState={changeState} />}
      {currentState === 'patientProfile' && <UserProfile userData={userData} changeState={changeState}/>}
      {currentState === 'searchPatient' && <SearchPatient onDataReceived={onDataReceived} changeState={changeState}/>}
    </>

  );
}

export default App;