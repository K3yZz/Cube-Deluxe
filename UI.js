let backgroundCanvas, playerCanvas, skillTreeCanvas, enemyCanvas, statsCanvas;

export function loadBackgroundCanvas() {
    backgroundCanvas = document.createElement('canvas');

    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    backgroundCanvas.style.position = 'absolute';
    backgroundCanvas.style.zIndex = '0';
    backgroundCanvas.style.backgroundColor = 'rgb(8, 8, 8)';

    function loadBackgroundEffect() {
        const ctx = backgroundCanvas.getContext('2d');
        const stars = [];
    
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * backgroundCanvas.width,
                y: Math.random() * backgroundCanvas.height,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.5,
            });
        }
    
        function drawStars() {
            ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            stars.forEach(star => {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(drawStars);
        }
        drawStars();
    }
    loadBackgroundEffect();
    document.body.appendChild(backgroundCanvas);
    return backgroundCanvas;
}

export function loadPlayerCanvas() {
    playerCanvas = document.createElement('canvas');

    playerCanvas.width = window.innerWidth;
    playerCanvas.height = window.innerHeight;

    playerCanvas.style.position = 'absolute';
    playerCanvas.style.zIndex = '2';
    document.body.appendChild(playerCanvas);
    return playerCanvas;
}

export function loadEnemyCanvas() {
    enemyCanvas = document.createElement('canvas');

    enemyCanvas.width = window.innerWidth;
    enemyCanvas.height = window.innerHeight;

    enemyCanvas.style.position = 'absolute';
    enemyCanvas.style.zIndex = '1';
    enemyCanvas.style.pointerEvents = 'none';
    document.body.appendChild(enemyCanvas);
    return enemyCanvas;
}

export function loadSkillTreeCanvas() {
    skillTreeCanvas = document.createElement('canvas');

    skillTreeCanvas.width = window.innerWidth;
    skillTreeCanvas.height = window.innerHeight;

    skillTreeCanvas.style.position = 'absolute';
    skillTreeCanvas.style.zIndex = '-999';

    skillTreeCanvas.id = 'skillTreeCanvas';
    
    skillTreeCanvas.style.pointerEvents = 'none';

    skillTreeCanvas.style.backgroundColor = 'rgb(8, 8, 8)';

    document.body.appendChild(skillTreeCanvas);
    return skillTreeCanvas;
}

export function loadStatsCanvas() {
    statsCanvas = document.createElement('canvas');

    statsCanvas.width = window.innerWidth;
    statsCanvas.height = window.innerHeight;
    statsCanvas.style.position = "absolute";

    statsCanvas.style.zIndex = '4';
    
    statsCanvas.style.pointerEvents = 'none';
    statsCanvas.style.backgroundColor = "transparent";

    document.body.appendChild(statsCanvas);
    return statsCanvas;
}

window.addEventListener('resize', () => {
    if (backgroundCanvas && playerCanvas) {
        backgroundCanvas.width = playerCanvas.width = window.innerWidth;
        backgroundCanvas.height = playerCanvas.height = window.innerHeight;
    }
});