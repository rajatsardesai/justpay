export default function BallSprite() {
    return (
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="ballGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#ff3d00"/>
                </radialGradient>
                <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="4" dy="4" stdDeviation="4" flood-color="rgba(0, 0, 0, 0.4)"/>
                </filter>
            </defs>

            <circle cx="100" cy="100" r="50" fill="url(#ballGradient)" filter="url(#shadow)"/>
        </svg>

    )
}