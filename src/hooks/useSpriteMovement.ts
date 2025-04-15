import { Dispatch, SetStateAction } from "react";
import { SpriteType } from "./useSprites";

export const useSpriteMovement = (
    sprites: SpriteType[],
    setSprites: Dispatch<SetStateAction<SpriteType[]>>
) => {
    const updateSpritePosition = async (spriteIndex: number, distance: number, angle: number, x?: number, y?: number) => {
        setSprites(prev => {
            const updated = [...prev];
            if (x !== undefined && y !== undefined) {
                updated[spriteIndex] = {
                    ...updated[spriteIndex],
                    x,
                    y
                };
            } else {
                const radians = (angle * Math.PI) / 180;
                updated[spriteIndex] = {
                    ...updated[spriteIndex],
                    x: updated[spriteIndex].x + distance * Math.cos(radians),
                    y: updated[spriteIndex].y + distance * Math.sin(radians)
                };
            }
            return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 300));
    };

    const updateSpriteRotation = async (spriteIndex: number, angle: number) => {
        setSprites(prev => {
            const updated = [...prev];
            updated[spriteIndex] = {
                ...updated[spriteIndex],
                rotation: updated[spriteIndex].rotation + angle
            };
            return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 300));
    };

    return { updateSpritePosition, updateSpriteRotation };
}; 