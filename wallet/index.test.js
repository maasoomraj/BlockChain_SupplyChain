const Wallet = require('./index');
const {verifySignature} = require('../util/index'); 

describe('Wallet',()=>{

    let wallet;
    let data;

    beforeEach(()=>{
        data = "masoom";
        wallet = new Wallet();
    });

    it('has `balance` property',()=>{
        expect(wallet).toHaveProperty("balance");
    });

    it('has `publicKey` property',()=>{
        expect(wallet).toHaveProperty("publicKey");
    });

    it('has `balance` equal to `STARTING_BALANCE`',()=>{
        expect(wallet.balance).toEqual(100);
    });

    it('verifies a valid signature',()=>{
        expect(verifySignature({
            publicKey : wallet.publicKey,
            data : data,
            signature : wallet.sign(data)
        })).toBe(true);  
    });

    it('invalidates a wrong signature',()=>{
        expect(verifySignature({
            publicKey : wallet.publicKey,
            data : data,
            signature : new Wallet().sign(data)
        })).toBe(false); 
    });
});