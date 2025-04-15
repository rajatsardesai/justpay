import { useRef, useState, useCallback, useEffect } from "react";

export type SpriteType = {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    motionInstructions: MotionInstruction[];
    currentAnimation: Animation | null;
    rotation: number;
    speed: number;
};

type MotionInstruction = {
    type: 'move' | 'turn';
    steps?: number;
    degrees?: number;
};

type Animation = {
    id: string;
    frames: string[];
    currentFrame: number;
};

export const useSprites = () => {
    const [sprites, setSprites] = useState<SpriteType[]>([
        {
            type: "cat",
            x: 200,
            y: 200,
            width: 95,
            height: 100,
            motionInstructions: [],
            currentAnimation: null,
            rotation: 0,
            speed: 10
        }
    ]);

    const [isPlaying, setIsPlaying] = useState(false);
    const draggingIndex = useRef<number | null>(null);
    const offset = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef<number | null>(null);

    const detectCollision = useCallback((sprite1: SpriteType, sprite2: SpriteType) => {
        return (
            sprite1.x < sprite2.x + sprite2.width &&
            sprite1.x + sprite1.width > sprite2.x &&
            sprite1.y < sprite2.y + sprite2.height &&
            sprite1.y + sprite1.height > sprite2.y
        );
    }, []);

    const swapSpriteBehaviors = useCallback((index1: number, index2: number) => {
        setSprites(prev => {
            const updated = [...prev];
            const temp = {
                motionInstructions: updated[index1].motionInstructions,
                currentAnimation: updated[index1].currentAnimation,
                speed: updated[index1].speed
            };

            updated[index1] = {
                ...updated[index1],
                motionInstructions: updated[index2].motionInstructions,
                currentAnimation: updated[index2].currentAnimation,
                speed: updated[index2].speed
            };

            updated[index2] = {
                ...updated[index2],
                motionInstructions: temp.motionInstructions,
                currentAnimation: temp.currentAnimation,
                speed: temp.speed
            };

            return updated;
        });
    }, []);

    const updateSpritePosition = useCallback((index: number) => {
        setSprites(prev => {
            const sprite = { ...prev[index] };
            const radians = sprite.rotation * Math.PI / 180;

            sprite.motionInstructions.forEach(instruction => {
                if (instruction.type === 'move' && instruction.steps) {
                    sprite.x += Math.cos(radians) * sprite.speed * (instruction.steps / Math.abs(instruction.steps));
                    sprite.y += Math.sin(radians) * sprite.speed * (instruction.steps / Math.abs(instruction.steps));
                } else if (instruction.type === 'turn' && instruction.degrees) {
                    sprite.rotation += instruction.degrees;
                }
            });

            sprite.x = Math.max(0, Math.min(sprite.x, window.innerWidth - sprite.width));
            sprite.y = Math.max(0, Math.min(sprite.y, window.innerHeight - sprite.height));

            const updated = [...prev];
            updated[index] = sprite;
            return updated;
        });
    }, []);

    const checkCollisions = useCallback(() => {
        for (let i = 0; i < sprites.length; i++) {
            for (let j = i + 1; j < sprites.length; j++) {
                if (detectCollision(sprites[i], sprites[j])) {
                    swapSpriteBehaviors(i, j);
                }
            }
        }
    }, [sprites, detectCollision, swapSpriteBehaviors]);

    const animate = useCallback(() => {
        if (!isPlaying) return;

        sprites.forEach((_, index) => {
            updateSpritePosition(index);
        });
        checkCollisions();

        animationFrameId.current = requestAnimationFrame(animate);
    }, [isPlaying, sprites, updateSpritePosition, checkCollisions]);

    useEffect(() => {
        if (isPlaying) {
            animationFrameId.current = requestAnimationFrame(animate);
        } else if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isPlaying, animate]);

    const addSprite = () => {
        setSprites(prev => [
            ...prev,
            {
                type: "ball",
                x: 400,
                y: 200,
                width: 50,
                height: 50,
                motionInstructions: [],
                currentAnimation: null,
                rotation: 0,
                speed: 10
            }
        ]);
    };

    const addMotionInstruction = (spriteIndex: number, instruction: MotionInstruction) => {
        setSprites(prev => {
            const updated = [...prev];
            updated[spriteIndex] = {
                ...updated[spriteIndex],
                motionInstructions: [...updated[spriteIndex].motionInstructions, instruction]
            };
            return updated;
        });
    };

    const setAnimation = (spriteIndex: number, animation: Animation) => {
        setSprites(prev => {
            const updated = [...prev];
            updated[spriteIndex] = {
                ...updated[spriteIndex],
                currentAnimation: animation
            };
            return updated;
        });
    };

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const handleMouseDown = (
        e: React.MouseEvent,
        index: number,
        previewRef: HTMLDivElement | null
    ) => {
        e.preventDefault(); // Prevent default to ensure proper drag handling
        draggingIndex.current = index;
        const sprite = sprites[index];
        offset.current = {
            x: e.clientX - sprite.x,
            y: e.clientY - sprite.y,
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (draggingIndex.current === null) return;
            const idx = draggingIndex.current;
            const bounds = previewRef?.getBoundingClientRect();

            if (bounds) {
                const newX = e.clientX - offset.current.x;
                const newY = e.clientY - offset.current.y;

                const maxX = bounds.width - sprites[idx].width;
                const maxY = bounds.height - sprites[idx].height;

                setSprites(prev => {
                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        x: Math.max(0, Math.min(newX, maxX)),
                        y: Math.max(0, Math.min(newY, maxY))
                    };
                    return updated;
                });
            }
        };

        const handleMouseUp = () => {
            draggingIndex.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return {
        sprites,
        setSprites,
        addSprite,
        addMotionInstruction,
        setAnimation,
        isPlaying,
        togglePlay,
        handleMouseDown,
    };
};
