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

const Block: React.FC<Props> = ({ block, onDragStart, onChange }) => {
    const bg =
        block.category === "motion"
            ? "bg-blue-400"
            : block.category === "looks"
                ? "bg-purple-400"
                : block.category === "control"
                    ? "bg-yellow-400"
                    : block.category === "event"
                        ? "bg-orange-400"
                        : "bg-gray-200";

    const handleInput = (key: string, value: any) => {
        if (onChange) {
            onChange({ ...block, [key]: value } as BlockType);
        }
    };

    const inputBaseStyle =
        "appearance-none bg-white text-black border border-gray-300 rounded px-1 text-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-blue-300";

    return (
        <div
            className={`p-2 m-2 rounded cursor-grab ${bg}`}
            draggable
            onDragStart={(e) => onDragStart(e, block)}
        >
      <span>
        {block.category === "motion" && block.action === "move" && (
            <>
                Move
                <input
                    type="number"
                    value={block.value}
                    onChange={(e) => handleInput("value", +e.target.value)}
                    className={`mx-1 min-w-[4rem] ${inputBaseStyle}`}
                    style={{ width: `${block.value.toString().length + 2}ch` }}
                />
                steps
            </>
        )}

          {block.category === "motion" && block.action === "turn" && (
              <>
                  Turn
                  <input
                      type="number"
                      value={block.value}
                      onChange={(e) => handleInput("value", +e.target.value)}
                      className={`mx-1 min-w-[4rem] ${inputBaseStyle}`}
                      style={{ width: `${block.value.toString().length + 2}ch` }}
                  />
                  degrees
              </>
          )}

          {block.category === "motion" && block.action === "goto" && (
              <>
                  Go to x:
                  <input
                      type="number"
                      value={block.x}
                      onChange={(e) => handleInput("x", +e.target.value)}
                      className={`mx-1 min-w-[3.5rem] ${inputBaseStyle}`}
                      style={{ width: `${block.x.toString().length + 2}ch` }}
                  />
                  y:
                  <input
                      type="number"
                      value={block.y}
                      onChange={(e) => handleInput("y", +e.target.value)}
                      className={`mx-1 min-w-[3.5rem] ${inputBaseStyle}`}
                      style={{ width: `${block.y.toString().length + 2}ch` }}
                  />
              </>
          )}

          {block.category === "looks" && (
              <>
                  {block.action === "say" ? "Say" : "Think"}
                  <input
                      type="text"
                      value={block.text}
                      onChange={(e) => handleInput("text", e.target.value)}
                      className={`mx-1 w-28 ${inputBaseStyle}`}
                  />
                  for
                  <input
                      type="number"
                      value={block.duration}
                      onChange={(e) => handleInput("duration", +e.target.value)}
                      className={`mx-1 min-w-[3.5rem] ${inputBaseStyle}`}
                      style={{ width: `${block.duration.toString().length + 2}ch` }}
                  />
                  seconds
              </>
          )}

          {block.category === "control" && block.action === "repeat" && (
              <>
                  Repeat
                  <input
                      type="number"
                      value={block.times}
                      onChange={(e) => handleInput("times", +e.target.value)}
                      className={`mx-1 min-w-[4rem] ${inputBaseStyle}`}
                      style={{ width: `${block.times.toString().length + 2}ch` }}
                  />
                  times
              </>
          )}

          {block.category === "event" && block.action === "whenClicked" && (
              <>
                  <strong>When Sprite Clicked</strong>
              </>
          )}
      </span>
        </div>
    );
};

export default Block;
