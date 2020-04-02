import React from 'react';
import Navigation from './Navigation';

const Transaction = ({transaction})  => {
    const { input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div>
            <Navigation />
            <div className = 'Transaction'>
                <div>From : "{input.address.substring(0,50)}" | Balance: {input.amount} </div>
                {
                    recipients.map(recipient => (
                            <div key={recipient}>
                                To: "{recipient.substring(0,50)}" | Sent: {outputMap[recipient]}
                            </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Transaction;