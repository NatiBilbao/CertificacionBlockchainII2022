// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

//Contract Deployed on Rinkeby TestNet: 0x75c9554fd8270aafa3461483021478d19cb99727c1a486ec3e65f496aab21f0d

contract Library{

    address private ownerAddress;

    bool closed;

    struct Book{
        string title;
        string author;
        bool available;
        uint priceBorrow;
    }


    mapping(string => Book) bookCollection;
    mapping(string => address) borrowedList;

    constructor(){
        ownerAddress = msg.sender;
    }

    //owner functions
    function addBook(Book memory book) public isOwner(msg.sender){
        bookCollection[book.title] = book;
        borrowedList[book.title] = ownerAddress;
    }

    function checkBookAvailability(string memory title) public view returns(Book memory){
        return bookCollection[title];
    }

    function closeLibrary(bool close) public isOwner(msg.sender){
        closed = close;
    }

    function checkBalance() public view isOwner(msg.sender) returns(uint) {
        return address(this).balance;
    }

    modifier isOwner(address addressToCheck){
        require(msg.sender == ownerAddress, "You are not the owner of the library");
        _;
    }


    //client functions
    function borrowBook(string memory title) public payable{
        require(bookCollection[title].available, "That book is not available");
        require(msg.value>bookCollection[title].priceBorrow, "Insuficcient funds");
        require(msg.value != bookCollection[title].priceBorrow, "Incorrect Payment");
        require(!closed, "The library is currently closed");
        borrowedList[title]=msg.sender;
        bookCollection[title].available=false;
    }

    function returnBook(string memory title) public{
        require(msg.sender == borrowedList[title], "You did not check that book out");
        borrowedList[title]=ownerAddress;
        bookCollection[title].available=true;
        payable(msg.sender).transfer((bookCollection[title].priceBorrow*1 ether));

    }

}
