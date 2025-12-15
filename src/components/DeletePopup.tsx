import React from "react";
import { BoxSection } from "./BoxSection";
import { deleteCharacter } from "../utilities/deleteCharacter";
import { Popup } from "./Popup";
export const DeletePopup = ({
  deleteID,
  setDeleteID,
  setIsDeleted,
  setIsDelete,
  toggle,
}: {
  deleteID: string;
  setDeleteID: React.Dispatch<React.SetStateAction<string>>;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  toggle?: boolean;
}) => {
  const handleDelete = async (id: string) => {
    await deleteCharacter(id);
    setIsDeleted(true);
    setIsDelete(false);
    setDeleteID("");
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsDelete(false);
    setDeleteID("");
  };

  // const MotionBoxSection = motion(BoxSection);
  return (
    <Popup closerFunc={setIsDelete} toggle={toggle}>
      <BoxSection styles={`h-min px-10 py-16 flex flex-col gap-5`}>
        <p>Are you sure you want to continue?</p>
        <div className="flex items-center justify-center gap-20">
          <button type="button" className="btn btn-secondary" onClick={() => handleDelete(deleteID)}>
            Yes
          </button>
          <button type="button" className="btn btn-primary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </BoxSection>
    </Popup>
  );
};
