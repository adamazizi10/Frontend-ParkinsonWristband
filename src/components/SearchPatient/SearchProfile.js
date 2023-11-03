import React, { useState, useEffect } from 'react';
import '../UserProfile/PatientDetails.css';
import { MDBContainer } from 'mdb-react-ui-kit';

function SearchPatient({ onDataReceived, changeState }) {
    const [patientData, setPatientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Make a GET request to your backend API to fetch the user data
        fetch('http://localhost:3001/get-patient-data')
            .then((response) => response.json())
            .then((data) => {
                setPatientData(data);
                console.log(data)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPatientData = patientData.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            (user.id && user.id.toString().includes(query)) || // Filter by ID
            (user.first_name && user.first_name.toLowerCase().includes(query)) ||
            (user.last_name && user.last_name.toLowerCase().includes(query)) ||
            (user.age && user.age.toString().includes(query)) ||
            (user.parkinson_status && user.parkinson_status.toLowerCase().includes(query))
        );
    });

    const handleViewPatient = (patientId) => {
        // Make a GET request to retrieve patient details using their ID
        fetch(`http://localhost:3001/get-patient-details/${patientId}`)
            .then((response) => response.json())
            .then((data) => {
                // Handle the data received from the backend
                onDataReceived(data);
                changeState('patientProfile');
                // You can update your component's state or take any necessary action here.
                // For example, you can display the patient details in a modal.
            })
            .catch((error) => console.error('Error fetching patient details:', error));
    };

    return (
        <MDBContainer fluid className='background-radial-gradient'>
            <br />
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ marginLeft: '170px',textAlign: 'center', color: 'white', flex: 1 }}>Search a Patient</h1>
                    <a style={{ color: 'white', textDecoration: 'none' }} href="#">
                        <a
                            onClick={() => changeState('registerPatient')}
                            style={{ color: '#22c1c3', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Add a new Patient
                        </a>
                    </a>
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
                            <td>{user.parkinson_status || ''}</td>
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
                    ))}
                </tbody>
            </table>
        </MDBContainer>
    );
}

export default SearchPatient;
