import React from "react";
import { deleteCharacter } from "../utilities/deleteCharacter";
import { Popup } from "./Popup/Popup";
export const DeletePopup = ({
  deleteID,
  setDeleteID,
  setIsDeleted,
  setIsDelete,
  toggle
}: {
  deleteID: string;
  setDeleteID: React.Dispatch<React.SetStateAction<string>>;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  toggle?: boolean;
}) => {
  const handleDelete = async (e: React.FormEvent, id: string) => {
    e.preventDefault()
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

  // const MotionFrame = motion(Frame);
  return (
    <Popup closerFunc={setIsDelete} toggle={toggle}>
      <form className="frame form column-direction" onSubmit={(e) => handleDelete(e, deleteID)}>
        <p>Are you sure you want to continue?</p>
        <div className="side-by-side">
          <button type="submit" className="button button-primary ">
            Yes
          </button>
          <button type="button" className="button button-secondary " onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Popup>
  );
};
