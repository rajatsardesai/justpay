import React, { useState } from "react";
import Block, { BlockType } from "./Block";

type Props = {
    setEventBlock: React.Dispatch<React.SetStateAction<BlockType | null>>;
    setMidAreaBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>;
    runAllBlocks: () => void;
};

const MidArea: React.FC<Props> = ({ setEventBlock, setMidAreaBlocks, runAllBlocks }) => {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [eventBlock, setLocalEventBlock] = useState<BlockType | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const blockData = e.dataTransfer.getData("application/json");
        if (!blockData) return;

        const block: BlockType = JSON.parse(blockData);

        if (block.category === "event" && block.action === "whenClicked") {
            const newEventBlock = { ...block, blocks: [] };
            setLocalEventBlock(newEventBlock);
            setEventBlock(newEventBlock);
        } else {
            const updated = [...blocks, block];
            setBlocks(updated);
            setMidAreaBlocks(updated);
        }
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleBlockChange = (index: number, updatedBlock: BlockType) => {
        const updated = [...blocks];
        updated[index] = updatedBlock;
        setBlocks(updated);
        setMidAreaBlocks(updated);
    };

    const handleDropInsideEvent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (!data || !eventBlock) return;

        const droppedBlock: BlockType = JSON.parse(data);
        const updatedEvent = {
            ...eventBlock,
            blocks: [...(eventBlock.blocks ?? []), droppedBlock],
        };
        setLocalEventBlock(updatedEvent);
        setEventBlock(updatedEvent);
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
                        <div
                            onDrop={handleDropInsideEvent}
                            onDragOver={allowDrop}
                            className="ml-4 mt-2 p-2 min-h-[80px] bg-white border-2 border-dashed border-orange-400 rounded"
                        >
                            {eventBlock.blocks?.length ? (
                                eventBlock.blocks.map((b: BlockType, idx: number) => (
                                    <Block key={idx} block={b} onDragStart={() => {}} />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">Drop blocks here to run on sprite click</p>
                            )}
                        </div>
                    </div>
                )}

                {blocks.map((block, idx) => (
                    <Block
                        key={idx}
                        block={block}
                        onDragStart={() => {}}
                        onChange={(updatedBlock) => handleBlockChange(idx, updatedBlock)}
                    />
                ))}

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