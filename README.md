# 🚀 Decentralized Crowdfunding Platform

![Crowdfunding DApp Banner](public/logo.svg)

A modern, decentralized crowdfunding platform built on the Ethereum blockchain (Sepolia testnet) using Thirdweb, Next.js, and Tailwind CSS. Create and manage fundraising campaigns with multiple tiers, track progress, and engage with backers in a fully decentralized way.

## ✨ Features

- 🌐 **Decentralized Fundraising**: Create and manage campaigns on the Sepolia testnet
- 💎 **Multiple Funding Tiers**: Set up different funding tiers with unique rewards
- 🎨 **Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- 🔒 **Secure Transactions**: Direct blockchain interactions through smart contracts
- 📊 **Real-time Progress**: Track campaign funding progress and deadlines
- 👥 **Campaign Management**: Edit campaigns, add tiers, and withdraw funds

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Thirdweb SDK, Ethereum (Sepolia)
- **Smart Contracts**: Solidity
- **State Management**: React Hooks
- **Wallet Connection**: Thirdweb Connect

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Thirdweb account and API key
- MetaMask or another Web3 wallet
- Some Sepolia testnet ETH for deployments and testing

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crowdfunding-dapp.git
   cd crowdfunding-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   NEXT_PUBLIC_THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
   ```

4. **Update configuration**
   - Navigate to `src/app/constants/contracts.ts`
   - Update the `CROWDFUNDING_FACTORY` address with your deployed factory contract

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Smart Contract Setup

1. Deploy the Crowdfunding Factory contract on Sepolia testnet using Thirdweb
2. Update the contract address in your environment variables
3. Ensure you have Sepolia ETH for testing (use a faucet if needed)

## 📱 Usage

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation bar
   - Select your Web3 wallet and connect to Sepolia testnet

2. **Create a Campaign**
   - Navigate to Dashboard
   - Click "Create Campaign"
   - Fill in campaign details and set funding goal

3. **Manage Campaigns**
   - Add funding tiers
   - Track progress
   - Withdraw funds when successful

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Thirdweb](https://thirdweb.com/) for blockchain development tools
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the React framework
- [OpenZeppelin](https://openzeppelin.com/) for smart contract standards

## 📞 Support

For support, email shreylakhtaria@gmail.com

---

<div align="center">
Made with ❤️ by Shrey Manish Lakhtaria
</div>
