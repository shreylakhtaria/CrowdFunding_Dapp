'use client';
import { useState } from "react";
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";

type CampaignStatus = "ONGOING" | "SUCCESSFUL" | "FAILED" | "ALL";

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus>("ONGOING");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);

  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const { data: campaigns, isLoading: isLoadingCampaigns } = useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });

  const filterOptions: { label: string; value: CampaignStatus; icon: string; color: string }[] = [
    { 
      label: "Ongoing", 
      value: "ONGOING", 
      icon: "⚡", 
      color: "text-blue-600"
    },
    { 
      label: "Successful", 
      value: "SUCCESSFUL", 
      icon: "✨", 
      color: "text-green-600"
    },
    { 
      label: "Failed", 
      value: "FAILED", 
      icon: "❌", 
      color: "text-red-600"
    },
    { 
      label: "All Campaigns", 
      value: "ALL", 
      icon: "🔍", 
      color: "text-gray-600"
    },
  ];

  // Function to get status label and icon
  const getStatusInfo = (status: CampaignStatus) => {
    return filterOptions.find(option => option.value === status) || filterOptions[0];
  };

  const renderEmptyState = () => {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-7xl mb-6 animate-bounce">
          {selectedStatus === "ONGOING" ? "⚡" : 
           selectedStatus === "SUCCESSFUL" ? "✨" :
           selectedStatus === "FAILED" ? "❌" : "🔍"}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {selectedStatus === "ONGOING" 
            ? "No Ongoing Campaigns Yet"
            : selectedStatus === "SUCCESSFUL"
            ? "No Successful Campaigns Yet"
            : selectedStatus === "FAILED"
            ? "No Failed Campaigns"
            : "No Campaigns Found"}
        </h3>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          {selectedStatus === "ONGOING" 
            ? "There are no active campaigns at the moment. Check back later or explore other campaign categories!"
            : selectedStatus === "SUCCESSFUL"
            ? "No campaigns have reached their funding goal yet. View ongoing campaigns to support creators!"
            : selectedStatus === "FAILED"
            ? "Good news! No campaigns have failed. Check out the ongoing campaigns to show your support!"
            : "Be the first to create a campaign and start your crowdfunding journey!"}
        </p>
        <div className="flex gap-4">
          {selectedStatus !== "ALL" && (
            <button
              onClick={() => setSelectedStatus("ALL")}
              className="px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200"
            >
              View All Campaigns
            </button>
          )}
          <button
            onClick={() => setSelectedStatus("ONGOING")}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            {selectedStatus === "ONGOING" ? "Refresh Campaigns" : "View Ongoing Campaigns"}
          </button>
        </div>
      </div>
    );
  };

  const renderCampaigns = () => {
    if (isLoadingCampaigns) {
      return (
        <div className="col-span-3 text-center py-12">
          <div className="text-2xl">Loading campaigns...</div>
        </div>
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return renderEmptyState();
    }

    const filteredContent = campaigns.map((campaign) => (
      <CampaignCard
        key={campaign.campaignAddress}
        campaignAddress={campaign.campaignAddress}
        filterStatus={selectedStatus}
      />
    )).filter(Boolean);

    return filteredContent.length > 0 ? filteredContent : renderEmptyState();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Campaigns</h1>
          
          {/* Enhanced Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-between w-56 px-4 py-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getStatusInfo(selectedStatus).icon}</span>
                <span className={getStatusInfo(selectedStatus).color}>
                  {getStatusInfo(selectedStatus).label}
                </span>
              </div>
              <svg
                className={`w-5 h-5 ml-2 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Enhanced Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 transform transition-all duration-200 ease-out">
                <div className="py-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedStatus(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 text-sm ${
                        selectedStatus === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      } transition-colors duration-150`}
                    >
                      <span className="text-xl mr-2">{option.icon}</span>
                      <span className={option.color}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderCampaigns()}
        </div>
      </div>
    </main>
  );
}