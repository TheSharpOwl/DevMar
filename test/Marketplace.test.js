const { assert } = require("chai")

const Marketplace = artifacts.require("./Marketplace.sol")

contract('Marketplace', (accounts) => {
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
            result = await marketplace.createProduct()
            newProductCount = await marketplace.productCount()
        })
        
        it('creates products', async () => {
            assert.equal(+productCount + 1, +newProductCount)
        })
    })

})