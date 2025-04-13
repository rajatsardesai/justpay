import { BlockType } from "../components/Block";
import {Dispatch, SetStateAction, useEffect} from "react";
import { SpriteType } from "./useSprites";

const checkCollision = (sprite1: SpriteType, sprite2: SpriteType): boolean => {
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;

    const isColliding =
        Math.abs(dx) < (sprite1.width / 2 + sprite2.width / 2) &&
        Math.abs(dy) < (sprite1.height / 2 + sprite2.height / 2);

    return isColliding;
};

export const useBlockExecutor = (
    sprites: SpriteType[],
    setSprites: Dispatch<SetStateAction<SpriteType[]>>,
    setRotation: Dispatch<SetStateAction<number>>,
    setMessage: Dispatch<SetStateAction<string>>
) => {
    const executeBlocksRecursive = async (blocksToRun: BlockType[], rotation: number) => {
        for (const block of blocksToRun) {
            if (block.category === "motion") {
                if (block.action === "move") {
                    const distance = block.value ?? 10;
                    const radians = (rotation * Math.PI) / 180;
                    setSprites((prev) => {
                        const updated = [...prev];
                        updated[0].x += distance * Math.cos(radians);
                        updated[0].y += distance * Math.sin(radians);
                        return updated;
                    });
                    await delay(300);
                } else if (block.action === "turn") {
                    setRotation((prev) => prev + (block.value ?? 15));
                    await delay(300);
                } else if (block.action === "goto") {
                    setSprites((prev) => {
                        const updated = [...prev];
                        updated[0].x = block.x;
                        updated[0].y = block.y;
                        return updated;
                    });
                    await delay(300);
                }
            } else if (block.category === "looks" && (block.action === "say" || block.action === "think")) {
                const message = block.text ?? "";
                setMessage(message);
                await delay(2000);
                setMessage("");
            }
            else if (block.category === "control" && block.action === "repeat") {
                const repeatCount = block.times ?? 1;

                if (block.blocks && Array.isArray(block.blocks)) {
                    for (let i = 0; i < repeatCount; i++) {
                        await executeBlocksRecursive(block.blocks, rotation);
                    }
                }
            }
        }
    };

    const checkCollisionAndSwap = () => {
        if (sprites.length >= 2) {
            const sprite1 = sprites[0];
            const sprite2 = sprites[1];

            if (checkCollision(sprite1, sprite2)) {
                const tempX = sprite1.x;
                const tempY = sprite1.y;

                setSprites((prev) => {
                    const updated = [...prev];
                    updated[0].x = sprite2.x;
                    updated[0].y = sprite2.y;
                    updated[1].x = tempX;
                    updated[1].y = tempY;
                    return updated;
                });
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(checkCollisionAndSwap, 100);
        return () => clearInterval(interval);
    }, [sprites]);

    return { executeBlocksRecursive };
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
