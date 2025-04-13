import { useRef, useState } from "react";

export type SpriteType = {
    type: string;
    x: number;
    y: number;
};

export const useSprites = () => {
    const [sprites, setSprites] = useState<SpriteType[]>([
        { type: "cat", x: 100, y: 100 },
    ]);

    const draggingIndex = useRef<number | null>(null);
    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (
        e: React.MouseEvent,
        index: number,
        previewRef: React.RefObject<HTMLDivElement>
    ) => {
        draggingIndex.current = index;
        const sprite = sprites[index];
        offset.current = {
            x: e.clientX - sprite.x,
            y: e.clientY - sprite.y,
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (draggingIndex.current === null) return;
            const idx = draggingIndex.current;
            const bounds = previewRef.current?.getBoundingClientRect();

            let newX = e.clientX - offset.current.x;
            let newY = e.clientY - offset.current.y;

            if (bounds) {
                newX = Math.max(0, Math.min(newX, bounds.width - 50));
                newY = Math.max(0, Math.min(newY, bounds.height - 50));
            }

            setSprites((prev) => {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], x: newX, y: newY };
                return updated;
            });
        };

        const handleMouseUp = () => {
            draggingIndex.current = null;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const addSprite = () => {
        setSprites((prev) => [...prev, { type: "ball", x: 50, y: 50 }]);
    };

    const updateSprite = (index: number, update: Partial<SpriteType>) => {
        setSprites((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...update };
            return updated;
        });
    };

    return {
        sprites,
        setSprites,
        addSprite,
        updateSprite,
        handleMouseDown,
    };
};
