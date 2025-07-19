import React from "react";
import { InstructionGM } from "./InstructionGM";
import { BoxSection } from "../BoxSection";

export const SuccessFailCrit = ({children, success, fail, crit}: {children: React.ReactNode; success: React.ReactNode; fail: React.ReactNode; crit: React.ReactNode}) => {
    return (
        <InstructionGM>
            {children}
            <div className="grid grid-cols-3 gap-2">
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2">{success}</BoxSection>
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2">{fail}</BoxSection>
                <BoxSection styles="w-full h-full flex flex-col place-self-center p-2">{crit}</BoxSection>
            </div>
            
        </InstructionGM>
    );
};
