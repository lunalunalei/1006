// 1. 設定可抽取的目的地列表
const destinations = [
    { name: "🍎 青森", code: "AOJ", desc: "蘋果與溫泉之旅" },
    { name: "❄️ 北海道", code: "CTS", desc: "雪景與海鮮饗宴" },
    { name: "👅 仙台", code: "SDJ", desc: "牛舌與浪漫巡禮" }
];

// 隨機抽取一個地點
const randomPrize = destinations[Math.floor(Math.random() * destinations.length)];

// 設定頁面文字
const prizeTextElem = document.getElementById('prizeText');
prizeTextElem.innerHTML = `恭喜抽中！<br>${randomPrize.name}`;

// 2. 初始化 HTML5 Canvas 刮刮膜
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 塗上灰色遮罩
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 在遮罩上寫字
    ctx.fillStyle = '#555555';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('刮開揭曉地點 ✈️', canvas.width / 2, canvas.height / 2 + 6);
}

// 繪製刮除效果
let isDrawing = false;
let isFinished = false;

function scratch(e) {
    if (!isDrawing || isFinished) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
}

// 計算刮開比例，超過 40% 自動完全揭曉並放花彩
function checkScratchPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = transparentPixels / (pixels.length / 4);

    if (percentage > 0.4 && !isFinished) {
        isFinished = true;
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 500);

        // 發放慶祝花彩效果 (Confetti)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// 事件監聽（支援手機觸控與電腦滑鼠）
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', scratch);

canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    scratch(e);
});
canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', scratch);

window.onload = initCanvas;