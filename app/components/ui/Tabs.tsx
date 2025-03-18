"use client";

import React, { ReactNode } from "react";

interface TabsProps {
    value: string;
    onTabChange: (tab: string) => void;
    children: ReactNode;
}

interface TabProps {
    value: string;
    children: ReactNode;
}

export const Tabs = ({ value, onTabChange, children }: TabsProps) => {
    return (
        <div className="tabs-container">
            {/* Tab headers */}
            <div className="tab-header flex mb-4 space-x-2">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement<TabProps>(child)) {
                        return (
                            <button
                                className={`tab-item px-4 py-2 rounded-lg ${child.props.value === value ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                                    }`}
                                onClick={() => onTabChange(child.props.value)}
                            >
                                {child.props.value}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Tab content */}
            <div className="tab-content">
                {React.Children.map(children, (child) => {
                    // Render the active tab's content
                    if (React.isValidElement<TabProps>(child) && child.props.value === value) {
                        return <div>{child.props.children}</div>;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export const Tab = ({ children }: TabProps) => {
    return <>{children}</>;
};
