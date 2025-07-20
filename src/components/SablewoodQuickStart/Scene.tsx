import React from "react";
import { BoxSection } from "../BoxSection";

export const Scene = ({ children }: { children: React.ReactNode }) => {
    const [toggle, setToggle] = React.useState(false);

    return (
        <button className="text-left"  onClick={() => setToggle(!toggle)}>
            <BoxSection
                styles={`w-full h-full flex flex-col place-self-center p-2 !border-slate-600`}
            >
                {children}
            </BoxSection>
        </button>
    );
};
