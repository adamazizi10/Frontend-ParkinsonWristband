import React from 'react';
import './PatientDetails.css';

function PatientDetails({ Data, patientData }) {
    
    const dataRows = [];
    for (let i = 0; i < 10; i++) {
        dataRows.push(
            <tr key={i}>
                <td>{Data.t[i]}</td>
                <td>{Data.x[i]}</td>
                <td>{Data.y[i]}</td>
                <td>{Data.z[i]}</td>
            </tr>
        );
    }

    return (
        <div className="container">
            <div style={{ color: 'white' }}>
                <h1 style={{ textAlign: 'center' }}>Patient Details</h1><hr />
                <h4 style={{ textAlign: 'center' }}>Name:&nbsp; {patientData.first_name} {patientData.last_name}</h4>
                <h4 style={{ textAlign: 'center' }}>Parkinson's Status: {patientData.parkinson_status}</h4><hr /><br />
            </div>
            <div>
                <h2 style={{ textAlign: 'center', color: 'white' }}>Tremor Results</h2>
                <table className="table-scroll-profile small-first-col">
                    <thead>
                        <tr>
                            <th>T</th>
                            <th>x</th>
                            <th>y</th>
                            <th>z</th>
                        </tr>
                    </thead>
                    <tbody className="body-half-screen">
                        {dataRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientDetails;
