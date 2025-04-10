'use client'
import { client } from "@/app/client";
import Link from "next/link";
import { useEffect } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignStatus = "ONGOING" | "SUCCESSFUL" | "FAILED" | "ALL";

type CampaignCardProps = {
    campaignAddress: string;
    filterStatus: CampaignStatus;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress, filterStatus }) => {
    const contract = getContract({
        client: client, 
        chain: sepolia,
        address: campaignAddress,
    });

    // Get Campaign Name
    const {data: campaignName} = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: []
    });
 
    // Get Campaign Description
    const {data: campaignDescription} = useReadContract({
        contract: contract,
        method: "function description() view returns (string)",
        params: []
    });

    // Goal amount of the campaign
    const { data: goal, isLoading: isLoadingGoal } = useReadContract({
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

    // Get Campaign deadline
    const { data: deadline } = useReadContract({
        contract: contract,
        method: "function deadline() view returns (uint256)",
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

    // Calculate campaign status
    const calculateStatus = () => {
        const now = Math.floor(Date.now() / 1000);
        if (balancePercentage >= 100) return "SUCCESSFUL";
        if (deadline && now > parseInt(deadline.toString())) return "FAILED";
        return "ONGOING";
    };

    const status = calculateStatus();

    // If a filter is applied and the campaign doesn't match, don't render it
    if (filterStatus !== "ALL" && status !== filterStatus) {
        return null;
    }

    const statusColors = {
        SUCCESSFUL: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
        FAILED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
        ONGOING: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
    };

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{campaignName}</h5>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[status]}`}>
                        {status}
                    </span>
                </div>
                
                {!isLoadingBalance && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${balancePercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <span>{balancePercentage.toFixed(2)}% funded</span>
                            <span>${parseInt(totalBalance as string)} / ${parseInt(totalGoal as string)}</span>
                        </div>
                    </div>
                )}

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-300 line-clamp-3">
                    {campaignDescription}
                </p>
            </div>
            
            <Link 
                href={`/campaign/${campaignAddress}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors duration-200"
            >
                View Campaign
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </Link>
        </div>
    );
};
