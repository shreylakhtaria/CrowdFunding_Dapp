import React from 'react';

interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    // Clean up the error message to only show the main part
    const cleanErrorMessage = (msg: string) => {
        if (msg.includes("Campaign is not active")) {
            return "Error: Campaign is not active";
        }
        return msg;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100 animate-modal-pop">
                <div className="p-6">
                    {/* Error Icon */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Failed</h3>
                        <p className="text-sm text-gray-500">
                            {cleanErrorMessage(message)}
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;

// Add this to your globals.css
/*
@keyframes modal-pop {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-modal-pop {
    animation: modal-pop 0.2s ease-out forwards;
}
*/ 