import { BoxSection } from "../BoxSection";

export const BasicSheet = ({
  name,
  tier,
  attacks,
  atkmod,
  difficulty,
  major,
  severe,
  hp,
  stress,
  features,
  numTypes,
}: {
  name: string;
  tier: string;
  attacks: string;
  atkmod: string;
  difficulty: string;
  major: number;
  severe: number;
  hp: number;
  stress: number;
  features: React.ReactNode;
  numTypes: number;
}) => {
  return (
    <BoxSection styles={"w-full h-max flex flex-col px-5 py-2 gap-5 !border-slate-600"}>
      <h3 className="text-4xl font-bold">{name}</h3>
      <p>Tier {tier}</p>
      <div className="flex gap-5">
        <ul className="flex flex-col">
          <li>{attacks}</li>
          <li>Attack mod: {atkmod}</li>
          <li>Difficulty: {difficulty}</li>
        </ul>
        <ul className="flex flex-col">
          <li>
            Major {major} | Severe {severe}
          </li>
          <li>HP: {hp}</li>
          <li className="flex">Stress: {stress}</li>
        </ul>
      </div>
      {features && (
        <div>
          <h3>Features</h3>
          <div className="mt-2 border-t-[1px] border-dotted pt-2">{features}</div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {new Array(numTypes).fill(0).map((_, i) => (
          <BoxSection key={i} styles="w-full h-max flex flex-col place-self-center p-2 !border-slate-600">
            <h3>
              {name} #{i + 1}
            </h3>
            <div className="flex gap-5">
              <div className="flex gap-2">
                <span>HP: </span>
                <div className="flex gap-0">
                  {new Array(hp).fill(0).map((_, i) => (
                    <input key={i} type="checkbox" name={`hp${i}`} defaultChecked className="checkbox-secondary checkbox checkbox-sm mr-2" />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <span>Stress: </span>
                <div className="flex gap-0">
                  {new Array(stress).fill(0).map((_, i) => (
                    <input key={i} type="checkbox" name={`stress${i}`} className="checkbox-accent checkbox checkbox-sm mr-2" />
                  ))}
                </div>
              </div>
            </div>
          </BoxSection>
        ))}
      </div>
    </BoxSection>
  );
};
