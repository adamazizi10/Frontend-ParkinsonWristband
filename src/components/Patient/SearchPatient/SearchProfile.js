import React, { useState, useEffect } from 'react';
import '../PatientProfile/PatientDetails.css';
import { MDBContainer } from 'mdb-react-ui-kit';

function SearchPatient({ onPatientDataRecieved, changeState, SignedInDoctorData }) {
    const [patientData, setPatientData] = useState([]);
    const [doctorData, setDoctorData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/get-all-patient-data')
            .then((response) => response.json())
            .then((data) => {
                setPatientData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/get-all-doctor-data')
            .then((response) => response.json())
            .then((data) => {
                setDoctorData(data);
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            });
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPatientData = patientData.map((patient) => {
        const doctor = doctorData.find((doc) => doc.id === patient.doctor_id);
        const physicianName = doctor ? `${doctor.first_name} ${doctor.last_name}` : '';
        const isPhysician = doctor && doctor.id === SignedInDoctorData.id;

        return {
            ...patient,
            physicianName,
            isPhysician,
        };
    }).filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            (user.id && user.id.toString().includes(query)) ||
            (user.first_name && user.first_name.toLowerCase().includes(query)) ||
            (user.last_name && user.last_name.toLowerCase().includes(query)) ||
            (user.age && user.age.toString().includes(query)) ||
            (user.parkinson_status && (user.isPhysician ? user.parkinson_status : 'private').toLowerCase().includes(query)) ||
            (user.physicianName && user.physicianName.toLowerCase().includes(query))
        );
    });

    const handleViewPatient = (patientId) => {
        fetch(`http://localhost:3001/get-specific-patient-details/${patientId}`)
            .then((response) => response.json())
            .then((data) => {
                onPatientDataRecieved(data);
                changeState('patientProfile');
            })
            .catch((error) => console.error('Error fetching patient details:', error));
    };

    return (
        <MDBContainer fluid className='background-radial-gradient'>
            <br />
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ marginLeft: '158px', textAlign: 'center', color: 'white', flex: 1 }}>Search a Patient</h1>
                    <div style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                        <div onClick={() => changeState('dashboardDoctor')} style={{ color: '#22c1c3', textDecoration: 'underline' }}>
                            Go to Dashboard
                        </div>
                    </div>
                </div>
                <div>
                    <div className="input-group rounded">
                        <input
                            style={{ margin: '0' }}
                            type="search"
                            className="form-control rounded searchBarPatient"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                </div>
            </div>
            <br />
            <table className="table-scroll small-first-col">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Parkinson's Status</th>
                        <th>Patient's Physician</th>
                        <th>View Patient</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatientData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id || ''}</td>
                            <td>{user.first_name || ''}</td>
                            <td>{user.last_name || ''}</td>
                            <td>{user.age || ''}</td>
                            <td>{user.isPhysician ? user.parkinson_status : 'private'}</td>
                            {/* <td>{user.parkinson_status}</td> */}
                            <td>Dr. {user.physicianName || ''}</td>
                            <td>
                                {user.isPhysician
                                    ? <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleViewPatient(user.id)}
                                    >
                                        View Patient
                                    </button>

                                    : <button
                                        type="button"
                                        className="btn btn-secondary"
                                    >
                                        Private
                                    </button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MDBContainer>
    );
}

export default SearchPatient;
