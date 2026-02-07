import { StatBlock } from "./StatBlock";
import { StatHeadSVG } from "../../../../components/StatHeadSVG";
import { useState } from "react";
import { Popup } from "../../../../components/Popup";

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
      <ul className="flex flex-col">
        {Object.entries(traitListValues).map((stat, i) => (
          <li key={i} onClick={handleEdit} className="hover:cursor-pointer">
            <StatBlock name={Object.values(stat)[0] as string} stat={parseInt(Object.keys(stat)[0])} color="accent">
              <StatHeadSVG stylesOutline={`stroke-accent transition-all fill-none`} stylesInline={`stroke-accent fill-none transition-all`} />
            </StatBlock>
          </li>
        ))}
      </ul>
      {/* <button className="btn btn-ghost" onClick={() => setOpenEdit(true)}>Edit</button> */}
      <Popup closerFunc={setOpenEdit} toggle={openEdit}>
        <ul className="flex gap-10">
          {Object.entries(traitListValues).map((stat, i) => (
            <li key={i} onClick={handleEdit} className="hover:cursor-pointer">
              <StatBlock name={Object.values(stat)[0] as string} stat={parseInt(Object.keys(stat)[0])} color="accent">
                <StatHeadSVG stylesOutline={`stroke-accent transition-all fill-none`} stylesInline={`stroke-accent fill-none transition-all`} />
              </StatBlock>
              <button onClick={() => console.log(Object.values(stat)[0])}>Test</button>
              <input type="number" value={stat} onChange={handleSetNewTrait} className="input input-bordered input-xs"/>
            </li>
          ))}
        </ul>
      </Popup>
    </>
  );
};
