const { assert } = require("chai")

const Marketplace = artifacts.require("./Marketplace.sol")

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    // our test here
    describe('deployment', async () => {
        it('deploys successfuly', async () => {
            const address = await marketplace.address
            // make sure that address contains a valid value
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await marketplace.name()

            assert.equal(name, 'DevMar')
        })
    })


    // our test here
    describe('products', async () => {
        let result, productCount, newProductCount

        before(async () => {
            productCount = await marketplace.productCount()
            result = await marketplace.createProduct('AlienWare X17', web3.utils.toWei('1','Ether'), {from : seller})
            newProductCount = await marketplace.productCount()
        })
        
        it('creates products', async () => {
            assert.equal(+productCount + 1, +newProductCount)
            // the event is the first in the array
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), newProductCount.toNumber(), 'id is correct') 
            assert.equal(event.name,'AlienWare X17', 'name is correct') 
            assert.equal(event.price, web3.utils.toWei('1','Ether'), 'price is correct') 
            assert.equal(event.owner, seller, 'owner is correct') 
            assert.equal(event.purchased,false , 'purchased is correct') 
        })
    })

})