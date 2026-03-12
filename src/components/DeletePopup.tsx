import React from "react";
import { deleteCharacter } from "../utilities/deleteCharacter";
import { Popup } from "./Popup/Popup";
export const DeletePopup = ({
  deleteID,
  setDeleteID,
  setIsDeleted,
  setIsDelete,
  toggle,
  gameMode
}: {
  deleteID: string;
  setDeleteID: React.Dispatch<React.SetStateAction<string>>;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  toggle?: boolean;
  gameMode: string;
}) => {
  const handleDelete = async (e: React.FormEvent, id: string) => {
    e.preventDefault()
    await deleteCharacter(id, gameMode);
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
      <form className="boxSection form column-direction" onSubmit={(e) => handleDelete(e, deleteID)}>
        <p>Are you sure you want to continue?</p>
        <div className="sideBySide">
          <button type="submit" className="button button-primary button-ghost">
            Yes
          </button>
          <button type="button" className="button button-secondary button-ghost" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Popup>
  );
};
