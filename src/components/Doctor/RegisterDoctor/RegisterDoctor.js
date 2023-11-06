import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import '../../Patient/AddPatient/AddPatient.css';
import { Typewriter } from 'react-simple-typewriter';

function RegisterDoctor({ onDoctorDataRecieved, changeState }) {
    {
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [error, setError] = useState(null);

        const onFirstNameChange = (event) => setFirstName(event.target.value);
        const onLastNameChange = (event) => setLastName(event.target.value);
        const onEmailChange = (event) => setEmail(event.target.value);
        const onPasswordChange = (event) => setPassword(event.target.value);
        const onConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);

        const onRegisterClick = (event) => {
            event.preventDefault();

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                setError('Please fill in all fields with valid data');
                return;
            }

            if (password !== confirmPassword) {
                setError('Password and Confirm Password do not match');
                return;
            }

            // Inside onRegisterClick function
            fetch('http://localhost:3001/registerDoctor', {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.id) {
                        onDoctorDataRecieved(data);
                        changeState('addPatient');
                    } else {
                        setError('Doctor Already Exists, Please Try Again');
                    }
                })
                .catch((error) => {
                    setError('An error occurred while registering the doctor.');
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
                                delaySpeed={2000}
                            />
                        </h1>
                    </MDBCol>

                    <MDBCol md='6' className='position-relative'>
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                        <MDBCard className='my-5 bg-glass'>
                            <MDBCardBody className='p-5'>
                                <h2 style={{ marginBottom: '23px', color: '#51565e' }}>
                                    <b>Add a Physician to Start Detection</b>
                                </h2>
                                <MDBInput onChange={onFirstNameChange} wrapperClass='mb-4' label='First Name' id='form1' type='text' />
                                <MDBInput onChange={onLastNameChange} wrapperClass='mb-4' label='Last Name' id='form2' type='text' />
                                <MDBInput onChange={onEmailChange} wrapperClass='mb-4' label='Email' id='form3' type='email' />
                                <MDBInput onChange={onPasswordChange} wrapperClass='mb-4' label='Password' id='form4' type='password' />
                                <MDBInput onChange={onConfirmPasswordChange} wrapperClass='mb-4' label='Confirm Password' id='form5' type='password' />
                                {error && <div className="alert alert-danger">{error}</div>}
                                <MDBBtn onClick={onRegisterClick} className='w-100 mb-4' size='md'>
                                    Register
                                </MDBBtn>
                                <p>
                                    Already registered?
                                    <button onClick={() => changeState('signinDoctor')} value='searchPatient' style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Sign In Here
                                    </button>
                                </p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <div style={{ height: '278px' }}></div>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default RegisterDoctor;
