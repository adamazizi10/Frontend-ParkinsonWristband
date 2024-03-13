import React from 'react';
import './PatientDetails.css';

function getStatusLabel(status) {
    switch (status) {
        case "Level 0":
            return "No Parkinson";
        case "Level 1":
            return "Low";
        case "Level 2":
            return "Medium";
        case "Level 3":
            return "High";
        default:
            return status; // Return the status itself if it doesn't match any of the cases
    }
}

function PatientDetails({ dataOfPatient }) {
    // Check if dataOfPatient is defined
    if (!dataOfPatient || !Array.isArray(dataOfPatient.t) || !Array.isArray(dataOfPatient.x) || !Array.isArray(dataOfPatient.y) || !Array.isArray(dataOfPatient.z)) {
        return <div>Loading...</div>;
    }

    const dataRows = [];
    for (let i = 0; i < 5; i++) {
        dataRows.push(
            <tr key={i}>
                <td>{dataOfPatient.x[i]}</td>
                <td>{dataOfPatient.y[i]}</td>
                <td>{dataOfPatient.z[i]}</td>
            </tr>
        );
    }

    return (
        <div className="container">
            <div style={{ color: 'white' }}>
                <h1 style={{ textAlign: 'center' }}>Patient Details</h1><hr />
                <h4 style={{ textAlign: 'center' }}>Name:&nbsp; {dataOfPatient.first_name} {dataOfPatient.last_name}</h4>
                <h4 style={{ textAlign: 'center' }}>Parkinson's Status: {getStatusLabel(dataOfPatient.parkinson_status)}</h4>
                <hr />


            </div>
            <div>
                <h2 style={{ textAlign: 'center', color: 'white' }}>Tremor Results</h2>
                <table className="table-scroll-profile small-first-col">
                    <thead>
                        <tr>
                            <th>x</th>
                            <th>y</th>
                            <th>z</th>
                        </tr>
                    </thead>
                    <tbody className="body-half-screen">
                        {dataOfPatient.parkinson_status === "Not Detected"
                            ? <h3 style={{ marginTop: '10px' }}>No Data</h3>
                            : dataRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientDetails;
