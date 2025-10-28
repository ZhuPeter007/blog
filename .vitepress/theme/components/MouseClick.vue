<template>
  <canvas
      ref="canvas"
      style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 999999"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const canvas = ref(null);
let animationFrameId = null;
let circles = [];

// 组件属性，支持自定义配置
const props = defineProps({
  // 初始半径范围
  minInitialRadius: {type: Number, default: 10},
  maxInitialRadius: {type: Number, default: 10},

  // 最大半径范围
  minMaxRadius: {type: Number, default: 10},
  maxMaxRadius: {type: Number, default: 60},

  // 扩散速度范围
  minSpeed: {type: Number, default: 1},
  maxSpeed: {type: Number, default: 1},

  // 线宽范围
  minLineWidth: {type: Number, default: 2},
  maxLineWidth: {type: Number, default: 6},

  // 颜色配置，支持单一颜色或径向渐变
  // 示例: ["#FFF"] 或 ["#FF1461", "#18FF92", "#5A87FF"]
  colors: {
    type: Array,
    default: () => ["transparent", "#E4B967FF","rgba(255,255,255,0.2)"]
  }
});

// 设置画布大小
function setCanvasSize() {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  // 使用设备像素比以确保清晰度
  const dpr = window.devicePixelRatio || 1;
  canvasEl.width = window.innerWidth * dpr;
  canvasEl.height = window.innerHeight * dpr;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";

  const ctx = canvasEl.getContext("2d");
  ctx.scale(dpr, dpr);
}

// 创建圆形扩散效果
function createCircle(x, y) {
  const radius = props.minInitialRadius + (props.maxInitialRadius - props.minInitialRadius);
  const maxRadius = props.minMaxRadius + (props.maxMaxRadius - props.minMaxRadius);
  const speed = props.minSpeed +  (props.maxSpeed - props.minSpeed);
  const lineWidth = props.minLineWidth + (props.maxLineWidth - props.minLineWidth);

  return {
    x,
    y,
    radius,
    maxRadius,
    lineWidth,
    alpha: 1,
    speed,
    colors: [...props.colors], // 复制颜色配置
    draw(ctx) {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.lineWidth = this.lineWidth;

      // 处理颜色 - 支持径向渐变
      if (this.colors.length > 1) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );

        // 均匀分布渐变颜色
        this.colors.forEach((color, index) => {
          const offset = index / (this.colors.length - 1);
          gradient.addColorStop(offset, color);
        });

        ctx.strokeStyle = gradient;
      } else {
        ctx.strokeStyle = this.colors[0] || "#FFFFFF";
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    update() {
      this.radius += this.speed;
      this.alpha *= 0.97;
      this.lineWidth *= 0.98;
      return this.radius < this.maxRadius && this.alpha > 0.01;
    }
  };
}

// 动画循环
function animate() {
  const canvasEl = canvas.value;
  if (!canvasEl) return;

  const ctx = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // 更新并绘制圆形
  circles = circles.filter(circle => {
    const shouldKeep = circle.update();
    circle.draw(ctx);
    return shouldKeep;
  });

  animationFrameId = requestAnimationFrame(animate);
}

// 处理点击事件
function handleClick(e) {
  // 获取点击位置
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);

  if (x !== undefined && y !== undefined) {
    circles.push(createCircle(x, y));
  }
}

onMounted(() => {
  setCanvasSize();

  // 判断设备支持的事件类型
  const tapEvent = "ontouchstart" in window ? "touchstart" : "mousedown";
  window.addEventListener(tapEvent, handleClick);
  window.addEventListener("resize", setCanvasSize);

  animate();
});

// 监听颜色变化，更新现有圆形的颜色
watch(() => props.colors, (newColors) => {
  circles.forEach(circle => {
    circle.colors = [...newColors];
  });
});
</script>
