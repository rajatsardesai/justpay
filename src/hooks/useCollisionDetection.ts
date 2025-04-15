import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { SpriteType } from "./useSprites";
import { toast } from "react-toastify";

const checkCollision = (sprite1: SpriteType, sprite2: SpriteType): boolean => {
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;
    const bufferZone = 0.2;
    const minDistance = (sprite1.width + sprite2.width) * (0.5 + bufferZone);
    const minHeight = (sprite1.height + sprite2.height) * (0.5 + bufferZone);
    
    return Math.abs(dx) < minDistance && Math.abs(dy) < minHeight;
};

export const useCollisionDetection = (
    sprites: SpriteType[],
    setSprites: Dispatch<SetStateAction<SpriteType[]>>,
    setActiveAction: Dispatch<SetStateAction<Record<number, 'action1' | 'action2'>>>
) => {
    const lastCollisionTime = useRef<number>(0);
    const hasSwappedActions = useRef<boolean>(false);
    const COLLISION_COOLDOWN = 1000;

    const checkCollisionAndSwap = () => {
        if (sprites.length < 2) return;
        
        const sprite1 = sprites[0];
        const sprite2 = sprites[1];
        const now = Date.now();
        
        if (now - lastCollisionTime.current < COLLISION_COOLDOWN || hasSwappedActions.current) return;
        
        if (checkCollision(sprite1, sprite2)) {
            lastCollisionTime.current = now;
            hasSwappedActions.current = true;

            setActiveAction(prev => {
                const action1 = prev[0];
                const action2 = prev[1];
                
                toast.info(`Actions swapped! Sprite 1 now has ${action2} and Sprite 2 now has ${action1}`);
                
                return {
                    ...prev,
                    0: action2,
                    1: action1
                };
            });

            const dx = sprite2.x - sprite1.x;
            const dy = sprite2.y - sprite1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const minDistance = (sprite1.width + sprite2.width) / 2;
            const moveDistance = (minDistance - distance) / 2;
            
            setSprites(prev => {
                const updated = [...prev];
                const moveX = moveDistance * Math.cos(angle);
                const moveY = moveDistance * Math.sin(angle);
                
                updated[0] = {
                    ...updated[0],
                    x: updated[0].x - moveX,
                    y: updated[0].y - moveY
                };
                updated[1] = {
                    ...updated[1],
                    x: updated[1].x + moveX,
                    y: updated[1].y + moveY
                };
                
                return updated;
            });
        } else {
            hasSwappedActions.current = false;
        }
    };

    useEffect(() => {
        const interval = setInterval(checkCollisionAndSwap, 50);
        return () => clearInterval(interval);
    }, [sprites]);

    return { checkCollisionAndSwap };
}; 