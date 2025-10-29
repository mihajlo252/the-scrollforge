import React from 'react'

export const DNDForm = ({setCharacterProfile, characterProfile}: {setCharacterProfile: React.Dispatch<React.SetStateAction<CharacterProfile>>, characterProfile: CharacterProfile}) => {
  return (
    <>
        <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Name"
                required
                onChange={(e) => setCharacterProfile({ ...characterProfile, name: e.target.value })}
              />
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Level"
                required
                onChange={(e) => setCharacterProfile({ ...characterProfile, level: parseInt(e.target.value) })}
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Class"
                required
                onChange={(e) => setCharacterProfile({ ...characterProfile, class: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Subclass"
                onChange={(e) => setCharacterProfile({ ...characterProfile, subclass: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Race"
                required
                onChange={(e) => setCharacterProfile({ ...characterProfile, race: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Subrace"
                onChange={(e) => setCharacterProfile({ ...characterProfile, subrace: e.target.value })}
              />
    </>
  )
}
