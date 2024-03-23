import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import '../../Patient/AddPatient/AddPatient.css';
import { Typewriter } from 'react-simple-typewriter'
import { motion } from 'framer-motion';

const REACT_APP_SIGNIN_DOCTOR = process.env.REACT_APP_SIGNIN_DOCTOR;

function SignInDoctor({ onDoctorDataRecieved, changeState }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const onEmailChange = (event) => setEmail(event.target.value);
    const onPasswordChange = (event) => setPassword(event.target.value);

    // In SignInDoctor component
    const onSignInClick = (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError('Please fill in both email and password fields.');
            return;
        }

        // Inside onSignInClick function
        fetch(REACT_APP_SIGNIN_DOCTOR, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    setError('Invalid email or password.');
                } else {
                    setError('An error occurred during sign-in.');
                }
            })
            .then((data) => {
                if (data.id) {
                    // Store the doctor's information in your state or context for later use
                    onDoctorDataRecieved(data);
                    changeState('dashboardDoctor');
                }
            })
            .catch((error) => {
                setError('An error occurred while signing in.');
            });

    }

    return (

        <MDBContainer fluid className='p-6 background-radial-gradient overflow-hidden LoginContainer' style={{ height: '100vh' }}>
            <motion.div initial={{ x: 1200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, type: 'spring' }} >
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
                    </MDBCol>


                    <MDBCol md='6' className='position-relative'>
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                        <MDBCard className='my-5 bg-glass'>
                            <MDBCardBody className='p-5'>
                                <h2 style={{ marginBottom: '23px', color: '#51565e' }}>
                                    <b>Physician Sign In</b>
                                </h2>
                                <form onSubmit={onSignInClick}>

                                    <MDBInput onChange={onEmailChange} wrapperClass='mb-4' label='Email' id='form3' type='email' />
                                    <MDBInput onChange={onPasswordChange} wrapperClass='mb-4' label='Password' id='form4' type='password' />
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <MDBBtn onClick={onSignInClick} className='w-100 mb-4' size='md'>
                                        Sign In
                                    </MDBBtn>
                                </form>
                                <p>
                                    New here?
                                    <button onClick={() => changeState('registerDoctor')} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        Register as a Physician
                                    </button>
                                </p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </motion.div>
        </MDBContainer>
    );
}
export default SignInDoctor;
