import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import './AddPatient.css'
import { Typewriter } from 'react-simple-typewriter'
import { motion } from "framer-motion";

const REACT_APP_ADD_PATIENT = process.env.REACT_APP_ADD_PATIENT;

function AddPatient({ onPatientDataRecieved, changeState, doctorData }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState(null);

    const onFirstNameChange = (event) => setFirstName(event.target.value);
    const onLastNameChange = (event) => setLastName(event.target.value);
    const onAgeChange = (event) => setAge(event.target.value);

    // function randomParkinsonStatus() {
    //     const letters = ['none', 'low', 'moderate', 'high'];
    //     const randomIndex = Math.floor(Math.random() * letters.length);
    //     return letters[randomIndex];
    // }

    const onRegisterClick = (event) => {
        event.preventDefault();

        if (!firstName || !lastName || !age) {
            setError('Please fill in all fields with valid data');
            return;
        }

        if (isNaN(age)) {
            setError('Please enter a number in the age field');
            return;
        }

        // Pass the doctor's ID received from onDoctorDataReceived
        fetch(REACT_APP_ADD_PATIENT, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                age: age,
                // parkinson_status: randomParkinsonStatus(),
                doctor_id: doctorData.id // Replace 'doctorId' with the actual variable that holds the doctor's ID
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.first_name) {
                    onPatientDataRecieved(data);
                    changeState('patientProfile');
                } else {
                    setError('Patient Already Exists, Please Try Again');
                }
            })
            .catch((error) => {
                setError('An error occurred while registering the patient.');
            });
    };
    return (
        <MDBContainer fluid className='p-6 background-radial-gradient overflow-hidden LoginContainer' style={{ height: '100vh' }}>
            <motion.div initial={{ x: 1200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, type: 'spring' }} style={{ display: 'flex', marginTop: '65px', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ width: '75%' }}>

                    <MDBCard className='mx-5 mb-5 shadow-5' style={{ marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', paddingTop: '15px', paddingLeft: '30px', paddingRight: '30px' }}>
                        <MDBCardBody className='pt-5' style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                            <h2 style={{ marginBottom: '23px', color: '#51565e', textAlign: 'center' }}>
                                <Typewriter
                                    words={[
                                        "Add a Patient to Start Detection and Simulation"
                                    ]}
                                    loop={1}
                                    typeSpeed={40}
                                    deleteSpeed={20}
                                    delaySpeed={2000} /></h2>
                            <MDBInput onChange={onFirstNameChange} wrapperClass='mb-4' label='First Name' id='form1' type='text' />
                            <MDBInput onChange={onLastNameChange} wrapperClass='mb-4' label='Last Name' id='form2' type='text' />
                            <MDBInput onChange={onAgeChange} wrapperClass='mb-4' label='Age' id='form3' type='text' />
                            {error && <div className="alert alert-danger">{error}</div>}
                            <MDBBtn onClick={onRegisterClick} className='w-100' size='md'>Add Patient</MDBBtn>
                            <p>or go to
                                <button onClick={() => changeState('dashboardDoctor')} value='searchPatient' style={{ marginTop: '20px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Dashboard</button>
                            </p>
                        </MDBCardBody>
                    </MDBCard>
                </div>
            </motion.div>
        </MDBContainer>


    );
}

export default AddPatient;

