export const Bonuses = ({proficiency, initiative, ac, hitDice, passivePerception} : {proficiency: number, initiative: number, ac: number, hitDice: string, passivePerception: number}) => {
  return (
        <ul className="flex w-full flex-col items-start">
          <li> Passive Perception: +{passivePerception}</li>
          <li> Proficiency: +{proficiency}</li>
          <li> Initiative: +{initiative}</li>
          <li> AC: {ac}</li>
          <li> Hit Dice: {hitDice}</li>
        </ul>
  )
}
