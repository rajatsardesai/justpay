import { BlockType } from "../components/Block";
import { Dispatch, SetStateAction } from "react";
import { SpriteType } from "./useSprites";
import { useCollisionDetection } from "./useCollisionDetection";
import { useSpriteMovement } from "./useSpriteMovement";

export const useBlockExecutor = (
    sprites: SpriteType[],
    setSprites: Dispatch<SetStateAction<SpriteType[]>>,
    setMessage: Dispatch<SetStateAction<string>>,
    setActiveAction: Dispatch<SetStateAction<Record<number, 'action1' | 'action2'>>>
) => {
    const { checkCollisionAndSwap } = useCollisionDetection(sprites, setSprites, setActiveAction);
    const { updateSpritePosition, updateSpriteRotation } = useSpriteMovement(sprites, setSprites);

    const executeBlocksRecursive = async (blocks: BlockType[], spriteIndex: number) => {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            checkCollisionAndSwap();
            
            switch (block.category) {
                case "motion":
                    if (block.action === "move") {
                        await updateSpritePosition(spriteIndex, block.value, 0);
                    } else if (block.action === "turn") {
                        await updateSpriteRotation(spriteIndex, block.value);
                    } else if (block.action === "goto") {
                        await updateSpritePosition(spriteIndex, 0, 0, block.x, block.y);
                    }
                    break;
                    
                case "looks":
                    if (block.action === "say" || block.action === "think") {
                        setMessage(block.text);
                        await new Promise(resolve => setTimeout(resolve, (block.duration || 2) * 1000));
                        setMessage("");
                    }
                    break;
                    
                case "control":
                    if (block.action === "repeat") {
                        const times = block.times || 1;
                        for (let j = 0; j < times; j++) {
                            for (let k = 0; k < i; k++) {
                                await executeBlocksRecursive([blocks[k]], spriteIndex);
                            }
                            for (let k = i + 1; k < blocks.length; k++) {
                                await executeBlocksRecursive([blocks[k]], spriteIndex);
                            }
                        }
                    }
                    break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    return { executeBlocksRecursive };
};

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
