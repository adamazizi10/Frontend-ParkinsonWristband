import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import './RegisterPatient.css'
import { Typewriter } from 'react-simple-typewriter'


function RegisterPatient({ onDataReceived, changeState }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState(null);

    const onFirstNameChange = (event) => setFirstName(event.target.value);
    const onLastNameChange = (event) => setLastName(event.target.value);
    const onAgeChange = (event) => setAge(event.target.value);

    const onRegisterClick = (event) => {
        event.preventDefault();

        if (!firstName || !lastName || !age) {
            setError('Please fill in all fields with valid data');
            return;
        }

        if (isNaN(age)) {
            setError('Please enter a number in the age field')
            return;
        }

        fetch('http://localhost:3001/register', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                age: age
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.first_name) {
                    onDataReceived(data)
                    changeState('patientProfile')
                } else {
                    setError('Patient Already Exists, Please Try Again')
                }
            })
            .catch((error) => {
                setError('An error occurred while registering the patient.');
            });
    };
    return (
        <MDBContainer fluid className='p-6 background-radial-gradient overflow-hidden LoginContainer'>

            <MDBRow>
                <div style={{ height: '120px' }}></div>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        <Typewriter
                            words={[
                                "Welcome to the Parkinson's Disease Detection & Simulation Technology",
                                "Our advanced wristband is equipped to detect Parkinson's Disease",
                                "And provide detailed insights, categorizing its severity as Low, Moderate, or High"
                            ]}
                            loop={false}
                            typeSpeed={50}
                            deleteSpeed={20}
                            delaySpeed={2000} />
                    </h1>

                    <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}></p>

                </MDBCol>

                <MDBCol md='6' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'><h2 style={{ marginBottom: '23px', color: '#51565e' }}><b>Add a Patient to Start Detection</b></h2>
                            <MDBInput onChange={onFirstNameChange} wrapperClass='mb-4' label='First Name' id='form1' type='text' />
                            <MDBInput onChange={onLastNameChange} wrapperClass='mb-4' label='Last Name' id='form2' type='text' />
                            <MDBInput onChange={onAgeChange} wrapperClass='mb-4' label='Age' id='form3' type='text' />
                            {error && <div className="alert alert-danger">{error}</div>}
                            <MDBBtn onClick={onRegisterClick} className='w-100 mb-4' size='md'>Add Patient</MDBBtn>
                            <p>Or Access an Exisiting one <a onClick={() => changeState('searchPatient')} href='#'><u>here</u></a></p>
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>
                <div style={{ height: '278px' }}></div>
            </MDBRow>

        </MDBContainer>
    );
}

export default RegisterPatient;