import { useState } from "react";
import { sendData } from "../../utilities/sendData";
import { Popup } from "../../components/Popup";
import { BoxSection } from "../../components/BoxSection";

export const Trait = ({
  setEdit,
  edit,
  description,
}: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
  description: string;
}) => {
  const { state } = JSON.parse(localStorage.getItem("character") ?? "{}");
  const [featureTraits, setFeatureTraits] = useState<string>(state.character.descriptions.featureTraits);
  const [racialTraits, setRacialTraits] = useState<string>(state.character.descriptions.racialTraits);
  const [save, setSave] = useState(false);

  const handleSubmit = async (e: any, traits: string) => {
    e.preventDefault();
    await sendData("characters", state.character.id, { descriptions: { ...state.character.descriptions, [description]: traits } });
    setSave(false);
    setEdit(false);
  };

  const handleSetTraits = (e: React.ChangeEvent<HTMLTextAreaElement>, setFunc: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    setFunc(e.target.value);
    if (save === false) {
      setSave(true);
      localStorage.setItem(
        "character",
        JSON.stringify({
          state: { character: { ...state.character, descriptions: { ...state.character.descriptions, [description]: e.target.value } } },
          version: 0,
        })
      );
    }
    if (save === true) {
      setSave(false);
    }
  };

  if (description === "racialTraits") {
    return (
      <form className="relative h-full w-full overflow-scroll" onSubmit={(e) => handleSubmit(e, racialTraits)}>
        <Popup closerFunc={setEdit} toggle={edit}>
          <BoxSection styles="w-full h-full mx-auto flex flex-col place-self-center">
            <textarea
              className="text-md h-full resize-none overflow-y-auto rounded-lg bg-base-300 p-5"
              placeholder="What's on your mind?"
              value={racialTraits}
              onChange={(e) => handleSetTraits(e, setRacialTraits)}
            />
          </BoxSection>
          <div className="flex flex-row gap-5">
            <button type="submit" className="btn btn-accent">
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEdit(false)}>
              Close
            </button>
          </div>
        </Popup>

        <pre>
          <p className="text-wrap">{racialTraits}</p>
        </pre>
      </form>
    );
  }
  if (description === "featureTraits") {
    return (
      <form className="relative h-full w-full overflow-scroll" onSubmit={(e) => handleSubmit(e, featureTraits)}>
        <Popup closerFunc={setEdit} toggle={edit}>
          <BoxSection styles="w-full h-full mx-auto flex flex-col place-self-center">
            <textarea
              className="text-md h-full w-full resize-none overflow-y-auto rounded-lg bg-base-300 px-5"
              placeholder="What's on your mind?"
              value={featureTraits}
              onChange={(e) => handleSetTraits(e, setFeatureTraits)}
            />
          </BoxSection>
          <div className="flex flex-row gap-5">
            <button type="submit" className="btn btn-accent">
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEdit(false)}>
              Close
            </button>
          </div>
        </Popup>
        <pre>
          <p className="text-wrap">{featureTraits}</p>
        </pre>
      </form>
    );
  }
};
