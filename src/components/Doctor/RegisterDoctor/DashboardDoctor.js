import React, { useState, useEffect } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { FaUserPlus, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter'

function DashboardDoctor({ doctorData, changeState }) {
    const [time_of_day, setTimeOfDay] = useState('');

    useEffect(() => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= 5 && currentHour < 12) {
            setTimeOfDay('Morning');
        } else if (currentHour >= 12 && currentHour < 18) {
            setTimeOfDay('Afternoon');
        } else {
            setTimeOfDay('Evening');
        }
    }, []);
    return (<>
        <MDBContainer fluid className='p-6 background-radial-gradient overflow-hidden LoginContainer' style={{height: '100vh'}}>
            <motion.div initial={{ x: 1200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, type: 'spring' }} >
                <h1 style={{ textAlign: 'center', marginTop: '80px', color: 'white' }}>
                    <Typewriter
                        words={[
                            `Good ${time_of_day}, Dr. ${doctorData.last_name}`
                        ]}
                        loop={1}
                        typeSpeed={60}
                        deleteSpeed={20}
                        delaySpeed={2000} />
                </h1>
                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <div style={{ width: '18rem', margin: '10px' }}>
                        <div style={{ height: '28rem' }} className="card">
                            <FaUserPlus style={{ marginLeft: '20px', width: '250px', height: '300px', color: "#228BE6" }} />
                            <div className="card-body">
                                <h5 className="card-title">Add Patient</h5>
                                <p className="card-text">Add Patient by first name, last name, and age. Start Detection and Analyze Tremor Results.</p>
                                <button onClick={() => changeState('addPatient')} className="btn btn-primary">Add Patient</button>                        </div>
                        </div>
                    </div>
                    <div style={{ width: '18rem', margin: '10px' }}>
                        <div style={{ height: '28rem' }} className="card">
                            <FaSearch style={{ marginLeft: '40px', marginTop: '10px', width: '200px', height: '250px', color: "#228BE6" }} />
                            <div className="card-body">
                                <h5 className="card-title">Search Patient</h5>
                                <p className="card-text">You can search exisiting patients to view their Parkinson's Status and Tremor Results.</p>
                                <button onClick={() => changeState('searchPatient')} className="btn btn-primary">Search Patient</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '18rem', margin: '10px' }}>
                        <div style={{ height: '28rem' }} className="card">
                            <FaUserPlus style={{ marginLeft: '20px', width: '250px', height: '300px', color: "#228BE6" }} />
                            <div className="card-body">
                                <h5 className="card-title">Placeholder</h5>
                                <p className="card-text">This is a Placeholder that will be used in the future for any new pages if needed.</p>
                                <button className="btn btn-primary">Placeholder</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '18rem', margin: '10px' }}>
                        <div style={{ height: '28rem' }} className="card">
                            <FaSignOutAlt style={{ marginLeft: '40px', width: '220px', height: '300px', color: "#228BE6" }} />
                            <div className="card-body">
                                <h5 className="card-title">Logout</h5>
                                <p className="card-text">You can Logout safely and other physicians will not be able to view your patients' confidential details.</p>
                                <button onClick={() => changeState('signinDoctor')} className="btn btn-primary">Logout</button>                        </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </MDBContainer>


    </>);
}


export default DashboardDoctor;
