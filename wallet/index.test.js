const Wallet = require('./index')

describe('Wallet',()=>{

    let wallet;

    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has `balance` property',()=>{
        expect(wallet).toHaveProperty("balance");
    });

    it('has `publicKey` property',()=>{
        expect(wallet).toHaveProperty("publicKey");
    });

    it('has `balance`',()=>{
        expect(wallet.balance).toEqual(100);
    });


});