import { StatBlock } from "./StatBlock";
import { StatHeadSVG } from "../../../../components/StatHeadSVG";
import { useState } from "react";
import { Popup } from "../../../../components/Popup/Popup";
import styles from "./TraitsBlock.module.css";

export const TraitsBlock = ({ traitList }: { traitList: [] }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [traitListValues, setTraitListValues] = useState(traitList)


  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpenEdit(true);
  };

  const handleSetNewTrait = (e: React.ChangeEvent) => {
    e.preventDefault()
    setTraitListValues(pre => pre) // just to use it for now
    // setTraitListValues((pre) => {


    //   return [...pre, ]
    // })
  } 

  return (
    <>
      <ul className={styles.list}>
        {Object.entries(traitListValues).map((stat, i) => (
          <li key={i} onClick={handleEdit} className={styles.item}>
            <StatBlock name={Object.values(stat)[0] as string} stat={parseInt(Object.keys(stat)[0])} color="accent">
              <StatHeadSVG stylesOutline={`stroke-accent fill-none`} stylesInline={`stroke-accent fill-none`} />
            </StatBlock>
          </li>
        ))}
      </ul>
      <Popup closerFunc={setOpenEdit} toggle={openEdit}>
        <ul className={`frame full ${styles.editRow}`}>
          {Object.entries(traitListValues).map((stat, i) => (
            <li key={i} className={styles.editCol}>
              <StatBlock name={Object.values(stat)[0] as string} stat={parseInt(Object.keys(stat)[0])} color="accent">
                <StatHeadSVG stylesOutline={`stroke-accent fill-none`} stylesInline={`stroke-accent fill-none`} />
              </StatBlock>
              <input type="number" value={stat} onChange={handleSetNewTrait} className={`input ${styles.input}`} />
            </li>
          ))}
        </ul>
      </Popup>
    </>
  );
};
