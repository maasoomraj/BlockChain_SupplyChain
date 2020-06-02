import React from 'react';

const Transaction = ({transaction})  => {
    const { id, input, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div>
            <div className = 'Transaction'>
                <div> ID : "{id}" </div>
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