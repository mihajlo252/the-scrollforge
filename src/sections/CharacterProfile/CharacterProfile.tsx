
interface Primary {
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
}

interface Mods {
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
}

interface Profile {
    class: string,
    level: string,
    name: string,
    pastLife: string,
    race: string,
    subclass: string,
    subrace: string,
}

export const CharacterProfile = ({primaryStats, primaryMods, characterProfile}: {primaryStats: Primary, primaryMods: Mods, characterProfile: Profile}) => {
    return (
        <header className="grid h-full w-full grid-cols-2 items-center justify-between rounded-lg border-2 border-slate-900 bg-base-300 px-5 text-neutral">
            <div className="flex gap-2">
                {/* <img
                    src={`./assets/${"bag.png"}`}
                    className="h-[50px] w-[50px]"
                    alt=""
                /> */}
                <div className="text-start">
                    <p>{characterProfile.name}, {characterProfile.level}</p>
                    <hr />
                    <p>{characterProfile.class} {characterProfile.subclass}, {characterProfile.race} {characterProfile.subrace}</p>
                </div>
            </div>
            <div className="text-2xl">
                <div className="grid grid-cols-6">
                    <p>STR</p>
                    <p>DEX</p>
                    <p>CON</p>
                    <p>INT</p>
                    <p>WIS</p>
                    <p>CHA</p>
                </div>
                <hr />
                <div className="grid grid-cols-6">
                    <p>{primaryStats.str}<span className="text-sm">+{primaryMods.str}</span></p>
                    <p>{primaryStats.dex}<span className="text-sm">+{primaryMods.dex}</span></p>
                    <p>{primaryStats.con}<span className="text-sm">+{primaryMods.con}</span></p>
                    <p>{primaryStats.int}<span className="text-sm">+{primaryMods.int}</span></p>
                    <p>{primaryStats.wis}<span className="text-sm">+{primaryMods.wis}</span></p>
                    <p>{primaryStats.cha}<span className="text-sm">+{primaryMods.cha}</span></p>
                </div>
            </div>
        </header>
    );
};
