export function loadDramaticText(text) {
    const dramaticText = document.createElement('div');
    dramaticText.id = 'dramaticText';
    dramaticText.style.position = 'absolute';
    dramaticText.style.top = '25%';
    dramaticText.style.left = '50%';
    dramaticText.style.transform = 'translate(-50%, -50%)';
    dramaticText.style.fontFamily = 'font, sans-serif';
    dramaticText.style.fontSize = '48px';
    dramaticText.style.color = 'rgba(255, 255, 255, 1)';
    dramaticText.style.textShadow = '4px 4px 4px rgba(187, 181, 181, 0.7)';
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

function splitTextToSpans(el) {
  const text = el.textContent;
  el.textContent = "";
  const spans = [];

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.textContent = text[i] === " " ? "\u00A0" : text[i];
    span.style.display = "inline-block";
    span.style.position = "relative";
    el.appendChild(span);
    spans.push(span);
  }

  return spans;
}

export function animateText(el, options = {}) {
  if (!el) return;

  const {
    wavy = false,
    waveAmplitude = 10,
    waveDuration = 1300,
    rainbow = false,
    rainbowDuration = 2000
  } = options;

  let spans = Array.from(el.children);
  if (spans.length === 0) {
    spans = splitTextToSpans(el);
  }

  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;

    spans.forEach((span, i) => {
      if (wavy) {
        const waveProgress = (timestamp - start) % waveDuration;
        const waveAngle = (waveProgress / waveDuration) * 2 * Math.PI;
        span.style.top = Math.sin(waveAngle + i * 0.4) * -waveAmplitude + "px";
      }

      if (rainbow) {
        const rainbowProgress = (timestamp - start) % rainbowDuration;
        const rainbowAngle = (rainbowProgress / rainbowDuration) * 2 * Math.PI;
        const hue = ((rainbowAngle + i * 0.4) * (180 / Math.PI)) % 360;
        span.style.color = `hsl(${hue}, 100%, 50%)`;
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Example usage:
// Only wavy
// animateText(document.getElementById("myText"), { wavy: true });

// Only rainbow
// animateText(document.getElementById("myText"), { rainbow: true });

// Both wavy and rainbow
// animateText(document.getElementById("myText"), { wavy: true, rainbow: true });
