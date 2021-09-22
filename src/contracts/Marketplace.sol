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
        address payable owner;
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

    event ProductPurchased(
        uint id,
        string name,
        address owner,
        uint price,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        // check parameters
        require(bytes(_name).length > 0);
        require(_price > 0);
        // create the product
        productCount++;
        products[productCount] = Product(productCount, _name, msg.sender, _price, false);
        // generate the event
        emit ProductCreated(productCount, _name, msg.sender, _price, false);
    }



    function purchaseProduct(uint _id) public payable {
        // make sure of the id
        require(_id > 0 && _id <= productCount);
        Product memory _product = products[_id];

        // make sure of the money amount
        require(msg.value >= _product.price);
        // make sure the product is not sold
        require(!_product.purchased);
        
        address payable _seller = _product.owner;

        // make sure the seller is not the buyer
        require(_seller != msg.sender);
          
        _product.owner = msg.sender;

        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased(_id, _product.name, msg.sender, _product.price, true);
    }

}