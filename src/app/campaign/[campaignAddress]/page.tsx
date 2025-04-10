'use client';
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { lightTheme, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";

export default function CampaignPage() {
    const account = useActiveAccount();
    const { campaignAddress } = useParams();
    console.log(campaignAddress);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<number>(0);

    const handleError = (error: Error) => {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setTierName("");
        setTierAmount(0);
    };

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress as string,
    });

    // Name of the campaign
    const { data: name, isLoading: isLoadingName } = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: [],
    });

    // Description of the campaign
    const { data: description } = useReadContract({ 
        contract, 
        method: "function description() view returns (string)", 
        params: [] 
      });

    // Calculate remaining days
    const calculateRemainingDays = (deadline: bigint | undefined) => {
        if (!deadline) return 0;
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const deadlineTime = Number(deadline);
        const remainingSeconds = deadlineTime - now;
        const remainingDays = Math.max(0, Math.ceil(remainingSeconds / (60 * 60 * 24)));
        return remainingDays;
    };

    // Campaign deadline
    const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
        contract: contract,
        method: "function deadline() view returns (uint256)",
        params: [],
    });
    
    const remainingDays = calculateRemainingDays(deadline);

    // Goal amount of the campaign
    const { data: goal } = useReadContract({
        contract: contract,
        method: "function goal() view returns (uint256)",
        params: [],
    });
    
    // Total funded balance of the campaign
    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: "function getContractBalance() view returns (uint256)",
        params: [],
    });

    // Calulate the total funded balance percentage
    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

    // If balance is greater than or equal to goal, percentage should be 100
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    // Get tiers for the campaign
    const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
        contract: contract,
        method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
        params: [],
    });

    // Get owner of the campaign
    const { data: owner } = useReadContract({
        contract: contract,
        method: "function owner() view returns (address)",
        params: [],
    });

    // Get status of the campaign
    const { data: status } = useReadContract({ 
        contract, 
        method: "function state() view returns (uint8)", 
        params: [] 
    });

    // Check if campaign is successful (status === 1)
    const isSuccessful = status === 1;

    // Handle withdraw function
    const handleWithdrawSuccess = () => {
        alert("Funds withdrawn successfully!");
    };
    
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
                    </div>
                    <div className="flex gap-2">
                        {account?.address === owner && isSuccessful && (
                            <TransactionButton
                                transaction={() => prepareContractCall({
                                    contract: contract,
                                    method: "function withdraw()",
                                    params: [],
                                })}
                                onError={handleError}
                                onTransactionConfirmed={handleWithdrawSuccess}
                                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200"
                            >
                                Withdraw Funds
                            </TransactionButton>
                        )}
                        {account?.address === owner && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                            >
                                {isEditing ? "Done Editing" : "Edit Campaign"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal</h3>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">${goal?.toString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Raised</h3>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">${balance?.toString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Remaining</h3>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                            {remainingDays} {remainingDays === 1 ? 'day' : 'days'}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${balancePercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>{balancePercentage.toFixed(2)}% funded</span>
                        <span>${totalBalance} / ${totalGoal}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tiers?.map((tier, index) => (
                    <TierCard
                        key={index}
                        tier={tier}
                        index={index}
                        contract={contract}
                        isEditing={isEditing}
                        onError={handleError}
                    />
                ))}
                {isEditing && (
                    <div className="max-w-sm p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex flex-col items-center justify-center p-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-lg font-semibold">Add Tier</span>
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Tier</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tier Name
                                </label>
                                <input
                                    type="text"
                                    value={tierName}
                                    onChange={(e) => setTierName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter tier name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={tierAmount}
                                    onChange={(e) => setTierAmount(parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter amount in dollars"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <TransactionButton
                                transaction={() => prepareContractCall({
                                    contract: contract,
                                    method: "function addTier(string _name, uint256 _amount)",
                                    params: [tierName, BigInt(tierAmount)],
                                })}
                                onError={handleError}
                                onTransactionConfirmed={handleSuccess}
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                            >
                                Create Tier
                            </TransactionButton>
                        </div>
                    </div>
                </div>
            )}

            <ErrorModal
                isOpen={isErrorModalOpen}
                message={errorMessage}
                onClose={() => setIsErrorModalOpen(false)}
            />
        </div>
    );
}

type CreateTierModalProps = {
    setIsModalOpen: (value: boolean) => void
    contract: ThirdwebContract
}

const CreateCampaignModal = (
    { setIsModalOpen, contract }: CreateTierModalProps
) => {
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const handleError = (error: Error) => {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Tier</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tier Name
                        </label>
                        <input
                            type="text"
                            value={tierName}
                            onChange={(e) => setTierName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter tier name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount (ETH)
                        </label>
                        <input
                            type="number"
                            value={tierAmount}
                            onChange={(e) => setTierAmount(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter amount in ETH"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: contract,
                            method: "function addTier(string _name, uint256 _amount)",
                            params: [tierName, BigInt(tierAmount)],
                        })}
                        onError={handleError}
                        onTransactionConfirmed={handleSuccess}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                    >
                        Create Tier
                    </TransactionButton>
                </div>
            </div>

            <ErrorModal
                isOpen={isErrorModalOpen}
                message={errorMessage}
                onClose={() => setIsErrorModalOpen(false)}
            />
        </div>
    );
};