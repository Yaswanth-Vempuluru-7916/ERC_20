
# NeoWallet - ERC20 Token Manager

![UI](https://raw.githubusercontent.com/Yaswanth-Vempuluru-7916/ERC_20/main/public/assets/images/ui.png)


NeoWallet is a React-based decentralized application (dApp) that allows users to connect their MetaMask wallet, manage ERC20 tokens, and transfer them to other addresses. Built with [Wagmi](https://wagmi.sh/), it supports Ethereum Mainnet and Sepolia Testnet, offering a sleek UI with customizable color themes.

## Features
- **Wallet Connection**: Connect to MetaMask and view your ETH balance and address.
- **Token Management**: Input an ERC20 token contract address to view its name, symbol, and your balance.
- **Token Transfer**: Send ERC20 tokens to any Ethereum address with transaction confirmation.
- **Theming**: Choose from four futuristic color themes (Cyber Blue, Neon Green, Amber, Neo Tokyo).
- **Responsive Design**: Optimized for desktop and mobile use.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Web3**: Wagmi, Viem, TanStack Query
- **Blockchain**: Ethereum (Mainnet & Sepolia Testnet)
- **Wallet**: MetaMask (injected connector)

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- [MetaMask](https://metamask.io/) browser extension
- A text editor (e.g., VS Code)

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Yaswanth-Vempuluru-7916/ERC_20.git
   cd erc_20
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs all required packages, including `wagmi`, `viem`, `@tanstack/react-query`, and `react-dom`.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or your configured port) in your browser.

## Project Structure
```
erc_20/
├── src/
│   ├── App.jsx             # Main app component
│   ├── wagmi.js            # Wagmi configuration
│   ├── TokenABI.json       # ERC20 token ABI
│   ├── index.jsx           # React root setup
│   └── index.css           # Global styles (Tailwind)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Usage

### Connecting a Wallet
1. Open the app in a browser with MetaMask installed.
2. Click **"Connect MetaMask"**.
3. Approve the connection in MetaMask (defaults to Mainnet; adjust `wagmi.js` for other networks).

### Viewing Token Details
1. After connecting, enter a valid ERC20 token contract address (e.g., DAI on Mainnet: `0x6b175474e89094c44da98b95deac495271d0f`).
2. The app displays the token’s name, symbol, and your balance (if you hold any).

### Transferring Tokens
1. Input a **Recipient Address** (e.g., another MetaMask account: create one via MetaMask → "Add Account").
2. Enter an **Amount** (e.g., `1` for 1 token).
3. Click **"Transfer Tokens"** and confirm the transaction in MetaMask.
4. Upon success, view the transaction hash and verify it on [Etherscan](https://etherscan.io/) or [Sepolia Etherscan](https://sepolia.etherscan.io/).

### Changing Themes
- At the top of the app, click one of the four colored circles to switch themes:
  - Cyber Blue (default)
  - Neon Green
  - Amber
  - Neo Tokyo


## Configuration
- **Wagmi Setup**: Edit `wagmi.js` to add more chains or connectors if needed.
- **Token ABI**: The `TokenABI.json` includes standard ERC20 functions (`balanceOf`, `transfer`, etc.) plus ownership and mint/burn capabilities.

## Example Token Contract
For testing, deploy an ERC20 contract with the ABI provided in `TokenABI.json`. Use tools like [Remix](https://remix.ethereum.org/) or Hardhat:
- Constructor: `name` (e.g., "NeoToken"), `symbol` (e.g., "NTK").
- Mint some tokens to your address after deployment.

## Troubleshooting
- **Wallet Not Connecting**: Ensure MetaMask is installed and unlocked. Check the console for errors.
- **Token Not Showing**: Verify the contract address and network match your MetaMask settings.
- **Transaction Fails**: Ensure you have sufficient ETH for gas and tokens in your balance.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgments
- [Wagmi](https://wagmi.sh/) for Web3 integration.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
