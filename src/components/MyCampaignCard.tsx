'use client'
import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignStatus = "ONGOING" | "SUCCESSFUL" | "FAILED";

type MyCampaignCardProps = {
    campaignAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({ campaignAddress }) => {
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress,
    });

    // Get Campaign Name
    const { data: name } = useReadContract({
        contract, 
        method: "function name() view returns (string)", 
        params: []
    });

    const { data: description } = useReadContract({ 
        contract, 
        method: "function description() view returns (string)", 
        params: [] 
    });

    // Goal amount of the campaign
    const { data: goal } = useReadContract({
        contract,
        method: "function goal() view returns (uint256)",
        params: []
    });

    // Total funded balance of the campaign
    const { data: balance } = useReadContract({
        contract,
        method: "function getContractBalance() view returns (uint256)",
        params: []
    });

    // Get Campaign deadline
    const { data: deadline } = useReadContract({
        contract,
        method: "function deadline() view returns (uint256)",
        params: [],
    });

    // Calculate the total funded balance percentage
    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = totalBalance && totalGoal 
        ? (parseInt(totalBalance) / parseInt(totalGoal)) * 100 
        : 0;

    // If balance is greater than or equal to goal, percentage should be 100
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    // Calculate campaign status
    const calculateStatus = (): CampaignStatus => {
        const now = Math.floor(Date.now() / 1000);
        if (balancePercentage >= 100) return "SUCCESSFUL";
        if (deadline && now > parseInt(deadline.toString())) return "FAILED";
        return "ONGOING";
    };

    const status = calculateStatus();

    const statusColors = {
        SUCCESSFUL: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
        FAILED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
        ONGOING: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
    };

    const progressColors = {
        SUCCESSFUL: "bg-green-500 dark:bg-green-400",
        FAILED: "bg-red-500 dark:bg-red-400",
        ONGOING: "bg-blue-500 dark:bg-blue-400"
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
                    {status !== "ONGOING" && (
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[status]}`}>
                            {status}
                        </span>
                    )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{description}</p>

                <div className="mt-auto">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className={`${progressColors[status]} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${balancePercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{balancePercentage.toFixed(2)}% funded</span>
                        <span>${parseInt(totalBalance || "0")} / ${parseInt(totalGoal || "0")}</span>
                    </div>

                    <Link 
                        href={`/campaign/${campaignAddress}`}
                        className="mt-4 inline-flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                    >
                        View Campaign
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};