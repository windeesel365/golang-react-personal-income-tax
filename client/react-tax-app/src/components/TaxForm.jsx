import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';


function TaxForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");  // State for storing error messages

    //hide/show tax level  for checkbox
    const [showTaxLevels, setShowTaxLevels] = useState(false); 

    const onSubmit = data => {
        const payload = {
            totalIncome: parseFloat(data.totalIncome),
            wht: parseFloat(data.wht),
            allowances: [
                {
                    allowanceType: "k-receipt",
                    amount: parseFloat(data.kReceipt)
                },
                {
                    allowanceType: "donation",
                    amount: parseFloat(data.donation)
                }
            ]
        };

        axios.post('http://localhost:8080/tax/calculations', payload)
            .then(response => {
                setResult(response.data);  //update results state with server response
                setErrorMessage(""); //clear any previous errors
            })
            .catch(error => {
                //handle error response ที่มาจาก go server
                const message = error.response && error.response.data && error.response.data.error
                                ? error.response.data.error
                                : "Failed to calculate tax. Please try again.";
                setErrorMessage(message);  //set error message
                setResult(null);  //clear any previous results
            });
    };

    return (
        <div>
            <h1>Personal Income Tax Calculation</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="totalIncome">Total Income:</label>
                    <input id="totalIncome" type="number" step="0.01" {...register('totalIncome', { required: true })} placeholder="Total Income" />
                    {errors.totalIncome && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="wht">Withholding Tax (WHT):</label>
                    <input id="wht" type="number" step="0.01" {...register('wht', { required: true })} placeholder="Withholding Tax" />
                    {errors.wht && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="kReceipt">K-receipt:</label>
                    <input id="kReceipt" type="number" step="0.01" {...register('kReceipt', { required: true })} placeholder="K-receipt" />
                    {errors.kReceipt && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="donation">Donation:</label>
                    <input id="donation" type="number" step="0.01" {...register('donation', { required: true })} placeholder="Donation" />
                    {errors.donation && <span>This field is required</span>}
                </div>
                <button type="submit">Calculate</button>
                <label>
                    <input id="taxlevel"
                        type="checkbox"
                        checked={showTaxLevels}
                        onChange={() => setShowTaxLevels(!showTaxLevels)}
                    />
                    Show Tax Levels
                </label>                
            </form>

            {/*display result + error messages*/}
            {result && (
                <div className="result">
                    <h3>Results:</h3>
                    <ul>
                        {result.totalIncome !== undefined && <li>Total Income: {result.totalIncome.toFixed(2)}</li>}
                        {result.tax !== undefined && <li>Tax: {result.tax.toFixed(2)}</li>}
                        {result.taxRefund !== undefined && <li>Tax Refund: {result.taxRefund.toFixed(2)}</li>}
                        {/* Tax Levels Display */}                      
                        {showTaxLevels && result.taxLevel && result.taxLevel.length > 0 && (
                            <div>
                                <h4>Tax Levels:</h4>
                                {result.taxLevel.map((level, index) => (
                                <li key={index}>
                                    {level.level}: {level.tax.toFixed(2)}
                                </li>
                            ))}
                            </div>
                        )}
                    </ul>
                </div>
            )}

            {errorMessage && (
                <div className="error-message">
                    <h3>Error:</h3>
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
}

export default TaxForm;
