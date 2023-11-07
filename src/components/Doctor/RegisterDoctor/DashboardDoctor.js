import React, { useState, useEffect } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { FaUserPlus, FaSignOutAlt, FaSearch } from 'react-icons/fa';

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
        <MDBContainer fluid className='p-6 background-radial-gradient overflow-hidden LoginContainer'>
            <h1 style={{ textAlign: 'center', marginTop: '80px', color: 'white' }}>Good {time_of_day}, Dr. {doctorData.last_name}</h1>
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ width: '18rem', margin: '10px' }}>
                    <div style={{ height: '28rem' }} class="card">
                        <FaUserPlus style={{ marginLeft: '20px', width: '250px', height: '300px', color: "#228BE6" }} />
                        <div class="card-body">
                            <h5 class="card-title">Add Patient</h5>
                            <p class="card-text">Add Patient by first name, last name, and age. Start Detection and Analyze Tremor Results.</p>
                            <button onClick={() => changeState('addPatient')} class="btn btn-primary">Add Patient</button>                        </div>
                    </div>
                </div>
                <div style={{ width: '18rem', margin: '10px' }}>
                    <div style={{ height: '28rem' }} class="card">
                        <FaSearch style={{ marginLeft: '40px', marginTop: '10px', width: '200px', height: '250px', color: "#228BE6" }} />
                        <div class="card-body">
                            <h5 class="card-title">Search Patient</h5>
                            <p class="card-text">You can also search exisiting patients to view their Parkinson's Status and Tremor Results</p>
                            <button onClick={() => changeState('searchPatient')} class="btn btn-primary">Search Patient</button>
                        </div>
                    </div>
                </div>
                <div style={{ width: '18rem', margin: '10px' }}>
                    <div style={{ height: '28rem' }} class="card">
                        <FaUserPlus style={{ marginLeft: '20px', width: '250px', height: '300px', color: "#228BE6" }} />
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <button class="btn btn-primary">Go somewhere</button>
                        </div>
                    </div>
                </div>
                <div style={{ width: '18rem', margin: '10px' }}>
                    <div style={{ height: '28rem' }} class="card">
                        <FaSignOutAlt style={{ marginLeft: '40px', width: '220px', height: '300px', color: "#228BE6" }} />
                        <div class="card-body">
                            <h5 class="card-title">Logout</h5>
                            <p class="card-text">You can Logout safely and other physicians will not be able to view your patients' confidential details.</p>
                            <button onClick={() => changeState('signinDoctor')} class="btn btn-primary">Logout</button>                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '192px' }}></div>
        </MDBContainer>


    </>);
}


export default DashboardDoctor;
