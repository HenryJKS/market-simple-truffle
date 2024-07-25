import { useEffect, useState } from "react";

function Contract({ owner, item }) {
  const [currentOwner, setCurrentOwner] = useState(owner);
  const [currentItem, setCurrentItem] = useState(item);

  useEffect(() => {
    setCurrentOwner(owner);
    setCurrentItem(item);
  }, [owner, item]);

  return (
    <code>
      {`contract ManagerItem is Ownable {`}
      {`
    owner: `}
      <span>{currentOwner}</span>
      {`;

    item created: `}
      Item Name: {currentItem.itemName}, Item Price: {currentItem.itemPriceWei}wei
    {`


    function createItem(string memory _itemName, uint256 _itemPriceWei) external onlyOwner {}

    function deleteItem(uint256 _itemId, string memory reason) external onlyOwner {}

    function purchaseItem(uint256 _itemId) public payable {}

    function withdrawFunds() external onlyOwner {}
}`}
    </code>
  );
}

export default Contract;
