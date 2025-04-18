import './App.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';
import { BlockType } from './components/Block';
import { useSprites } from './hooks/useSprites';
import { useBlockExecutor } from './hooks/useBlockExecutor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    const [message, setMessage] = useState('');
    const [eventBlock, setEventBlock] = useState<BlockType | null>(null);
    const [spriteBlocks, setSpriteBlocks] = useState<Record<number, Record<'action1' | 'action2', BlockType[]>>>({});
    const [activeAction, setActiveAction] = useState<Record<number, 'action1' | 'action2'>>({});
    const [activeTab, setActiveTab] = useState(0);
    const [sharedActionBlocks, setSharedActionBlocks] = useState<Record<'action1' | 'action2', BlockType[]>>({
        action1: [],
        action2: []
    });
    const [hasWhenClickedBlock, setHasWhenClickedBlock] = useState<Record<number, boolean>>({});

    const {
        sprites,
        setSprites,
        addSprite,
        isPlaying,
        togglePlay,
    } = useSprites();

    const { executeBlocksRecursive } = useBlockExecutor(
        sprites,
        setSprites,
        setMessage,
        setActiveAction
    );

    const runMidAreaBlocks = async () => {
        if (eventBlock && eventBlock.blocks) {
            await executeBlocksRecursive(eventBlock.blocks, 0);
        }
        
        for (let i = 0; i < sprites.length; i++) {
            const currentAction = activeAction[i] || 'action1';
            const blocksToRun = sharedActionBlocks[currentAction] || [];
            
            if (blocksToRun.length > 0) {
                await executeBlocksRecursive(blocksToRun, i);
            }
        }
    };

    const handleSpriteClick = (index: number) => {
        if (hasWhenClickedBlock[index]) {
            runMidAreaBlocks();
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
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="h-screen overflow-hidden flex flex-row">
                <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
                    <Sidebar onDragStart={handleDragStart} />
                    <MidArea
                        setEventBlock={setEventBlock}
                        runAllBlocks={runMidAreaBlocks}
                        sprites={sprites}
                        spriteBlocks={spriteBlocks}
                        setSpriteBlocks={setSpriteBlocks}
                        activeAction={activeAction}
                        setActiveAction={setActiveAction}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        sharedActionBlocks={sharedActionBlocks}
                        setSharedActionBlocks={setSharedActionBlocks}
                        hasWhenClickedBlock={hasWhenClickedBlock}
                        setHasWhenClickedBlock={setHasWhenClickedBlock}
                    />
                </div>
                <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
                    <PreviewArea
                        sprites={sprites}
                        isPlaying={isPlaying}
                        onSpriteClick={handleSpriteClick}
                        togglePlay={togglePlay}
                        addSprite={addSprite}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        activeAction={activeAction}
                        message={message}
                        runAllBlocks={runMidAreaBlocks}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
