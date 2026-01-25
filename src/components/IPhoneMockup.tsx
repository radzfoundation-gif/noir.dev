import React from 'react';
import clsx from 'clsx';

interface IPhoneMockupProps {
    children: React.ReactNode;
    className?: string; // For scaling or positioning
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children, className }) => {
    return (
        <div className={clsx("relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[3rem] h-[600px] w-[300px] shadow-xl flex flex-col items-center select-none overflow-hidden", className)}>

            {/* Dynamic Island / Notch Area */}
            <div className="absolute top-0 w-full flex justify-center z-20 pointer-events-none">
                <div className="h-[24px] w-[100px] bg-black rounded-b-[18px] flex items-center justify-center relative">
                    {/* Camera/Sensors */}
                    <div className="h-2 w-2 bg-gray-900 rounded-full absolute right-4"></div>
                </div>
            </div>

            {/* Side Buttons (Volume etc) - Absolute positioning outside the frame */}
            <div className="absolute top-24 -left-[10px] h-8 w-[2px] bg-gray-700 rounded-l-lg"></div> {/* Silence */}
            <div className="absolute top-36 -left-[10px] h-12 w-[2px] bg-gray-700 rounded-l-lg"></div> {/* Vol Up */}
            <div className="absolute top-52 -left-[10px] h-12 w-[2px] bg-gray-700 rounded-l-lg"></div> {/* Vol Down */}
            <div className="absolute top-36 -right-[10px] h-16 w-[2px] bg-gray-700 rounded-r-lg"></div> {/* Power */}

            {/* Screen Content */}
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-white relative z-10">
                {/* Status Bar simulation could go here if needed, but keeping it clean for inner content */}
                {children}
            </div>

            {/* Bottom Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1 bg-white/50 rounded-full z-20 pointer-events-none"></div>
        </div>
    );
};
