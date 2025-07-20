import React from "react";
import { GM } from "./GM";
import { BoxSection } from "../BoxSection";

export const SuccessFailCrit = ({children, success, fail, crit, styles}: {children: React.ReactNode; success: React.ReactNode; fail: React.ReactNode; crit: React.ReactNode, styles: string}) => {
    return (
        <GM>
            {children}
            <div className={`grid grid-cols-3 gap-2 p-10 ${styles}`}>
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2 !border-primary">{success}</BoxSection>
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2 !border-secondary">{fail}</BoxSection>
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2 !border-accent">{crit}</BoxSection>
            </div>
        </GM>
    );
};
