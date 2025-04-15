import React, { useState, useMemo, memo } from "react";
import Block, { BlockType } from "./Block";

type Props = {
    onDragStart: (e: React.DragEvent<HTMLDivElement>, block: BlockType) => void;
};

type BlockCategory = "motion" | "looks" | "event" | "control";

type BlocksState = {
    [K in BlockCategory]: BlockType[];
};

const initialBlocks: BlocksState = {
    motion: [
        { category: "motion", action: "move", label: "Move", value: 10 },
        { category: "motion", action: "turn", label: "Turn", value: 15 },
        { category: "motion", action: "goto", label: "Go to", x: 0, y: 0 },
    ],
    looks: [
        { category: "looks", action: "say", label: "Say", text: "Hello", duration: 2 },
        { category: "looks", action: "think", label: "Think", text: "Hmm", duration: 2 },
    ],
    event: [
        { category: "event", action: "whenClicked", label: "When Sprite Clicked", blocks: [] },
    ],
    control: [
        {
            category: "control",
            action: "repeat",
            label: "Repeat",
            times: 3,
            blocks: [],
        },
    ],
};

const BlockSection = memo(({ 
    title, 
    blocks, 
    onDragStart, 
    onUpdate 
}: { 
    title: string; 
    blocks: BlockType[]; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, block: BlockType) => void;
    onUpdate: (index: number, block: BlockType) => void;
}) => (
    <>
        <h2 className="text-xl font-bold mt-4 mb-2">{title}</h2>
        {blocks.map((block, idx) => (
            <Block
                key={idx}
                block={block}
                onDragStart={(e) => onDragStart(e, block)}
                onChange={(updatedBlock) => onUpdate(idx, updatedBlock)}
            />
        ))}
    </>
));

BlockSection.displayName = 'BlockSection';

const Sidebar: React.FC<Props> = memo(({ onDragStart }) => {
    const [blocks, setBlocks] = useState(initialBlocks);

    const handleUpdate = (category: BlockCategory, index: number, updatedBlock: BlockType) => {
        setBlocks(prev => ({
            ...prev,
            [category]: prev[category].map((block, idx) => 
                idx === index ? updatedBlock : block
            )
        }));
    };

    const blockSections = useMemo(() => [
        { title: "Motion", category: "motion" as const },
        { title: "Looks", category: "looks" as const },
        { title: "Events", category: "event" as const },
        { title: "Control", category: "control" as const },
    ], []);

    return (
        <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
            {blockSections.map(({ title, category }) => (
                <BlockSection
                    key={category}
                    title={title}
                    blocks={blocks[category]}
                    onDragStart={onDragStart}
                    onUpdate={(index, block) => handleUpdate(category, index, block)}
                />
            ))}
        </div>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
