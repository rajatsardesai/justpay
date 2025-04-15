import React, { memo } from 'react';

export type MotionBlock =
    | { category: "motion"; action: "move"; label: string; value: number; blocks?: BlockType[] }
    | { category: "motion"; action: "turn"; label: string; value: number; blocks?: BlockType[] }
    | { category: "motion"; action: "goto"; label: string; x: number; y: number; blocks?: BlockType[] };

export type LooksBlock =
    | { category: "looks"; action: "say"; label: string; text: string; duration: number; blocks?: BlockType[] }
    | { category: "looks"; action: "think"; label: string; text: string; duration: number; blocks?: BlockType[] };

export type ControlBlock = {
    category: "control";
    action: "repeat";
    label: string;
    times: number;
    blocks: BlockType[];
};

export type EventBlock = {
    category: "event";
    action: "whenClicked";
    label: string;
    blocks: BlockType[];
};

export type BlockType = MotionBlock | LooksBlock | ControlBlock | EventBlock;

type Props = {
    block: BlockType;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, block: BlockType) => void;
    onChange?: (block: BlockType) => void;
};

const NumberInput = memo(({ 
    value, 
    onChange, 
    minWidth = "4rem" 
}: { 
    value: number; 
    onChange: (value: number) => void; 
    minWidth?: string;
}) => (
    <input
        type="number"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className={`mx-1 min-w-[${minWidth}] appearance-none bg-white text-black border border-gray-300 rounded px-1 text-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-blue-300`}
        style={{ width: `${value.toString().length + 2}ch` }}
    />
));

const TextInput = memo(({ 
    value, 
    onChange 
}: { 
    value: string; 
    onChange: (value: string) => void;
}) => (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mx-1 w-28 appearance-none bg-white text-black border border-gray-300 rounded px-1 text-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
));

const Block: React.FC<Props> = memo(({ block, onDragStart, onChange }) => {
    const bg = {
        motion: "bg-blue-400",
        looks: "bg-purple-400",
        control: "bg-yellow-400",
        event: "bg-orange-400"
    }[block.category] || "bg-gray-200";

    const handleInput = (key: string, value: any) => {
        if (onChange) {
            onChange({ ...block, [key]: value } as BlockType);
        }
    };

    const renderBlockContent = () => {
        switch (block.category) {
            case "motion":
                switch (block.action) {
                    case "move":
                        return (
                            <>
                                Move
                                <NumberInput value={block.value} onChange={(v) => handleInput("value", v)} />
                                steps
                            </>
                        );
                    case "turn":
                        return (
                            <>
                                Turn
                                <NumberInput value={block.value} onChange={(v) => handleInput("value", v)} />
                                degrees
                            </>
                        );
                    case "goto":
                        return (
                            <>
                                Go to x:
                                <NumberInput value={block.x} onChange={(v) => handleInput("x", v)} minWidth="3.5rem" />
                                y:
                                <NumberInput value={block.y} onChange={(v) => handleInput("y", v)} minWidth="3.5rem" />
                            </>
                        );
                }
                break;
            case "looks":
                return (
                    <>
                        {block.action === "say" ? "Say" : "Think"}
                        <TextInput value={block.text} onChange={(v) => handleInput("text", v)} />
                        for
                        <NumberInput value={block.duration} onChange={(v) => handleInput("duration", v)} minWidth="3.5rem" />
                        seconds
                    </>
                );
            case "control":
                if (block.action === "repeat") {
                    return (
                        <>
                            Repeat
                            <NumberInput value={block.times} onChange={(v) => handleInput("times", v)} />
                            times
                        </>
                    );
                }
                break;
            case "event":
                if (block.action === "whenClicked") {
                    return <strong>When Sprite Clicked</strong>;
                }
                break;
        }
        return null;
    };

    return (
        <div
            className={`p-2 m-2 rounded cursor-grab ${bg}`}
            draggable
            onDragStart={(e) => onDragStart(e, block)}
        >
            <span>{renderBlockContent()}</span>
        </div>
    );
});

Block.displayName = 'Block';

export default Block;
