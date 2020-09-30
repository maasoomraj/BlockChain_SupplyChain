import React from 'react';

const Transaction = ({ transaction }) => {
  const { id, input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  let outputMapAray = recipients.map((recipient) => {
    return (
      <div key={recipient}>
        To: {recipient.substring(0, 50)} | Sent: {outputMap[recipient]}
      </div>
    );
  });

  return (
    <div>
      <div className="Transaction">
        {input.address === '**authorised-sender-account**' ? (
          <div>
            <div> ID : {id} | PRODUCT SHIPMENT</div>
            <div>
              From : {input.from.substring(0, 50)} | Product : {input.product} |
              Quantity : {input.quantity}{' '}
            </div>
            <div>
              To : {input.to.substring(0, 50)} | Pending Amount : {input.amount}{' '}
            </div>
          </div>
        ) : (
          ''
        )}

        {input.address === '**authorised-receiver-account**' ? (
          <div>
            <div> ID : {id} | RECEIVE PRODUCT SHIPMENT</div>
            <div>
              From : {input.from.substring(0, 50)} | Product : {input.product} |
              Quantity : {input.quantity}{' '}
            </div>
            <div>
              To : {input.to.substring(0, 50)} | Paid Amount : {input.amount}{' '}
            </div>
          </div>
        ) : (
          ''
        )}

        {input.address === '**authorised-account**' ? (
          <div>
            <div> ID : {id} | MINE REWARD</div>
            {outputMapAray}
          </div>
        ) : (
          ''
        )}

        {input.address[0] !== '*' ? (
          <div>
            <div> ID : {id} | MONEY TRANSFER</div>
            {outputMapAray}
          </div>
        ) : (
          ''
        )}

        {/* <div>From : "{input.address.substring(0,50)}" | Balance: {input.amount} </div>
                {
                    recipients.map(recipient => (
                            <div key={recipient}>
                                To: "{recipient.substring(0,50)}" | Sent: {outputMap[recipient]}
                            </div>
                    ))
                } */}
      </div>
    </div>
  );
};

export default Transaction;
