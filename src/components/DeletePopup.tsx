import React from "react";
import { BoxSection } from "./BoxSection";
import { deleteCharacter } from "../utilities/deleteCharacter";

export const DeletePopup = ({
    deleteID,
    setDeleteID,
    setIsDeleted,
}: {
    deleteID: string;
    setDeleteID: React.Dispatch<React.SetStateAction<string>>;
    setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleDelete = async (id: string) => {
        await deleteCharacter(id);
        setIsDeleted(true);
        setDeleteID("");
    };
    return (
        <BoxSection
            styles={`fixed h-min px-10 py-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 ${deleteID != "" ? "flex" : "hidden"}`}
        >
            <p>Are you sure you want to continue?</p>
            <div className="flex items-center justify-center gap-20">
                <button type="button" className="btn btn-secondary" onClick={() => handleDelete(deleteID)}>
                    Yes
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setDeleteID("")}>
                    Cancel
                </button>
            </div>
        </BoxSection>
    );
};
