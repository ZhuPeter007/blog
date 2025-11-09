<template>
  <canvas
      ref="canvas"
      style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 999999"
  ></canvas>
</template>

<script setup>
import {ref, onMounted} from "vue";

const canvas = ref(null);
let ctx = null;
const trailPoints = [];
const MOUSE_CONFIG = {
  MAX_LENGTH: 6,
  COLOR_START: [0, 186, 173, 0.2],
  COLOR_END: [228, 185, 103, 1],
};

// 鼠标位置跟踪
const mouse = ref({x: 0, y: 0});

// 初始化画布
const initCanvas = () => {
  ctx = canvas.value.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
};

// 画布尺寸适配
const resizeCanvas = () => {
  if (!canvas.value) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
};

// 绘制渐变轨迹
const drawGradientTrail = () => {
  if (trailPoints.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

  // 创建整体渐变
  const gradient = ctx.createLinearGradient(
      trailPoints[0].x, trailPoints[0].y,
      trailPoints[trailPoints.length - 1].x, trailPoints[trailPoints.length - 1].y
  );

  // 添加颜色停靠点
  gradient.addColorStop(0, `rgba(${MOUSE_CONFIG.COLOR_START.join(', ')})`);
  gradient.addColorStop(1, `rgba(${MOUSE_CONFIG.COLOR_END.join(', ')})`);

  // 绘制路径
  trailPoints.forEach((point, index) => {
    if (index > 0) {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();
};

// 更新轨迹点
const updateTrail = () => {
  trailPoints.push({...mouse.value});

  // 保持轨迹长度
  if (trailPoints.length > MOUSE_CONFIG.MAX_LENGTH) {
    trailPoints.shift();
  }
};

// 动画循环
const animate = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  updateTrail();
  drawGradientTrail();

  requestAnimationFrame(animate);
};

// 事件处理
const handleMouseMove = (e) => {
  const rect = canvas.value.getBoundingClientRect();
  mouse.value.x = e.clientX - rect.left;
  mouse.value.y = e.clientY - rect.top;
};

// 生命周期
onMounted(() => {
  initCanvas();
  window.addEventListener("mousemove", handleMouseMove);
  animate();
});
</script>

<style scoped>
canvas {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
}
</style>
