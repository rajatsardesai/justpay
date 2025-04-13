import React, {useState} from "react";
import Block, {BlockType} from "./Block";

type Props = {
    onDragStart: (e: React.DragEvent<HTMLDivElement>, block: BlockType) => void;
};

const Sidebar: React.FC<Props> = ({onDragStart}) => {
    const [motionBlocks, setMotionBlocks] = useState<BlockType[]>([
        {category: "motion", action: "move", label: "Move", value: 10},
        {category: "motion", action: "turn", label: "Turn", value: 15},
        {category: "motion", action: "goto", label: "Go to", x: 0, y: 0},
    ]);

    const [looksBlocks, setLooksBlocks] = useState<BlockType[]>([
        {category: "looks", action: "say", label: "Say", text: "Hello", duration: 2},
        {category: "looks", action: "think", label: "Think", text: "Hmm", duration: 2},
    ]);

    const [eventBlocks, setEventBlocks] = useState<BlockType[]>([
        {category: "event", action: "whenClicked", label: "When Sprite Clicked", blocks: []},
    ]);

    const [controlBlocks, setControlBlocks] = useState<BlockType[]>([
        {
            category: "control",
            action: "repeat",
            label: "Repeat",
            times: 3,
            blocks: [],
        },
    ]);

    const handleUpdate = (
        index: number,
        block: BlockType,
        type: "motion" | "looks" | "event" | "control"
    ) => {
        const newBlock = structuredClone(block);

        const update = (listSetter: React.Dispatch<React.SetStateAction<BlockType[]>>, list: BlockType[]) => {
            const updated = [...list];
            updated[index] = newBlock;
            listSetter(updated);
        };

        if (type === "motion") update(setMotionBlocks, motionBlocks);
        if (type === "looks") update(setLooksBlocks, looksBlocks);
        if (type === "event") update(setEventBlocks, eventBlocks);
        if (type === "control") update(setControlBlocks, controlBlocks);
    };

    return (
        <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
            <h2 className="text-xl font-bold mb-2">Motion</h2>
            {motionBlocks.map((block, idx) => (
                <Block
                    key={idx}
                    block={block}
                    onDragStart={(e) => onDragStart(e, motionBlocks[idx])}
                    onChange={(updatedBlock) => handleUpdate(idx, updatedBlock, "motion")}
                />
            ))}
            <h2 className="text-xl font-bold mt-4 mb-2">Looks</h2>
            {looksBlocks.map((block, idx) => (
                <Block
                    key={idx}
                    block={block}
                    onDragStart={onDragStart}
                    onChange={(updatedBlock) => handleUpdate(idx, updatedBlock, "looks")}
                />
            ))}
            <h2 className="text-xl font-bold mt-4 mb-2">Events</h2>
            {eventBlocks.map((block, idx) => (
                <Block
                    key={idx}
                    block={block}
                    onDragStart={(e) => onDragStart(e, eventBlocks[idx])}
                    onChange={(updatedBlock) => handleUpdate(idx, updatedBlock, "event")}
                />
            ))}

            <h2 className="text-xl font-bold mt-4 mb-2">Control</h2>
            {controlBlocks.map((block, idx) => (
                <Block
                    key={idx}
                    block={block}
                    onDragStart={(e) => onDragStart(e, controlBlocks[idx])}
                    onChange={(updatedBlock) => handleUpdate(idx, updatedBlock, "control")}
                />
            ))}
        </div>
    );
}

export default Sidebar;
