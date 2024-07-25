import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setOwner, setItem }) {
  const {
    state: { contract, accounts },
  } = useEth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [addressItem, setAddressItem] = useState("");
  const [index, setIndex] = useState(0);

  const getOwner = async () => {
    try {
      const owner = await contract.methods.owner().call();
      setOwner(owner);
      console.log(owner);
    } catch (err) {
      console.error(err);
    }
  };

  const createItem = async () => {
    try {
      await contract.methods.createItem(name, price).send({ from: accounts[0] });
      console.log(`Item created: ${name}, ${price}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getItem = async () => {
    try {
      const item = await contract.methods.ownerItems(addressItem, index).call();
      setItem(item);
      console.log(item);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="btns">
      <div>
        <button onClick={getOwner}>Get Owner</button>
      </div>

      <div className="input-btn">
        <button onClick={createItem}>CreateItem</button>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div className="input-btn">
        <button onClick={getItem}>Get Item</button>
        <input
          type="text"
          placeholder="Address"
          value={addressItem}
          onChange={(e) => setAddressItem(e.target.value)}
        />
        <input
          type="number"
          placeholder="Item Index"
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default ContractBtns;
