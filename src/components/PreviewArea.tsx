import CatSprite from './CatSprite';
import BallSprite from './BallSprite';

type SpriteType = {
    type: string;
    x: number;
    y: number;
};

type PreviewAreaProps = {
    sprites: SpriteType[];
    rotation: number;
    message: string;
    onSpriteClick: () => void;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
    previewRef: React.RefObject<HTMLDivElement | null>;
    addSprite: () => void;
};


const PreviewArea: React.FC<PreviewAreaProps> = ({
                                                     sprites,
                                                     rotation,
                                                     message,
                                                     onSpriteClick,
                                                     onMouseDown,
                                                     previewRef,
                                                     addSprite,
                                                 })  => {
    const getSpriteComponent = (type: string) => {
        if (type === 'cat') return <CatSprite />;
        if (type === 'ball') return <BallSprite />;
        return null;
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
                            transform: `translate(${sprite.x}px, ${sprite.y}px) rotate(${rotation}deg)`,
                        }}
                        onMouseDown={(e) => onMouseDown(e, index)}
                        onClick={onSpriteClick}
                    >
                        {getSpriteComponent(sprite.type)}
                        {index === 0 && message && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded shadow">
                                {message}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {sprites.length > 0 && (
                <div className="mt-4 flex items-center gap-4 flex-wrap">
                    {sprites.map((sprite, index) => (
                        <div key={`thumb-${index}`}>
                            {getSpriteComponent(sprite.type)}
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
            )}
        </div>
    );
};

export default PreviewArea;
