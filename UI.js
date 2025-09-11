let backgroundCanvas, playerCanvas, skillTreeCanvas, enemyCanvas, deathOverlay;

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
    skillTreeCanvas.style.zIndex = '-999'; //3

    skillTreeCanvas.id = 'skillTreeCanvas';
    
    skillTreeCanvas.style.pointerEvents = 'none';

    skillTreeCanvas.style.backgroundColor = 'rgb(8, 8, 8)';

    document.body.appendChild(skillTreeCanvas);
    return skillTreeCanvas;
}

export function loadDeathOverlay() {
    deathOverlay = document.createElement('canvas');
    deathOverlay.width = window.innerWidth;
    deathOverlay.height = window.innerHeight;
    deathOverlay.style.position = "absolute";

    deathOverlay.style.zIndex = '-999'; //5

    deathOverlay.id = 'deathOverlay';
    
    deathOverlay.style.pointerEvents = 'none';

    deathOverlay.style.backgroundColor = "transparent";

    function drawScanlines() {
        const ctx = deathOverlay.getContext('2d');

        const lineHeight = 2;
        const lineSpacing = 2;

        for (let y = 0; y < window.innerHeight; y += (lineHeight + lineSpacing)) {
            ctx.fillStyle = 'rgba(11, 200, 233, 0.28)';
            ctx.fillRect(0, y, window.innerWidth, lineHeight);
        }
    }

    drawScanlines();
    window.addEventListener('resize', drawScanlines);

    document.body.appendChild(deathOverlay);
    return deathOverlay;
}

export function loadDramaticText(text) {
    const dramaticText = document.createElement('div');
    dramaticText.id = 'dramaticText';
    dramaticText.style.position = 'absolute';
    dramaticText.style.top = '25%';
    dramaticText.style.left = '50%';
    dramaticText.style.transform = 'translate(-50%, -50%)';
    dramaticText.style.fontFamily = 'font, sans-serif';
    dramaticText.style.fontSize = '48px';
    dramaticText.style.color = 'rgba(255, 0, 0, 1)';
    dramaticText.style.textShadow = '4px 4px 4px rgba(147, 16, 16, 0.7)';
    dramaticText.style.fontWeight = 'bold';
    dramaticText.style.textAlign = 'center';
    dramaticText.style.zIndex = '20';
    dramaticText.style.pointerEvents = 'none';
    dramaticText.style.opacity = '0';

    dramaticText.innerText = text;
    
    document.body.appendChild(dramaticText);

    dramaticText.style.transition = 'opacity 1s ease-in-out';

     requestAnimationFrame(() => {
        dramaticText.style.opacity = '1';
    });

    setTimeout(() => {
        dramaticText.style.opacity = '0';
    }, 3000);
    

    return dramaticText;
}

window.addEventListener('resize', () => {
    if (backgroundCanvas && playerCanvas) {
        backgroundCanvas.width = playerCanvas.width = window.innerWidth;
        backgroundCanvas.height = playerCanvas.height = window.innerHeight;
    }
});