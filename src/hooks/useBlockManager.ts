import { Dispatch, SetStateAction } from "react";
import { BlockType } from "../components/Block";
import { SpriteType } from "./useSprites";

export const useBlockManager = (
    sprites: SpriteType[],
    activeTab: number,
    activeAction: Record<number, 'action1' | 'action2'>,
    sharedActionBlocks: Record<'action1' | 'action2', BlockType[]>,
    setSharedActionBlocks: Dispatch<SetStateAction<Record<'action1' | 'action2', BlockType[]>>>,
    setSpriteBlocks: Dispatch<SetStateAction<Record<number, Record<'action1' | 'action2', BlockType[]>>>>,
    setHasWhenClickedBlock: Dispatch<SetStateAction<Record<number, boolean>>>
) => {
    const updateSpriteBlocks = (updatedSharedActionBlocks: Record<'action1' | 'action2', BlockType[]>) => {
        const updatedSpriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>> = {};
        sprites.forEach((_, index) => {
            updatedSpriteBlocks[index] = {
                action1: updatedSharedActionBlocks.action1,
                action2: updatedSharedActionBlocks.action2
            };
        });
        setSpriteBlocks(updatedSpriteBlocks);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const blockData = e.dataTransfer.getData("application/json");
        if (!blockData) return;

        const block: BlockType = JSON.parse(blockData);
        const currentAction = activeAction[activeTab];
        const currentBlocks = [...sharedActionBlocks[currentAction]];

        const updatedBlocks = block.category === "control" && block.action === "repeat"
            ? [...currentBlocks.slice(0, currentBlocks.length), block]
            : [...currentBlocks, block];

        const updatedSharedActionBlocks = {
            ...sharedActionBlocks,
            [currentAction]: updatedBlocks
        };

        setSharedActionBlocks(updatedSharedActionBlocks);
        updateSpriteBlocks(updatedSharedActionBlocks);
        
        if (block.category === "event" && block.action === "whenClicked") {
            setHasWhenClickedBlock(prev => ({
                ...prev,
                [activeTab]: true
            }));
        }
    };

    const handleBlockChange = (index: number, updatedBlock: BlockType) => {
        const currentAction = activeAction[activeTab];
        const currentBlocks = [...sharedActionBlocks[currentAction]];
        currentBlocks[index] = updatedBlock;
        
        const updatedSharedActionBlocks = {
            ...sharedActionBlocks,
            [currentAction]: currentBlocks
        };
        
        setSharedActionBlocks(updatedSharedActionBlocks);
        updateSpriteBlocks(updatedSharedActionBlocks);
    };

    return { handleDrop, handleBlockChange };
}; 