import { calculateModifiers, calculatePassivePerception, calculateProficiencyBonus } from "../../utilities/calculateStats"

export const Bonuses = ({character, ac, hitDice} : {character: Character, proficiency: number, initiative: number, ac: number, hitDice: string, passivePerception: number}) => {
  const {primaryStats: {wis, dex}, proficiencyBonus, skillProficiency: {perception}} = character.stats
  
  return (
        <ul className="flex w-full flex-col items-start">
          <li> Passive Perception: <span className="text-primary">+{calculatePassivePerception({stat: wis, proficiencyBonus, proficiency: perception })}</span></li>
          <li> Proficiency: +{calculateProficiencyBonus({level: character.characterProfile.level})}</li>
          <li> Initiative: +{calculateModifiers({stat: dex})}</li>
          <li> AC: {ac}</li>
          <li> Hit Dice: {hitDice}</li>
        </ul>
  )
}
