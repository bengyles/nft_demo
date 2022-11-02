# Waves Of Decay Insiders Club

live demo running [here](https://nft-demo-nebit.vercel.app/)

This app serves as an example implementation of an ERC721 token that is used as an insiders club pass for my band Waves Of Decay. The idea is that the holders of this NFT would have the privilege to see behind-the-scenes photos and videos, get early access to demos etc... at some point in the future. Passes can be minted for 0.001 ETH or can be traded among the community. For every trade a fee will be taken and sent to the band's wallet for extra support.

## Running the project

To get started create an empty `.env` file and copy in the values from `env.example`. You only need to set a private key in case you want to deploy the contract on goerli.

run `yarn install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npx hardhat test`

Launches the automatic tests for the contracts, for now we only test the WODToken contract

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npx hardhat run scripts/deploy.js --network goerli`

Deploys the WODToken contract to goerli, it will log an Ethereum address which is where your newly deployed address can be found on the blockchain. Copy this address into `.env` after `REACT_APP_CONTRACT_ADDRESS=`. In order to deploy the contract on a local blockchain first run `npx hardhat node` in one terminal tab and then run `npx hardhat run scripts/deploy.js --network local` in another one and copy the contract address into your `.env` file.
