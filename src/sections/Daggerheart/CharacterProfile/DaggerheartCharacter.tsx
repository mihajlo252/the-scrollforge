export const DaggerheartCharacter = ({character, handleNavigateToCharacter}: {character: DaggerheartCharacter, handleNavigateToCharacter: (char: DaggerheartCharacter) => void}) => {
  return (
    <li className="flex h-full w-full items-center gap-5" onClick={() => handleNavigateToCharacter(character)}>
      <div className="text-start">
        <p>
          {character.characterProfile.name}, {character.characterProfile.level}
        </p>
        <p>
          {character.characterProfile.ancestry} {character.characterProfile.community}, {character.characterProfile.class} {character.characterProfile?.subclass}, {character.characterProfile?.domains}
        </p>
      </div>
    </li>
  );
};

