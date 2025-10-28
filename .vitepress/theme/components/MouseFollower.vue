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
  // 新增圆球配置
  BALL: {
    RADIUS: 12,// 圆球半径
    GRADIENT_START: [0, 186, 173, 1],  // 圆球渐变起始色
    GRADIENT_END: [228, 185, 103, 0]   // 圆球渐变结束色
  }
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

// 颜色插值函数
const lerp = (a, b, t) => a + (b - a) * t;

// 颜色渐变计算
const getColor = (index) => {
  const t = index / (MOUSE_CONFIG.MAX_LENGTH - 1);
  return [
    Math.round(lerp(MOUSE_CONFIG.COLOR_START[0], MOUSE_CONFIG.COLOR_END[0], t)),
    Math.round(lerp(MOUSE_CONFIG.COLOR_START[1], MOUSE_CONFIG.COLOR_END[1], t)),
    Math.round(lerp(MOUSE_CONFIG.COLOR_START[2], MOUSE_CONFIG.COLOR_END[2], t)),
    Math.max(0, MOUSE_CONFIG.COLOR_END[3] + (MOUSE_CONFIG.COLOR_START[3] - MOUSE_CONFIG.COLOR_END[3]) * t)
  ];
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

// 新增：绘制鼠标中央的渐变圆球
const drawMouseBall = () => {
  if (!mouse.value.x || !mouse.value.y) return;

  // 创建径向渐变（从中心到边缘）
  const gradient = ctx.createRadialGradient(
      mouse.value.x, mouse.value.y, 0,  // 渐变中心
      mouse.value.x, mouse.value.y, MOUSE_CONFIG.BALL.RADIUS  // 渐变边缘
  );

  // 添加渐变颜色
  gradient.addColorStop(0, `rgba(${MOUSE_CONFIG.BALL.GRADIENT_START.join(', ')})`);
  gradient.addColorStop(1, `rgba(${MOUSE_CONFIG.BALL.GRADIENT_END.join(', ')})`);

  // 绘制圆球
  ctx.beginPath();
  ctx.arc(
      mouse.value.x,
      mouse.value.y,
      MOUSE_CONFIG.BALL.RADIUS,
      0,
      Math.PI * 2
  );
  ctx.fillStyle = gradient;
  ctx.fill();
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
  drawMouseBall();  // 新增：绘制圆球

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
