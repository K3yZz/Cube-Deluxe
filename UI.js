// import { player, playerStats } from './player.js';
// import { enemy, moneyItem } from './enemy.js';
// import { spaceTime } from './main.js';

//^ import { startIntervals, stopIntervals } from './interval.js';

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

// export function loadDebugInfo() {
//     const debugInfo = document.createElement('div');
//     debugInfo.id = 'debugInfo';
//     debugInfo.style.position = 'absolute';
//     debugInfo.style.top = '10px';
//     debugInfo.style.right = '10px';
//     debugInfo.style.fontFamily = 'Merriweather, serif';
//     debugInfo.style.fontSize = '14px';
//     debugInfo.style.color = 'white';
//     debugInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
//     debugInfo.style.padding = '10px';
//     debugInfo.style.borderRadius = '5px';
//     debugInfo.style.zIndex = '100';
//     debugInfo.style.pointerEvents = 'auto';
//     debugInfo.style.cursor = 'auto';

//     const select = document.createElement('select');
//     select.style.marginBottom = '10px';
//     select.style.pointerEvents = 'auto';
//     select.style.background = 'rgba(30,30,30,0.8)';
//     select.style.color = 'white';
//     select.style.border = '1px solid #444';
//     select.style.borderRadius = '3px';
//     select.style.fontFamily = 'inherit';
//     select.style.fontSize = 'inherit';

//     const options = [
//         { value: 'player', text: 'Player' },
//         { value: 'enemy', text: 'Enemies' },
//         { value: 'money', text: 'Money Items' },
//         { value: 'other', text: 'Other' },
//         { value: 'debug', text: 'Debug Tools' }
//     ];
//     options.forEach(opt => {
//         const option = document.createElement('option');
//         option.value = opt.value;
//         option.text = opt.text;
//         select.appendChild(option);
//     });

//     debugInfo.appendChild(select);

//     const infoContainer = document.createElement('div');
//     debugInfo.appendChild(infoContainer);

//     const debugControls = document.createElement('div');
//     debugControls.style.marginTop = '15px';

//     function addDebugButton(label, onClick) {
//         const btn = document.createElement('button');
//         btn.textContent = label;
//         btn.style.margin = '4px 4px 4px 0';
//         btn.addEventListener('click', onClick);
//         debugControls.appendChild(btn);
//     }
//     addDebugButton('Pause Game', () => {
//         spaceTime.paused = true;
//         startIntervals();
//     });
//     addDebugButton('Resume Game', () => {
//         spaceTime.paused = false;
//         stopIntervals();
//     });
//     addDebugButton('Add 10000 Money', () => {
//         playerStats.money += 10000;
//     });
//     addDebugButton('Kill All Enemies', () => {
//         if (Array.isArray(enemy)) enemy.splice(0, enemy.length);
//     });
//     addDebugButton('Clear Money Items', () => {
//         if (Array.isArray(moneyItem)) moneyItem.length = 0;
//     });

//     let currentEnemyPage = 0;
//     const ENEMIES_PER_PAGE = 3;
//     let currentMoneyPage = 0;
//     const MONEY_ITEMS_PER_PAGE = 3;

//     function updateDebugInfo() {
//         infoContainer.innerHTML = '';
//         debugControls.style.display = 'none';

//         if (select.value === 'player') {
//             infoContainer.innerHTML = `
//                 <div style="font-weight:bold;">Player Info:</div>
//                 <div>Position: <span id="playerPos">${player.x}, ${player.y}</span></div>
//                 <div>Size: <span id="playerSize">${player.size}</span></div>
//                 <div>Background Opacity Change Speed: <span id="bgOpacitySpeed">${player.backgroundOpacityChangeSpeed}</span></div>
//                 <div>Max Health: <span id="playerMaxHealth">${playerStats.maxHealth}</span></div>
//                 <div>Strength: <span id="playerDamage">${playerStats.strength}</span></div>
//                 <div>Attack Speed: <span id="playerAttackSpeed">${playerStats.attackSpeed}</span></div>
//                 <div>Damage Tick Rate: <span id="playerDamageTickRate">${playerStats.damageTickRate}</span></div>
//                 <div>Health Decrease Int: <span id="playerHealthDecreaseInt">${playerStats.healthDecreaseInt}</span></div>
//                 <div>Money: <span id="playerMoney">${playerStats.money}</span></div>
//                 <div>Money This Run: <span id="playerMoneyThisRun">${playerStats.moneyThisRun}</span></div>
//                 <div>Money Mulitplier: <span id="playerMoneyMultiplier">${playerStats.moneyMultiplier}</span></div>
//                 <div>Vampire: <span id="playerVampire">${playerStats.vampire}</span></div>
//                 <div>Vamprism Buff: <span id="playervamprismBuff">${playerStats.vamprismBuff}</span></div>
//                 <div>Magnet: <span id="playerMagnet">${playerStats.magnet}</span></div>
//             `;
//         } else if (select.value === 'enemy') {
//             let enemyInfo = '';
//             let totalEnemyPages = 1;
//             if (Array.isArray(enemy)) {
//                 totalEnemyPages = Math.ceil(enemy.length / ENEMIES_PER_PAGE);
//                 enemyInfo += `<div style="font-weight:bold;">Enemy Info:</div>`;
//                 enemyInfo += `<div>Enemy Count: <span id="enemyCount">${enemy.length}</span></div>`;
//                 const startIdx = currentEnemyPage * ENEMIES_PER_PAGE;
//                 const endIdx = Math.min(startIdx + ENEMIES_PER_PAGE, enemy.length);
//                 for (let idx = startIdx; idx < endIdx; idx++) {
//                     const en = enemy[idx];
//                     enemyInfo += `
//                         <div style="margin-top:6px;"><b>Enemy #${idx + 1}</b></div>
//                         <div>Position: ${Math.round(en.x)}, ${Math.round(en.y)}</div>
//                         <div>Size: ${en.size}</div>
//                         <div>Health: ${en.health}/${en.maxHealth}</div>
//                         <div>Boss: ${en.boss}</div>
//                         <div>Type: ${en.type}</div>
//                         <div>Color: ${en.color}</div>
//                         <div>Rotation: ${en.rotation.toFixed(2)}</div>
//                         <div>Last Hit Time: ${en.lastHitTime.toFixed(2)}</div>
//                     `;
//                 }
//                 enemyInfo += `
//                     <div style="margin-top:10px;">
//                         <button id="enemyPrevBtn" ${currentEnemyPage === 0 ? 'disabled' : ''}>Prev</button>
//                         <span> Page ${currentEnemyPage + 1} / ${totalEnemyPages} </span>
//                         <button id="enemyNextBtn" ${currentEnemyPage >= totalEnemyPages - 1 ? 'disabled' : ''}>Next</button>
//                     </div>
//                 `;
//             } else {
//                 enemyInfo += `<div>No enemy data</div>`;
//             }
//             infoContainer.innerHTML = enemyInfo;

//             const prevBtn = infoContainer.querySelector('#enemyPrevBtn');
//             const nextBtn = infoContainer.querySelector('#enemyNextBtn');
//             if (prevBtn) prevBtn.onclick = () => { if (currentEnemyPage > 0) { currentEnemyPage--; updateDebugInfo(); } };
//             if (nextBtn) nextBtn.onclick = () => { if (currentEnemyPage < totalEnemyPages - 1) { currentEnemyPage++; updateDebugInfo(); } };
//         } else if (select.value === 'money') {
//             let moneyItemInfo = '';
//             let totalMoneyPages = 1;
//             if (Array.isArray(moneyItem)) {
//                 totalMoneyPages = Math.ceil(moneyItem.length / MONEY_ITEMS_PER_PAGE);
//                 moneyItemInfo += `<div style="font-weight:bold;">Money Item Info:</div>`;
//                 moneyItemInfo += `<div>Money Item Count: <span id="moneyItemCount">${moneyItem.length}</span></div>`;
//                 const startIdx = currentMoneyPage * MONEY_ITEMS_PER_PAGE;
//                 const endIdx = Math.min(startIdx + MONEY_ITEMS_PER_PAGE, moneyItem.length);
//                 for (let idx = startIdx; idx < endIdx; idx++) {
//                     const mi = moneyItem[idx];
//                     moneyItemInfo += `
//                         <div style="margin-top:6px;"><b>Money Item #${idx + 1}</b></div>
//                         <div>Position: ${Math.round(mi.x)}, ${Math.round(mi.y)}</div>
//                     `;
//                 }
//                 moneyItemInfo += `
//                     <div style="margin-top:10px;">
//                         <button id="moneyPrevBtn" ${currentMoneyPage === 0 ? 'disabled' : ''}>Prev</button>
//                         <span> Page ${currentMoneyPage + 1} / ${totalMoneyPages} </span>
//                         <button id="moneyNextBtn" ${currentMoneyPage >= totalMoneyPages - 1 ? 'disabled' : ''}>Next</button>
//                     </div>
//                 `;
//             } else {
//                 moneyItemInfo += `<div>No money item data</div>`;
//             }
//             infoContainer.innerHTML = moneyItemInfo;

//             const moneyPrevBtn = infoContainer.querySelector('#moneyPrevBtn');
//             const moneyNextBtn = infoContainer.querySelector('#moneyNextBtn');
//             if (moneyPrevBtn) moneyPrevBtn.onclick = () => { if (currentMoneyPage > 0) { currentMoneyPage--; updateDebugInfo(); } };
//             if (moneyNextBtn) moneyNextBtn.onclick = () => { if (currentMoneyPage < totalMoneyPages - 1) { currentMoneyPage++; updateDebugInfo(); } };
//         } else if (select.value === 'other') {
//             infoContainer.innerHTML = `
//                 <div style="font-weight:bold;">Other Info:</div>
//                 <div>Game Paused: <span id="gamePaused">${spaceTime.paused}</span></div>
//                 <div>Off Tab: <span id="gameOffTab">${spaceTime.offTab}</span></div>
//                 <div>Skill Tree Open: <span id="skillTreeOpen">${spaceTime.skillTreeOpen}</span></div>
//                 <div>Ran Once: <span id="ranOnce">${spaceTime.ranOnce}</span></div>
//             `;
//         } else if (select.value === 'debug') {
//             infoContainer.innerHTML = `<div style="font-weight:bold;">Debug Tools:</div>`;
//             debugControls.style.display = '';
//         }
//     }

//     document.body.appendChild(debugInfo);
//     debugInfo.appendChild(debugControls);
//     updateDebugInfo();

//     select.addEventListener('change', () => {
//         currentEnemyPage = 0;
//         currentMoneyPage = 0;
//         updateDebugInfo();
//     });
//     setInterval(updateDebugInfo, 100);

//     return debugInfo;
// }


window.addEventListener('resize', () => {
    if (backgroundCanvas && playerCanvas) {
        backgroundCanvas.width = playerCanvas.width = window.innerWidth;
        backgroundCanvas.height = playerCanvas.height = window.innerHeight;
    }
});