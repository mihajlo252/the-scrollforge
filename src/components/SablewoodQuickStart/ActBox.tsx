import { Link } from "@tanstack/react-router";
import { BoxSection } from "../BoxSection";

export const ActBox = ({ act }: { act: string }) => {
    return (
        <Link to={"/daggerheart-demo/acts/" + act}>
            <BoxSection styles="w-full h-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold capitalize">
                    {act.match(/\D+/g)} {act.match(/\d+/g)}
                </h1>
            </BoxSection>
        </Link>
    );
};
