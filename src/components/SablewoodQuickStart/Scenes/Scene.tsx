import React from "react";
import { BoxSection } from "../../BoxSection";
import Styles from "./Scene.module.css";

export const Scene = ({ heading, children }: { heading: React.ReactNode; children: React.ReactNode }) => {
    // const [toggle, setToggle] = React.useState(false);
    if (!children) return null;
    return (
        <BoxSection styles={`w-full h-max flex flex-col place-self-center p-2 !border-slate-600 hover:cursor-pointer`}>
            <details name="scene" className={`scene-details select-none ${Styles["scene-details"]}`}>
                <summary className="list-none">{heading}</summary>
                {children}
            </details>
        </BoxSection>
    );
};
