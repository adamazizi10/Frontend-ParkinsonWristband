import React from 'react';
import './PatientDetails.css';

function getStatusLabel(status) {
    console.log(`status is: ${status}`);
    // console.log(`type of status is: ${typeof status}`); // "string"
    switch (status.toString()) {
        case "0":
        case '{"0"}':
            return "No Parkinson";
        case "1":
        case '{"1"}':
            return "Low";
        case "2":
        case '{"2"}':
            return "Medium";
        case "3":
        case '{"3"}':
            return "High";
        default:
            return status; // Return the status itself if it doesn't match any of the cases
    }
}



const getStatusColor = (statusLabel) => {
    switch (statusLabel) {
        case "No Parkinson":
            return 'lime';
        case "Low":
            return 'yellow';
        case "Medium":
            return 'orange';
        case "High":
            return 'red';
        default:
            return 'black'; // Default color if status label doesn't match any condition
    }
};

function PatientDetails({ dataOfPatient, patientFirstAndLastName }) {
    // Check if dataOfPatient is defined
    if (!dataOfPatient || !Array.isArray(dataOfPatient.t) || !Array.isArray(dataOfPatient.x) || !Array.isArray(dataOfPatient.y) || !Array.isArray(dataOfPatient.z)) {
        return <div className="container">
            <div style={{ color: 'white' }}>
                <h1 style={{ textAlign: 'center' }}>Patient Details</h1><hr />
                <h4 style={{ textAlign: 'center' }}>Name:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>Parkinson's: </h4><hr />
                <h4 style={{ textAlign: 'center' }}>X Mean:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>Y Mean:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>Z Mean:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>X Std:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>Y Std:</h4><hr />
                <h4 style={{ textAlign: 'center' }}>Z Std:</h4><hr />
            </div>
        </div>;
    }
    // const dataRows = [];
    // for (let i = 0; i < 5; i++) {
    //     dataRows.push(
    //         <tr key={i}>
    //             <td>{dataOfPatient.x[i]}</td>
    //             <td>{dataOfPatient.y[i]}</td>
    //             <td>{dataOfPatient.z[i]}</td>
    //         </tr>
    //     );
    // }

    return ( //patientFirstAndLastName has everything so in the future if we want to display age or something, we can still use patientFirstAndLastName.age
        <div className="container">
            <div style={{ color: 'white' }}>
                <h1 style={{ textAlign: 'center' }}>Patient Details</h1><hr />
                <h4 style={{ textAlign: 'center' }}>Name:&nbsp; {patientFirstAndLastName.first_name || ''} {patientFirstAndLastName.last_name || ''}</h4><hr />
                <h4 style={{ textAlign: 'center', color: getStatusColor(getStatusLabel(dataOfPatient.parkinson_status)) }}>
                    {`Parkinson's: ${getStatusLabel(dataOfPatient.parkinson_status) || ''}`}
                </h4><hr />

                <h4 style={{ textAlign: 'center'}}><span style={{color: 'Cyan'}}>X Mean</span> &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>X Std</span></h4>
                <h4 style={{ textAlign: 'center' }}><span style={{ color: 'Cyan' }}>{dataOfPatient.x_mean ? dataOfPatient.x_mean.toString().slice(0, 8) : ''}</span> &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>{dataOfPatient.x_std ? dataOfPatient.x_std.toString().slice(0, 8) : ''}</span></h4>
                <hr /><br />

                <h4 style={{ textAlign: 'center' }}><span style={{color: 'Cyan'}}>Y Mean</span>  &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>Y Std</span></h4>
                <h4 style={{ textAlign: 'center' }}><span style={{ color: 'Cyan' }}>{dataOfPatient.y_mean ? dataOfPatient.y_mean.toString().slice(0, 8) : ''}</span> &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>{dataOfPatient.y_std ? dataOfPatient.y_std.toString().slice(0, 8) : ''}</span></h4>
                <hr /><br />

                <h4 style={{ textAlign: 'center' }}><span style={{color: 'Cyan'}}>Z Mean</span>  &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>Z Std</span></h4>
                <h4 style={{ textAlign: 'center' }}><span style={{ color: 'Cyan' }}>{dataOfPatient.z_mean ? dataOfPatient.z_mean.toString().slice(0, 8) : ''}</span> &nbsp;+ / -&nbsp; <span style={{ color: 'PaleGreen' }}>{dataOfPatient.z_std ? dataOfPatient.z_std.toString().slice(0, 8) : ''}</span></h4>
                <hr />

            </div>
            {/* <div>
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
            </div> */}
        </div>
    );
}

export default PatientDetails;
