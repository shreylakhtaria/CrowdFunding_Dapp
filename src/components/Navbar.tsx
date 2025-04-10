'use client';
import { client } from "@/app/client";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    const account = useActiveAccount();

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Navigation Links */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logo.svg"
                                alt="CrowdFund Logo"
                                width={40}
                                height={40}
                                className="transition-transform duration-300 hover:scale-110"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                CrowdFund
                            </span>
                        </Link>
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            <a
                                href="/"
                                className="relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                            >
                                Campaigns
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
                            </a>
                            {account && (
                                <a
                                    href={`/dashboard/${account?.address}`}
                                    className="relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Connect Button and Theme Toggle */}
                    <div className="hidden md:flex md:items-center space-x-4">
                        <ThemeToggle />
                        <ConnectButton 
                            client={client}
                            theme={lightTheme({
                                colors: {
                                    accentText: "#3B82F6",
                                    accentButtonBg: "#3B82F6",
                                    accentButtonText: "#FFFFFF",
                                    primaryButtonBg: "#3B82F6",
                                    primaryButtonText: "#FFFFFF",
                                    primaryText: "#374151",
                                    secondaryText: "#6B7280",
                                    modalBg: "#F9FAFB",
                                    modalOverlayBg: "rgba(0, 0, 0, 0.5)",
                                    connectedButtonBg: "#F3F4F6",
                                    connectedButtonBgHover: "#E5E7EB",
                                    borderColor: "#E5E7EB",
                                    separatorLine: "#E5E7EB",
                                    danger: "#EF4444",
                                    success: "#10B981"
                                }
                            })}
                            detailsButton={{
                                style: {
                                    maxHeight: "40px",
                                    borderRadius: "0.5rem"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <a
                        href="/"
                        className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        Campaigns
                    </a>
                    {account && (
                        <a
                            href={`/dashboard/${account?.address}`}
                            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Dashboard
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;