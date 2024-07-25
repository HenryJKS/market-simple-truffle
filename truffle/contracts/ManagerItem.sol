// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Ownable.sol";

contract ManagerItem is Ownable {

    enum StatusItem {
        Review,
        ForSale,
        Paid
    }
    event ItemCreate(
        address indexed createFrom,
        uint256 createAt,
        string _itemName,
        uint256 _itemPriceWei
    );
    event ItemDelete(
        address indexed deleteFrom,
        uint256 deleteAt,
        string _itemName,
        uint256 _itemPriceWei,
        string _reason
    );
    event ItemPurchase(
        address indexed oldOwner,
        address indexed newOwner,
        uint256 purchaseAt,
        string _itemName,
        uint256 _itemPriceWei
    );

    struct Item {
        uint256 itemId;
        string itemName;
        uint256 itemPriceWei;
        StatusItem status;
    }

    mapping(address => Item[]) public ownerItems;
    uint256 private nextId = 1;

    function createItem(
        string calldata _itemName,
        uint256 _itemPriceWei
    ) external onlyOwner {
        Item memory itemPush = Item({
            itemId: nextId++,
            itemName: _itemName,
            itemPriceWei: _itemPriceWei,
            status: StatusItem.ForSale
        });

        ownerItems[msg.sender].push(itemPush);

        emit ItemCreate(owner(), block.timestamp, _itemName, _itemPriceWei);
    }

    function deleteItem(
        uint256 _itemId,
        string calldata reason
    ) external onlyOwner {
        bool itemFound = false;
        for (uint256 i = 0; i < ownerItems[msg.sender].length; i++) {
            if (ownerItems[msg.sender][i].status == StatusItem.Review) {
                revert("The item is already for sale");
            }

            if (ownerItems[msg.sender][i].itemId == _itemId) {
                ownerItems[msg.sender][i] = ownerItems[msg.sender][
                    ownerItems[msg.sender].length - 1
                ];
                ownerItems[msg.sender].pop();
                itemFound = true;
                emit ItemDelete(
                    owner(),
                    block.timestamp,
                    ownerItems[msg.sender][i].itemName,
                    ownerItems[msg.sender][i].itemPriceWei,
                    reason
                );
                break;
            }
        }

        if (!itemFound) {
            revert("Item not found");
        }
    }

    function purchaseItem(uint256 _itemId) public payable {
        bool foundItem = false;
        address previousOwner = owner();
        uint256 itemFoundIndex;
        // found the item in owner array
        for (uint256 i; i < ownerItems[previousOwner].length; i++) {
            if (ownerItems[previousOwner][i].itemId == _itemId) {
                require(
                    ownerItems[previousOwner][i].itemPriceWei == msg.value,
                    "Insufficient amount"
                );
                require(
                    ownerItems[previousOwner][i].status == StatusItem.ForSale,
                    "Item unvaiable"
                );

                foundItem = true;
                itemFoundIndex = 1;
                break;
            }
        }

        if (!foundItem) {
            revert("item not found");
        }

        // transfer the ownership to purchaser
        ownerItems[previousOwner][itemFoundIndex].status = StatusItem.Paid;
        Item memory purchasedItem = ownerItems[previousOwner][itemFoundIndex];

        ownerItems[previousOwner][itemFoundIndex] = ownerItems[previousOwner][
            ownerItems[previousOwner].length - 1
        ];
        ownerItems[previousOwner].pop();

        ownerItems[msg.sender].push(purchasedItem);

        emit ItemPurchase(
            previousOwner,
            msg.sender,
            block.timestamp,
            purchasedItem.itemName,
            purchasedItem.itemPriceWei
        );
    }

    function withdrawFunds() external payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }


}
