import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import SuccessModal from "./SuccessModal";
import { useState } from "react";

type Tier = {
    name: string;
    amount: bigint;
    backers: bigint;
};

type TierCardProps = {
    tier: Tier;
    index: number;
    contract: ThirdwebContract;
    isEditing: boolean;
    onError: (error: Error) => void;
}

export const TierCard: React.FC<TierCardProps> = ({ tier, index, contract, isEditing, onError }) => {
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessModalOpen(true);
    };

    return (
        <div className="max-w-sm flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transform hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
                {/* Tier Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-gray-700">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{tier.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tier {index + 1}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">${tier.amount.toString()}</p>
                    </div>
                </div>

                {/* Backers Info */}
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {tier.backers.toString()} {parseInt(tier.backers.toString()) === 1 ? 'Backer' : 'Backers'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract: contract,
                        method: "function fund(uint256 _tierIndex) payable",
                        params: [BigInt(index)],
                        value: tier.amount,
                    })}
                    onError={onError}
                    onTransactionConfirmed={async () => handleSuccess("Successfully funded the campaign!")}
                    className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:via-blue-800 dark:hover:to-blue-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:-translate-y-0.5"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Fund Campaign</span>
                    </div>
                </TransactionButton>

                {isEditing && (
                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: contract,
                            method: "function removeTier(uint256 _index)",
                            params: [BigInt(index)],
                        })}
                        onError={onError}
                        onTransactionConfirmed={async () => handleSuccess("Successfully removed the tier!")}
                        className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 hover:from-red-600 hover:via-red-700 hover:to-red-800 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-red-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Remove Tier</span>
                        </div>
                    </TransactionButton>
                )}
            </div>

            <SuccessModal
                isOpen={isSuccessModalOpen}
                message={successMessage}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </div>
    );
};