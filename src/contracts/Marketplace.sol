pragma solidity ^0.5.0;

contract Marketplace {

    constructor() public {
        name = "DevMar";
        productCount = 0;
    }

    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        address owner;
        uint price;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        address owner,
        uint price,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        // check parameters
        
        // create the product
        productCount++;
        products[productCount] = Product(productCount, _name, msg.sender, _price, false);
        // generate the event
        emit ProductCreated(productCount, _name, msg.sender, _price, false);
    }
}