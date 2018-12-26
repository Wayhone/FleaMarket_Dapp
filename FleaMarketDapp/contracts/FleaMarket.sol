//solium-disable linebreak-style
pragma solidity ^0.4.17;

contract FleaMarket {

    // 商品状态 - 用于描述商品信息
    enum Status {
        AVAILABLE,  // 可购买
        SOLD        // 已售出
    }

    // 商品信息
    struct Product{
        uint id;                    // 商品ID

        string name;                // 商品名字
        string classification;      // 商品分类
        Status status;              // 商品状态
        uint price;                 // 商品价格
        string description;         // 商品描述
        // string imageHash;        // 商品图片哈希

        address buyer;              // 购买者地址
        uint buyPrice;              // 购买者出价
    }

    uint productCount;                      // 统计商品的数量
    mapping(uint => address) productSaler;  // 商品id -> 卖家地址
    mapping(uint => Product) store;         // 商品id -> 商品对象


    // mapping(address => bytes32) users;        // 记录用户的密码

    // 构造函数
    constructor() public {
        productCount = 0;
    }

    // 注册用户
    // function register(string _password) public returns(bool) {
    //     if (users[msg.sender] > 0)
    //         return false;

    //     bytes32 encryption = keccak256(bytes(_password));    // 对密码进行加密
    //     users[msg.sender] = encryption;
    //     return true;
    // }

    // 发布商品，返回发布id
    function addProduct(string _name, string _class, uint _price, string _description) public returns(uint){
        // require(users[msg.sender] > 0, "您尚未注册");
        // require(keccak256(bytes(_password)) == users[msg.sender], "密码不正确");        
        productCount++;       
        Product memory product = 
            Product(productCount, _name, _class, Status.AVAILABLE, _price, _description, 0, 0);       
        store[productCount] = product;
        productSaler[productCount] = msg.sender;
        return productCount;
    }

    // 购买商品，完成交易，更改商品信息
    function buyProduct(uint _productID) public payable returns(bool) {
        // require(users[msg.sender] > 0, "您尚未注册");
        // require(keccak256(bytes(_password)) == users[msg.sender], "密码不正确");        
        Product storage product = store[_productID];
        require(msg.value >= product.price, "付款金额不足");

        product.buyer = msg.sender;
        product.buyPrice = msg.value;
        product.status = Status.SOLD;

        productSaler[_productID].transfer(product.price);
        uint refund = product.buyPrice - product.price;
        if (refund > 0) {
            msg.sender.transfer(refund);
        }

        return true;
    }

    // 获取商品信息(商品ID， 名字， 分类， 状态uint， 价格， 描述)
    function getProduct(uint _productID) public view returns(uint, string, string, Status, uint, string) {
        Product memory product = store[_productID];
        return (product.id, product.name, product.classification, product.status, 
            product.price, product.description);
    }

    // 获取某件商品的购买者
    function getBuyer(uint _productID) public view returns(address buyer, uint price){
        Product memory product = store[_productID];
        buyer = product.buyer;
        price = product.price;
    }

    // 获取当前商品数量
    function getProductNum() public view returns(uint){
        return productCount;
    }

}