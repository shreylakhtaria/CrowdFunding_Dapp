'use client';
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia} from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react"

export default function DashboardPage() {
    const account = useActiveAccount();
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");
    const [campaignGoal, setCampaignGoal] = useState<number>(1);
    const [campaignDeadline, setCampaignDeadline] = useState<number>(1);
    const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);

    const handleCampaignGoal = (value: number) => {
        if (value < 1) {
            setCampaignGoal(1);
        } else {
            setCampaignGoal(value);
        }
    }

    const handleCampaignLengthhange = (value: number) => {
        if (value < 1) {
            setCampaignDeadline(1);
        } else {
            setCampaignDeadline(value);
        }
    }

    const handleDeployContract = async () => {
        setIsDeployingContract(true);
        try {
            console.log("Deploying contract...");
            const campaignAddress = await deployPublishedContract({
                client: client,
                chain: sepolia,
                account: account!,
                contractId: "Crowdfunding",
                contractParams: { 
                     name: campaignName,
                     description: campaignDescription,
                     goal: campaignGoal,
                     _durationInDays: campaignDeadline,
                },
                publisher: "0x30386c4cDdC94d5b235c7079309AF1487D0665Cb",
                version: "1.0.0",
            });
            alert(`Contract deployed successfully! Address: ${campaignAddress}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeployingContract(false);
            setIsModalOpen(false);
            setCampaignName("");
            setCampaignDescription("");
            setCampaignGoal(1);
            setCampaignDeadline(1);
        }
    };
    
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: CROWDFUNDING_FACTORY,
    });

    // Get Campaigns
    const { data: myCampaigns, isLoading: isLoadingMyCampaigns } = useReadContract({
        contract: contract,
        method: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
        params: [account?.address as string]
    });
    
    return (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-4xl font-semibold text-gray-900 dark:text-white">Dashboard</p>
                <button
                    className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setIsModalOpen(true)}
                >Create Campaign</button>
            </div>
            <p className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">My campaigns</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isLoadingMyCampaigns && (
                    myCampaigns && myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign, index) => (
                            <div 
                                key={index} 
                                className="transition-all duration-300 ease-in-out hover:-translate-y-1"
                            >
                                <MyCampaignCard
                                    campaignAddress={campaign.campaignAddress}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No campaigns</p>
                    )
                )}
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Campaign</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter campaign name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Campaign Description
                                </label>
                                <textarea
                                    value={campaignDescription}
                                    onChange={(e) => setCampaignDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter campaign description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Goal Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={campaignGoal}
                                    onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter goal amount in dollars"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Campaign Length (Days)
                                </label>
                                <input
                                    type="number"
                                    value={campaignDeadline}
                                    onChange={(e) => handleCampaignLengthhange(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter campaign length in days"
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
                            <button
                                onClick={handleDeployContract}
                                disabled={isDeployingContract}
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeployingContract ? "Creating Campaign..." : "Create Campaign"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

type CreateCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void
    refetch: () => void
}

const CreateCampaignModal = (
    { setIsModalOpen, refetch }: CreateCampaignModalProps
) => {
    const account = useActiveAccount();
    const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");
    const [campaignGoal, setCampaignGoal] = useState<number>(1);
    const [campaignDeadline, setCampaignDeadline] = useState<number>(1);
    
    // Deploy contract from CrowdfundingFactory
    const handleDeployContract = async () => {
        setIsDeployingContract(true);
        try {
            console.log("Deploying contract...");
            const campaignAddress = await deployPublishedContract({
                client: client,
                chain: sepolia,
                account: account!,
                contractId: "Crowdfunding",
                contractParams: { 
                     name: campaignName,
                     description: campaignDescription,
                     goal: campaignGoal,
                     _durationInDays: campaignDeadline,
                },
                publisher: "0x30386c4cDdC94d5b235c7079309AF1487D0665Cb",
                version: "1.0.0",
            });
            alert(`Contract deployed successfully! Address: ${campaignAddress}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeployingContract(false);
            setIsModalOpen(false);
            refetch();
        }
    };

    const handleCampaignGoal = (value: number) => {
        if (value < 1) {
            setCampaignGoal(1);
        } else {
            setCampaignGoal(value);
        }
    }

    const handleCampaignLengthhange = (value: number) => {
        if (value < 1) {
            setCampaignDeadline(1);
        } else {
            setCampaignDeadline(value);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Campaign</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campaign Name
                        </label>
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter campaign name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campaign Description
                        </label>
                        <textarea
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter campaign description"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Goal Amount ($)
                        </label>
                        <input
                            type="number"
                            value={campaignGoal}
                            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter goal amount in dollars"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campaign Length (Days)
                        </label>
                        <input
                            type="number"
                            value={campaignDeadline}
                            onChange={(e) => handleCampaignLengthhange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter campaign length in days"
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
                    <button
                        onClick={handleDeployContract}
                        disabled={isDeployingContract}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeployingContract ? "Creating Campaign..." : "Create Campaign"}
                    </button>
                </div>
            </div>
        </div>
    )
}