import React from 'react';
import { SpriteType } from '../hooks/useSprites';
import { BlockType } from './Block';

type SpriteTabsProps = {
  sprites: SpriteType[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  activeAction: Record<number, 'action1' | 'action2'>;
  setActiveAction: (spriteIndex: number, action: 'action1' | 'action2') => void;
  spriteBlocks: Record<number, Record<'action1' | 'action2', BlockType[]>>;
  setSpriteBlocks: React.Dispatch<React.SetStateAction<Record<number, Record<'action1' | 'action2', BlockType[]>>>>;
};

const SpriteTabs: React.FC<SpriteTabsProps> = ({
  sprites,
  activeTab,
  activeAction,
  setActiveAction,
}) => {
  // Check if ball sprite exists
  const hasBallSprite = sprites.some(sprite => sprite.type === 'ball');
  
  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            activeAction[activeTab] === 'action1'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveAction(activeTab, 'action1')}
        >
          Action 1
        </button>
        
        {hasBallSprite && (
          <button
            className={`px-4 py-2 rounded ${
              activeAction[activeTab] === 'action2'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveAction(activeTab, 'action2')}
          >
            Action 2
          </button>
        )}
      </div>
    </div>
  );
};

export default SpriteTabs; 