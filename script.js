// 1. 設定包含 6 個地點的抽獎池
const destinations = [
    { name: "🍎 青森", code: "AOJ", desc: "蘋果與溫泉之旅" },
    { name: "❄️ 北海道", code: "CTS", desc: "雪景與海鮮饗宴" },
    { name: "👅 仙台", code: "SDJ", desc: "牛舌與浪漫巡禮" },
    { name: "🗼 東京", code: "TYO", desc: "時尚與迪士尼之旅" },
    { name: "🌴 沖繩", code: "OKA", desc: "陽光與海灘渡假" },
    { name: "🍊 濟州島", code: "CJU", desc: "浪漫海島與黑豬肉" }
];

let canvas, ctx;
let isDrawing = false;
let isFinished = false;

function initScratchCard() {
    canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // 1. 隨機抽取一個地點
    const randomPrize = destinations[Math.floor(Math.random() * destinations.length)];
    const prizeTextElem = document.getElementById('prizeText');
    prizeTextElem.innerHTML = `一起去～～<br>${randomPrize.name}`;

    // 2. 正確校正 Canvas 的手機解析度
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || canvas.offsetWidth || 300;
    canvas.height = rect.height || canvas.offsetHeight || 110;

    // 3. 繪製灰色刮刮膜遮罩
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4. 在遮罩上印製提示文字
    ctx.fillStyle = '#555555';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('刮開揭曉地點 ✈️', canvas.width / 2, canvas.height / 2);

    // 5. 綁定觸控與滑鼠事件
    setupEvents();
}

function scratch(e) {
    if (!isDrawing || isFinished) return;
    if (e.cancelable) e.preventDefault(); // 防止手機畫面捲動
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
}

function checkScratchPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = transparentPixels / (pixels.length / 4);

    // 刮開超過 35% 自動全部揭曉並放花彩
    if (percentage > 0.35 && !isFinished) {
        isFinished = true;
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 500);

        // 慶祝花彩效果
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }
}

function setupEvents() {
    // 滑鼠事件
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);

    // 手機觸控事件
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch, { passive: false });
}

// 確保手機 DOM 完全載入後才初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initScratchCard, 100);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initScratchCard, 100);
    });
}
