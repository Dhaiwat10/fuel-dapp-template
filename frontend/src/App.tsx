import React, { useEffect, useState } from 'react';
import { Provider, Wallet } from 'fuels';
import './App.css';

// Import the contract factory from the folder generated by the fuelchain
// command
import { ContractAbi__factory } from './contract-types';

// The private key of the `owner` in chainConfig.json.
// This enables us to have an account with an initial balance.
const WALLET_SECRET =
  '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298';

// The ID of the contract deployed to our local node.
// The contract ID is displayed when the `forc deploy` command is run.
// E.g. Contract id: 0xa326e3472fd4abc417ba43e369f59ea44f8325d42ba6cf71ec4b58123fd8668a
// const CONTRACT_ID = "0xa326e3472fd4abc417ba43e369f59ea44f8325d42ba6cf71ec4b58123fd8668a"
const CONTRACT_ID =
  '0xef066899413ef8dc7c3073a50868bafb3d039d9bad8006c2635b7f0efa992553';

// Create a "Wallet" using the private key above.
const wallet = Wallet.fromPrivateKey(
  WALLET_SECRET,
  new Provider('http://0.0.0.0:4000/graphql')
);

// Connect a "Contract" instance using the ID of the deployed contract and the
// wallet above.
const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet);

function App() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    async function main() {
      // Executes the `counter()` function to query the current contract state.
      // the `.get()` method is read-only. Therefore, doesn't spend coins.
      const { value } = await contract.functions.counter().get();
      setCounter(Number(value));
    }
    main();
  }, []);

  async function increment() {
    // Creates a transactions to call the `increment()` function, passing in
    // the amount we want to increment. Because we're creating a TX that updates
    // the contract state, this requires the wallet to have enough coins to
    // cover the costs and to sign the transaction.
    const { value } = await contract.functions.increment(1).call();
    setCounter(Number(value));
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Counter: {counter}</p>
        <button onClick={increment}>Increment</button>
      </header>
    </div>
  );
}

export default App;
