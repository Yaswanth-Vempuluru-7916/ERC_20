import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors"; // Explicitly import injected connector
import TokenABI from "./TokenABI.json";

const App = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [hash, setHash] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  // Color theme selector (1: Cyber Blue, 2: Neon Green, 3: Amber, 4: Neo Tokyo)
  const [colorTheme, setColorTheme] = useState(1);

  // Theme color sets
  const themes = {
    1: { // Cyber Blue Theme
      gradient: "from-blue-600 to-cyan-500",
      accent: "text-blue-300",
      button: "from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
      focus: "border-blue-500 ring-blue-500",
      card: "from-blue-900 to-cyan-900",
      success: "bg-blue-900 border-blue-700 text-blue-400"
    },
    2: { // Neon Green Theme
      gradient: "from-green-500 to-emerald-600",
      accent: "text-green-300",
      button: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      focus: "border-green-500 ring-green-500",
      card: "from-green-900 to-teal-900",
      success: "bg-green-900 border-green-700 text-green-400"
    },
    3: { // Amber Theme
      gradient: "from-amber-500 to-orange-600",
      accent: "text-amber-300",
      button: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      focus: "border-amber-500 ring-amber-500",
      card: "from-amber-900 to-orange-900",
      success: "bg-amber-900 border-amber-700 text-amber-400"
    },
    4: { // Neo Tokyo Theme
      gradient: "from-red-600 to-pink-500",
      accent: "text-pink-300",
      button: "from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600",
      focus: "border-red-500 ring-red-500",
      card: "from-red-900 to-pink-900",
      success: "bg-red-900 border-red-700 text-red-400"
    }
  };

  // Current theme colors
  const theme = themes[colorTheme];

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(), // Use injected connector (MetaMask, etc.)
  });
  const { disconnect } = useDisconnect();

  // Contract read operations
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress || undefined,
    abi: TokenABI,
    functionName: "balanceOf",
    args: [address],
    enabled: isConnected && !!tokenAddress && !!address,
  });

  const { data: name } = useReadContract({
    address: tokenAddress || undefined,
    abi: TokenABI,
    functionName: "name",
    enabled: isConnected && !!tokenAddress,
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress || undefined,
    abi: TokenABI,
    functionName: "symbol",
    enabled: isConnected && !!tokenAddress,
  });

  const { writeContract, isPending: isWritePending } = useWriteContract();

  const { isLoading: isTransactionPending, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: ethBalance } = useBalance({
    address,
    enabled: isConnected && !!address,
  });

  // Update token name and symbol when data is fetched
  useEffect(() => {
    if (name) setTokenName(name);
    if (symbol) setTokenSymbol(symbol);
  }, [name, symbol]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      // Switch to Mainnet (chainId: 0x1) - optional, adjust as needed
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
      }
      await connect({ connector: injected() }); // Explicitly pass connector
      console.log("Connected successfully");
    } catch (error) {
      console.error("Connection error:", error.message);
    }
  };

  // Handle token transfer
  const handleTransfer = async () => {
    if (!recipient || !amount || !tokenAddress) return;

    try {
      const tx = await writeContract({
        address: tokenAddress,
        abi: TokenABI,
        functionName: "transfer",
        args: [recipient, parseEther(amount)],
      });
      setHash(tx.hash); // Set transaction hash for tracking
    } catch (error) {
      console.error("Transfer error:", error);
    }
  };

  // Log state for debugging
  useEffect(() => {
    console.log("isConnected:", isConnected, "address:", address);
  }, [isConnected, address]);

  // Address formatter
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Theme names for display
  const themeNames = {
    1: "Cyber Blue",
    2: "Neon Green",
    3: "Amber",
    4: "Neo Tokyo"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.gradient} p-6`}>
          <h1 className="text-3xl font-bold tracking-tighter">NeoWallet</h1>
          <p className="text-gray-200 opacity-75">ERC20 Token Manager</p>
          
          {/* Theme Selector */}
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-xs text-white/70">Theme:</span>
            <div className="flex space-x-1">
              {Object.keys(themes).map(key => (
                <button 
                  key={key}
                  onClick={() => setColorTheme(parseInt(key))}
                  className={`w-6 h-6 rounded-full transition-transform ${parseInt(key) === colorTheme ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                  style={{ 
                    background: key === "1" ? "linear-gradient(to right, #2563eb, #06b6d4)" : 
                              key === "2" ? "linear-gradient(to right, #10b981, #059669)" :
                              key === "3" ? "linear-gradient(to right, #f59e0b, #ea580c)" :
                              "linear-gradient(to right, #dc2626, #ec4899)"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`w-24 h-24 mb-8 rounded-full bg-gray-700 flex items-center justify-center ${theme.accent}`}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <button
                className={`w-full bg-gradient-to-r ${theme.button} text-white font-medium py-3 px-4 rounded-lg shadow transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:${theme.focus}`}
                onClick={connectWallet}
              >
                Connect MetaMask
              </button>
            </div>
          ) : (
            <div>
              {/* Account Info Card */}
              <div className="mb-6 bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center mr-3`}>
                      <span className="text-sm font-bold">{address ? address.substring(2, 4).toUpperCase() : ""}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Connected as</p>
                      <p className={`font-mono ${theme.accent}`}>{formatAddress(address)}</p>
                    </div>
                  </div>
                  <button
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors duration-200"
                    onClick={disconnect}
                  >
                    Disconnect
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ETH Balance</span>
                    <span className="font-medium">{ethBalance ? formatEther(BigInt(ethBalance.value)).substring(0, 7) : "0"} ETH</span>
                  </div>
                </div>
              </div>

              {/* Token Details Section */}
              <div className="mb-6">
                <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>Token Details</h2>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Token Contract Address</label>
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className={`w-full bg-gray-800 border border-gray-700 focus:${theme.focus} text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1`}
                    placeholder="0x..."
                  />
                </div>

                {tokenAddress && (
                  <div className={`bg-gradient-to-r ${theme.card} p-4 rounded-lg mb-4 shadow-lg`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">TOKEN NAME</p>
                        <p className="font-medium">{tokenName || "Loading..."}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">SYMBOL</p>
                        <p className="font-medium">{tokenSymbol || "..."}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 text-xs">YOUR BALANCE</p>
                        <p className="font-medium text-lg">
                          {tokenBalance ? formatEther(BigInt(tokenBalance)).substring(0, 10) : "0"}{" "}
                          <span className={theme.accent}>{tokenSymbol}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer Section */}
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>Transfer Tokens</h2>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Recipient</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className={`w-full bg-gray-800 border border-gray-700 focus:${theme.focus} text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1`}
                      placeholder="0x..."
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2">Amount</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full bg-gray-800 border border-gray-700 focus:${theme.focus} text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1`}
                        placeholder="0.0"
                      />
                      {tokenSymbol && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">{tokenSymbol}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 px-4 bg-gradient-to-r ${theme.button} rounded-lg text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                    onClick={handleTransfer}
                    disabled={
                      !tokenAddress ||
                      !recipient ||
                      !amount ||
                      isWritePending ||
                      isTransactionPending
                    }
                  >
                    {isWritePending || isTransactionPending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Transfer Tokens"
                    )}
                  </button>

                  {isSuccess && (
                    <div className={`mt-4 p-3 ${theme.success} bg-opacity-20 border rounded-lg`}>
                      <div className="flex items-center mb-1">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Transaction successful!
                      </div>
                      <div className="text-xs font-mono break-all text-gray-400">
                        Hash: {hash}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;