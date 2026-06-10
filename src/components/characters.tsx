"use client";

import {
  type CharacterInstruction,
  CharactersPet,
} from "@/components/pets/characters-pet";

interface CharactersProps {
  imagePath: string;
  instructions: CharacterInstruction[];
}

export const Characters = (props: CharactersProps) => {
  const { imagePath, instructions } = props;

  return (
    <CharactersPet
      className="relative z-10 mx-auto h-8 min-h-8 w-32 overflow-visible border-0 bg-transparent"
      defaultPosition={{ x: 0, y: 0 }}
      imagePath={imagePath}
      instructions={instructions}
      repeatInstructions
      size={32}
    />
  );
};
