import React, { useState } from 'react';
import axios from 'axios';

function CsvUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [results, setResults] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('taxFile', file);

        axios.post('http://localhost:8080/tax/calculations/upload-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setMessage('File uploaded successfully');
            setResults(response.data);  //เก็บ results จาก go backend
        })
        .catch(error => {
            //handle more specific error information from go backend (if available
            const serverErrorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to upload file. Please try again.';
            setMessage(serverErrorMessage);
            setResults(null); //clear previous results on error (ถ้ามี)
        });
    };

    return (
        <div>
            <h1>Upload CSV File</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}

            {results && (
                <div>
                    <h2>Upload Results</h2>
                    <ul>
                        {results.taxes && results.taxes.map((taxInfo, index) => (
                            <li key={index}>
                                Total Income: {taxInfo.totalIncome.toFixed(2)}, 
                                Tax: {taxInfo.tax.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CsvUpload;
