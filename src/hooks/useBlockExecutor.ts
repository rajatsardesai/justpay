import { BlockType } from "../components/Block";
import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import { SpriteType } from "./useSprites";
import { toast } from "react-toastify";

const checkCollision = (sprite1: SpriteType, sprite2: SpriteType): boolean => {
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;

    const bufferZone = 0.2;
    const isColliding =
        Math.abs(dx) < (sprite1.width + sprite2.width) * (0.5 + bufferZone) &&
        Math.abs(dy) < (sprite1.height + sprite2.height) * (0.5 + bufferZone);

    return isColliding;
};

export const useBlockExecutor = (
    sprites: SpriteType[],
    setSprites: Dispatch<SetStateAction<SpriteType[]>>,
    setMessage: Dispatch<SetStateAction<string>>,
    setActiveAction: Dispatch<SetStateAction<Record<number, 'action1' | 'action2'>>>
) => {
    const lastCollisionTime = useRef<number>(0);
    const hasSwappedActions = useRef<boolean>(false);
    const COLLISION_COOLDOWN = 1000; 

    const updateSpritePosition = async (spriteIndex: number, distance: number, angle: number, x?: number, y?: number) => {
        if (x !== undefined && y !== undefined) {
            setSprites((prev) => {
                const updated = [...prev];
                updated[spriteIndex].x = x;
                updated[spriteIndex].y = y;
                return updated;
            });
        } else {
            const radians = (angle * Math.PI) / 180;
            setSprites((prev) => {
                const updated = [...prev];
                updated[spriteIndex].x += distance * Math.cos(radians);
                updated[spriteIndex].y += distance * Math.sin(radians);
                return updated;
            });
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    };

    const updateSpriteRotation = async (spriteIndex: number, angle: number) => {
        setSprites((prev) => {
            const updated = [...prev];
            updated[spriteIndex].rotation += angle;
            return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 300));
    };

    const executeBlocksRecursive = async (blocks: BlockType[], spriteIndex: number) => {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            
            checkCollisionAndSwap();
            
            if (block.category === "motion") {
                if (block.action === "move") {
                    await updateSpritePosition(spriteIndex, block.value, 0);
                } else if (block.action === "turn") {
                    await updateSpriteRotation(spriteIndex, block.value);
                } else if (block.action === "goto") {
                    await updateSpritePosition(spriteIndex, 0, 0, block.x, block.y);
                }
            } else if (block.category === "looks") {
                if (block.action === "say" || block.action === "think") {
                    setMessage(block.text);
                    await new Promise(resolve => setTimeout(resolve, (block.duration || 2) * 1000));
                    setMessage("");
                }
            } else if (block.category === "control" && block.action === "repeat") {
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
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const checkCollisionAndSwap = () => {
        if (sprites.length >= 2) {
            const sprite1 = sprites[0];
            const sprite2 = sprites[1];

            const now = Date.now();
            if (now - lastCollisionTime.current < COLLISION_COOLDOWN) {
                return;
            }

            if (checkCollision(sprite1, sprite2)) {
                if (!hasSwappedActions.current) {
                    lastCollisionTime.current = now;
                    hasSwappedActions.current = true;

                    setActiveAction(prev => {
                        const action1 = prev[0];
                        const action2 = prev[1];
                        
                        toast.info(`Actions swapped! Sprite 1 now has ${action2} and Sprite 2 now has ${action1}`);
                        
                        return {
                            ...prev,
                            0: action2,
                            1: action1
                        };
                    });

                    const dx = sprite2.x - sprite1.x;
                    const dy = sprite2.y - sprite1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    const minDistance = (sprite1.width + sprite2.width) / 2;
                    
                    setSprites(prev => {
                        const updated = [...prev];
                        const moveX = (minDistance - distance) * Math.cos(angle) / 2;
                        const moveY = (minDistance - distance) * Math.sin(angle) / 2;
                        
                        updated[0] = {
                            ...updated[0],
                            x: updated[0].x - moveX,
                            y: updated[0].y - moveY
                        };
                        updated[1] = {
                            ...updated[1],
                            x: updated[1].x + moveX,
                            y: updated[1].y + moveY
                        };
                        
                        return updated;
                    });
                }
            } else {
                hasSwappedActions.current = false;
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(checkCollisionAndSwap, 50);
        return () => clearInterval(interval);
    }, [sprites]);

    return { executeBlocksRecursive };
};

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
