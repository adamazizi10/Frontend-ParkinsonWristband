import React, { useState, useEffect } from 'react';
import '../PatientProfile/PatientDetails.css';
import { MDBContainer } from 'mdb-react-ui-kit';

const REACT_APP_GET_ALL_PATIENT_DATA = process.env.REACT_APP_GET_ALL_PATIENT_DATA;
const REACT_APP_GET_SPECIFIC_PATIENT_DETAILS = process.env.REACT_APP_GET_SPECIFIC_PATIENT_DETAILS;
const REACT_APP_GET_ALL_DOCTOR_DATA = process.env.REACT_APP_GET_ALL_DOCTOR_DATA;

function SearchPatient({ onPatientDataRecieved, changeState, SignedInDoctorData }) {
    const [patientData, setPatientData] = useState([]);
    const [doctorData, setDoctorData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterList, setFilterList] = useState('All');

    useEffect(() => {
        fetch(REACT_APP_GET_ALL_PATIENT_DATA)
            .then((response) => response.json())
            .then((data) => {
                setPatientData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch(REACT_APP_GET_ALL_DOCTOR_DATA)
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

    const handleFilterChange = (event) => {
        setFilterList(event.target.value);
    };

    const handleViewPatient = (patientId) => {
        fetch(`${REACT_APP_GET_SPECIFIC_PATIENT_DETAILS}${patientId}`)
            .then((response) => response.json())
            .then((data) => {
                onPatientDataRecieved(data);
                changeState('patientProfile');
            })
            .catch((error) => console.error('Error fetching patient details:', error));
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
        if (filterList === "Doctor'sPatient") {
            return user.isPhysician && (
                (user.id && user.id.toString().includes(query)) ||
                (user.first_name && user.first_name.toLowerCase().includes(query)) ||
                (user.last_name && user.last_name.toLowerCase().includes(query)) ||
                (user.age && user.age.toString().includes(query)) ||
                (user.parkinson_status && user.parkinson_status.toLowerCase().includes(query)) ||
                (user.physicianName && user.physicianName.toLowerCase().includes(query))
            );
        } else {
            return (
                (user.id && user.id.toString().includes(query)) ||
                (user.first_name && user.first_name.toLowerCase().includes(query)) ||
                (user.last_name && user.last_name.toLowerCase().includes(query)) ||
                (user.age && user.age.toString().includes(query)) ||
                (user.parkinson_status && (user.isPhysician ? user.parkinson_status : 'private').toLowerCase().includes(query)) ||
                (user.physicianName && user.physicianName.toLowerCase().includes(query))
            );
        }
    });

    return (

        <MDBContainer fluid className='background-radial-gradient' style={{ minHeight: '100vh' }}>
            <br />
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                        <div onClick={() => changeState('dashboardDoctor')} style={{ color: '#22c1c3', textDecoration: 'underline' }}>Dashboard</div>
                    </div>
                    <h1 style={{ marginLeft: '120px', textAlign: 'center', color: 'white', flex: 1 }}>Search a Patient</h1>
                    <div style={{ color: 'white' }}>
                        <div><b>Physician:</b> Dr. {SignedInDoctorData.last_name}</div>
                    </div>
                </div>
                <div>
                    <div className="input-group rounded">
                        <input
                            style={{
                                margin: '0',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white'

                            }}
                            id='custom-input'
                            type="search"
                            className="form-control rounded searchBarPatient"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div id='filterSelect' style={{ marginLeft: 'auto', marginTop: '10px', marginBottom: '10px' }}>
                            <select value={filterList} onChange={handleFilterChange}>
                                <option value="All">All</option>
                                <option value="Doctor'sPatient">Doctor's Patients</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

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
                    {filterList === "Doctor'sPatient" ?
                        filteredPatientData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id || ''}</td>
                                <td>{user.first_name || ''}</td>
                                <td>{user.last_name || ''}</td>
                                <td>{user.age || ''}</td>
                                <td>{user.parkinson_status}</td>
                                <td>Dr. {user.physicianName || ''}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleViewPatient(user.id)}
                                    >
                                        View Patient
                                    </button>
                                </td>
                            </tr>
                        )) :
                        filteredPatientData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id || ''}</td>
                                <td>{user.first_name || ''}</td>
                                <td>{user.last_name || ''}</td>
                                <td>{user.age || ''}</td>
                                <td>{user.isPhysician ? user.parkinson_status : 'private'}</td>
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
                        ))
                    }
                </tbody>
            </table>
        </MDBContainer>


    );
}

export default SearchPatient;
