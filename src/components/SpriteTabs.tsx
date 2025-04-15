import React, { useMemo } from 'react';
import { SpriteType } from '../hooks/useSprites';

type SpriteTabsProps = {
  sprites: SpriteType[];
  activeTab: number;
  activeAction: Record<number, 'action1' | 'action2'>;
  setActiveAction: (spriteIndex: number, action: 'action1' | 'action2') => void;
};

const ActionButton: React.FC<{
  action: 'action1' | 'action2';
  isActive: boolean;
  onClick: () => void;
}> = ({ action, isActive, onClick }) => (
  <button
    className={`px-4 py-2 rounded ${
      isActive
        ? 'bg-green-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
    onClick={onClick}
  >
    {action === 'action1' ? 'Action 1' : 'Action 2'}
  </button>
);

const SpriteTabs: React.FC<SpriteTabsProps> = ({
  sprites,
  activeTab,
  activeAction,
  setActiveAction,
}) => {
  const hasBallSprite = useMemo(() => 
    sprites.some(sprite => sprite.type === 'ball'),
    [sprites]
  );
  
  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        <ActionButton
          action="action1"
          isActive={activeAction[activeTab] === 'action1'}
          onClick={() => setActiveAction(activeTab, 'action1')}
        />
        
        {hasBallSprite && (
          <ActionButton
            action="action2"
            isActive={activeAction[activeTab] === 'action2'}
            onClick={() => setActiveAction(activeTab, 'action2')}
          />
        )}
      </div>
    </div>
  );
};

export default SpriteTabs; 