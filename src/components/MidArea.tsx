import React, { useState, useEffect } from "react";
import Block, { BlockType } from "./Block";
import { SpriteType } from "../hooks/useSprites";

type Props = {
    setEventBlock: React.Dispatch<React.SetStateAction<BlockType | null>>;
    runAllBlocks: () => void;
    sprites: SpriteType[];
    spriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>>;
    setSpriteBlocks: React.Dispatch<React.SetStateAction<Record<number, Record<'action1' | 'action2', BlockType[]>>>>;
    activeAction: Record<number, 'action1' | 'action2'>;
    setActiveAction: React.Dispatch<React.SetStateAction<Record<number, 'action1' | 'action2'>>>;
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    sharedActionBlocks: Record<'action1' | 'action2', BlockType[]>;
    setSharedActionBlocks: React.Dispatch<React.SetStateAction<Record<'action1' | 'action2', BlockType[]>>>;
    hasWhenClickedBlock: Record<number, boolean>;
    setHasWhenClickedBlock: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
    setBlocks?: React.Dispatch<React.SetStateAction<BlockType[]>>;
};

const MidArea: React.FC<Props> = ({ 
    setEventBlock, 
    runAllBlocks, 
    sprites,
    spriteBlocks,
    setSpriteBlocks,
    activeAction,
    setActiveAction,
    activeTab,
    sharedActionBlocks,
    setSharedActionBlocks,
    setHasWhenClickedBlock,
    setBlocks
}) => {
    const [eventBlock, setLocalEventBlock] = useState<BlockType | null>(null);

    useEffect(() => {
        const newActiveAction: Record<number, 'action1' | 'action2'> = {};
        const newSpriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>> = {};
        
        sprites.forEach((__, index) => {
            newActiveAction[index] = activeAction[index] || 'action1';
            
            if (!spriteBlocks[index]) {
                newSpriteBlocks[index] = {
                    action1: [],
                    action2: []
                };
            }
        });
        
        const hasActiveActionChanges = Object.keys(newActiveAction).some(
            (key) => {
                const numKey = parseInt(key, 10);
                return newActiveAction[numKey] !== activeAction[numKey];
            }
        );
        
        const hasSpriteBlocksChanges = Object.keys(newSpriteBlocks).some(
            (key) => {
                const numKey = parseInt(key, 10);
                return !spriteBlocks[numKey] || 
                       JSON.stringify(newSpriteBlocks[numKey]) !== JSON.stringify(spriteBlocks[numKey]);
            }
        );
        
        if (hasActiveActionChanges) {
            setActiveAction(prev => ({
                ...prev,
                ...newActiveAction
            }));
        }
        
        if (hasSpriteBlocksChanges) {
            setSpriteBlocks(prev => ({
                ...prev,
                ...newSpriteBlocks
            }));
        }
    }, [sprites]);

    useEffect(() => {
        if (sprites.length > 0 && spriteBlocks[0]) {
            setSharedActionBlocks({
                action1: spriteBlocks[0].action1 || [],
                action2: spriteBlocks[0].action2 || []
            });
        }
    }, [sprites.length, spriteBlocks]);

    useEffect(() => {
        if (activeTab >= 0 && activeTab < sprites.length) {
            const currentAction = activeAction[activeTab];
            const currentBlocks = sharedActionBlocks[currentAction] || [];
            setBlocks?.(currentBlocks);
        }
    }, [activeTab, activeAction, sharedActionBlocks, sprites.length]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const blockData = e.dataTransfer.getData("application/json");
        if (!blockData) return;

        const block: BlockType = JSON.parse(blockData);
        const currentAction = activeAction[activeTab];
        const currentBlocks = [...sharedActionBlocks[currentAction]];

        if (block.category === "control" && block.action === "repeat") {
            const dropIndex = currentBlocks.length;
            
            const allBlocks = [...currentBlocks];
            
            allBlocks.splice(dropIndex, 0, block);
            
            const updatedSharedActionBlocks = {
                ...sharedActionBlocks,
                [currentAction]: allBlocks
            };
            setSharedActionBlocks(updatedSharedActionBlocks);
            
            const updatedSpriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>> = {};
            sprites.forEach((_, index) => {
                updatedSpriteBlocks[index] = {
                    action1: updatedSharedActionBlocks.action1,
                    action2: updatedSharedActionBlocks.action2
                };
            });
            setSpriteBlocks(updatedSpriteBlocks);
            
            setBlocks?.(allBlocks);
        } else {
            const updatedBlocks = [...currentBlocks, block];
            
            const updatedSharedActionBlocks = {
                ...sharedActionBlocks,
                [currentAction]: updatedBlocks
            };
            setSharedActionBlocks(updatedSharedActionBlocks);
            
            const updatedSpriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>> = {};
            sprites.forEach((_, index) => {
                updatedSpriteBlocks[index] = {
                    action1: updatedSharedActionBlocks.action1,
                    action2: updatedSharedActionBlocks.action2
                };
            });
            setSpriteBlocks(updatedSpriteBlocks);
            
            setBlocks?.(updatedBlocks);
        }
        
        if (block.category === "event" && block.action === "whenClicked") {
            setHasWhenClickedBlock(prev => ({
                ...prev,
                [activeTab]: true
            }));
        }
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
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
        
        const updatedSpriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>> = {};
        sprites.forEach((_, index) => {
            updatedSpriteBlocks[index] = {
                action1: updatedSharedActionBlocks.action1,
                action2: updatedSharedActionBlocks.action2
            };
        });
        setSpriteBlocks(updatedSpriteBlocks);
        
        setBlocks?.(currentBlocks);
    };

    const handleSetActiveAction = (spriteIndex: number, action: 'action1' | 'action2') => {
        setActiveAction(prev => ({
            ...prev,
            [spriteIndex]: action
        }));
    };

    return (
        <div className="flex-1 h-full overflow-auto">
            <div
                className="w-2/3 p-4 min-h-[500px]"
                onDrop={handleDrop}
                onDragOver={allowDrop}
            >
                <h2 className="text-xl font-bold mb-4">Mid Area</h2>

                {eventBlock && (
                    <div className="p-2 mb-4 rounded bg-orange-200 shadow">
                        <Block
                            block={eventBlock}
                            onDragStart={() => {}}
                            onChange={(updatedBlock) => {
                                setLocalEventBlock(updatedBlock);
                                setEventBlock(updatedBlock);
                            }}
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
                            onClick={runAllBlocks}
                        >
                            Run When Clicked
                        </button>
                    </div>
                )}

                {sprites.length > 0 && (
                    <div className="p-2 mb-4 rounded bg-blue-100 shadow">
                        <h3 className="font-bold mb-2">
                            {sprites[activeTab].type === 'cat' ? 'Cat' : 'Ball'} - {activeAction[activeTab]}
                        </h3>
                        <div className="flex space-x-2 mb-2">
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeAction[activeTab] === 'action1'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => handleSetActiveAction(activeTab, 'action1')}
                            >
                                Action 1
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeAction[activeTab] === 'action2'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => handleSetActiveAction(activeTab, 'action2')}
                            >
                                Action 2
                            </button>
                        </div>
                        <div
                            onDrop={handleDrop}
                            onDragOver={allowDrop}
                            className="p-2 min-h-[80px] bg-white border-2 border-dashed border-blue-400 rounded"
                        >
                            {sharedActionBlocks[activeAction[activeTab]]?.length ? (
                                sharedActionBlocks[activeAction[activeTab]].map((block, idx) => (
                                    <Block
                                        key={idx}
                                        block={block}
                                        onDragStart={() => {}}
                                        onChange={(updatedBlock) => handleBlockChange(idx, updatedBlock)}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">Drop blocks here for {activeAction[activeTab]}</p>
                            )}
                        </div>
                    </div>
                )}

                <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={runAllBlocks}
                >
                    Play
                </button>
            </div>
        </div>
    );
};

export default MidArea;