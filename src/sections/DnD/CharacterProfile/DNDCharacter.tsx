export const DNDCharacter = ({character, handleNavigateToCharacter}: {character: Character, handleNavigateToCharacter: (char: Character) => void}) => {
  return (
    <li className="flex h-full w-full items-center gap-5" onClick={() => handleNavigateToCharacter(character)}>
      <div className="text-start">
        <p>
          {character.characterProfile.name}, {character.characterProfile.level}
        </p>
        <p>
          {character.characterProfile.race} {character.characterProfile?.subrace}, {character.characterProfile.class}{" "}
          {character.characterProfile?.subclass}
        </p>
      </div>
    </li>
  );
};
