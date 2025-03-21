import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-white">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2025 <a href="https://brainwave-notes.vercel.app/" className="hover:underline">CrowdFunding™</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="https://www.linkedin.com/in/shrey-lakhataria/" className="hover:underline me-4 md:me-6">Linkedin</a>
                    </li>
                    <li>
                        <a href="https://github.com/shreylakhtaria" className="hover:underline me-4 md:me-6">Github</a>
                    </li>
                    <li>
                        <a href="" className="hover:underline">Email</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;