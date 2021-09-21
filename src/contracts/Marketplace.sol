pragma solidity ^0.5.0;

contract Marketplace {

    constructor() public {
        name = "DevMar";
        productCount = 0;
    }

    string public name;
    uint public productCount;
    mapping(uint => product) public products;

    struct product{
        uint id;
        string name;
        address owner;
        uint price;
        bool purchased;
    }

    function createProduct() public {
        // check parameters
        
        // create the product
        productCount ++;
        // generate the event
    }
}