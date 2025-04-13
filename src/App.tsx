import './App.css';
import { useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';
import { BlockType } from './components/Block';
import { useSprites } from './hooks/useSprites';
import { useBlockExecutor } from './hooks/useBlockExecutor';

const App: React.FC = () => {
    const [rotation, setRotation] = useState(0);
    const [message, setMessage] = useState('');
    const [eventBlock, setEventBlock] = useState<BlockType | null>(null);
    const [midAreaBlocks, setMidAreaBlocks] = useState<BlockType[]>([]);

    const previewRef = useRef<HTMLDivElement>(null);

    const {
        sprites,
        setSprites,
        addSprite,
        handleMouseDown
    } = useSprites();

    const { executeBlocksRecursive } = useBlockExecutor(
        sprites,
        setSprites,
        setRotation,
        setMessage
    );

    const runMidAreaBlocks = async () => {
        await executeBlocksRecursive(midAreaBlocks, rotation);
    };

    const handleSpriteClick = async () => {
        if (eventBlock?.category === 'event' && eventBlock.action === 'whenClicked') {
            await executeBlocksRecursive(eventBlock.blocks, rotation);
        }
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        block: BlockType
    ) => {
        e.dataTransfer.setData("application/json", JSON.stringify(block));
    };

    return (
        <div className="bg-blue-100 pt-6 font-sans">
            <div className="h-screen overflow-hidden flex flex-row">
                <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
                    <Sidebar onDragStart={handleDragStart} />
                    <MidArea
                        setEventBlock={setEventBlock}
                        setMidAreaBlocks={setMidAreaBlocks}
                        runAllBlocks={runMidAreaBlocks}
                    />
                </div>
                <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
                    <PreviewArea
                        sprites={sprites}
                        rotation={rotation}
                        message={message}
                        onSpriteClick={handleSpriteClick}
                        onMouseDown={(e, idx) => handleMouseDown(e, idx, previewRef)}
                        previewRef={previewRef}
                        addSprite={addSprite}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
