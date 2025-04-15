import React, { useRef, memo } from 'react';
import CatSprite from './CatSprite';
import BallSprite from './BallSprite';
import { SpriteType } from '../hooks/useSprites';

type PreviewAreaProps = {
    sprites: SpriteType[];
    isPlaying: boolean;
    onSpriteClick: (index: number) => void;
    addSprite: () => void;
    activeTab: number;
    setActiveTab: (index: number) => void;
    activeAction: Record<number, 'action1' | 'action2'>;
    message: string | null;
    runAllBlocks: () => Promise<void>;
    togglePlay: () => void;
};

const SpriteThumbnail = memo(({ 
    sprite, 
    isActive, 
    activeAction, 
    onClick 
}: { 
    sprite: SpriteType; 
    index: number; 
    isActive: boolean; 
    activeAction: 'action1' | 'action2'; 
    onClick: () => void;
}) => (
    <div 
        className={`relative cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : ''}`}
        onClick={onClick}
    >
        <div className="transform scale-50">
            {sprite.type === 'cat' ? <CatSprite /> : <BallSprite />}
        </div>
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
            {activeAction}
        </div>
    </div>
));

const SpriteComponent = memo(({ 
    sprite, 
    message, 
    onClick 
}: { 
    sprite: SpriteType; 
    index: number; 
    message: string | null; 
    onClick: () => void;
}) => (
    <div
        className="absolute cursor-pointer transition-all duration-200"
        style={{
            transform: `translate(${sprite.x}px, ${sprite.y}px) rotate(${sprite.rotation}deg)`,
            width: sprite.width,
            height: sprite.height,
        }}
        onClick={onClick}
    >
        {sprite.type === 'cat' ? <CatSprite /> : <BallSprite />}
        {message && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm">
                {message}
            </div>
        )}
    </div>
));

const PreviewArea: React.FC<PreviewAreaProps> = ({
    sprites,
    onSpriteClick,
    addSprite,
    activeTab,
    setActiveTab,
    activeAction,
    message,
    runAllBlocks
}) => {
    const previewRef = useRef<HTMLDivElement>(null);

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
                    <SpriteComponent
                        key={index}
                        sprite={sprite}
                        index={index}
                        message={message}
                        onClick={() => handleSpriteClick(index)}
                    />
                ))}
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap">
                {sprites.map((sprite, index) => (
                    <SpriteThumbnail
                        key={`thumb-${index}`}
                        sprite={sprite}
                        index={index}
                        isActive={activeTab === index}
                        activeAction={activeAction[index]}
                        onClick={() => setActiveTab(index)}
                    />
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

export default memo(PreviewArea);
