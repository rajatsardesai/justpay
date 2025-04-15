import React from 'react';
import { useRef } from 'react';
import CatSprite from './CatSprite';
import BallSprite from './BallSprite';
import { SpriteType } from '../hooks/useSprites';

type PreviewAreaProps = {
    sprites: SpriteType[];
    isPlaying: boolean;
    onSpriteClick: (index: number) => void;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
    togglePlay: () => void;
    addSprite: () => void;
    activeTab: number;
    setActiveTab: (index: number) => void;
    activeAction: Record<number, 'action1' | 'action2'>;
    message: string;
    runAllBlocks: () => void;
};

const PreviewArea: React.FC<PreviewAreaProps> = ({
    sprites,
    onSpriteClick,
    onMouseDown,
    addSprite,
    activeTab,
    setActiveTab,
    activeAction,
    message,
    runAllBlocks
}) => {
    const previewRef = useRef<HTMLDivElement>(null);

    const getSpriteComponent = (type: string) => {
        if (type === 'cat') return <CatSprite />;
        if (type === 'ball') return <BallSprite />;
        return null;
    };

    const handleSpriteClick = (index: number) => {
        onSpriteClick(index);
        runAllBlocks();
    };

    return (
        <div className="flex flex-col w-full h-full p-2">
            <div
                ref={previewRef}
                className="relative flex-1 overflow-hidden border rounded bg-gray-100"
            >
                {sprites.map((sprite, index) => (
                    <div
                        key={index}
                        className="absolute cursor-move transition-all duration-200"
                        style={{
                            transform: `translate(${sprite.x}px, ${sprite.y}px) rotate(${sprite.rotation}deg)`,
                            width: sprite.width,
                            height: sprite.height,
                        }}
                        onMouseDown={(e) => onMouseDown(e, index)}
                        onClick={() => handleSpriteClick(index)}
                    >
                        {getSpriteComponent(sprite.type)}
                        {message && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm">
                                {message}
                            </div>
                        )}
                        {sprite.currentAnimation && (
                            <div className="absolute top-0 left-0 w-full h-full">
                                {/* Animation overlay */}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap">
                {sprites.map((sprite, index) => (
                    <div 
                        key={`thumb-${index}`} 
                        className={`relative cursor-pointer ${activeTab === index ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        <div className="transform scale-50">
                            {getSpriteComponent(sprite.type)}
                        </div>
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
                            {activeAction[index]}
                        </div>
                    </div>
                ))}
                <button
                    onClick={addSprite}
                    className="flex items-center justify-center w-10 h-10 border border-dashed rounded-full text-gray-500 hover:border-gray-800"
                    title="Add Sprite"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default PreviewArea;
