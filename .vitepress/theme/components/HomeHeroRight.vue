<script setup>
import { onMounted } from 'vue'



onMounted(() => {
  console.log('HomeHeroRight mounted')
  const target = document.querySelector('.VPHero .container .image .image-bg')
  // target.innerHTML=''
  target.remove()
})
</script>

<template>
   <div class="domain2">
     <div class="show">
       <div class="item-0" ><img src="/public/heroImgs/moon0.svg" alt=""></div>
       <div class="item-1" ><img src="/public/heroImgs/moon1.svg" alt=""></div>
       <div class="item-2" ><img src="/public/heroImgs/moon2.svg" alt=""></div>
       <div class="item-3" ><img src="/public/heroImgs/moon3.svg" alt=""></div>
       <div class="item-4" ><img src="/public/heroImgs/moon4.svg" alt=""></div>
       <div class="item-5" ><img src="/public/heroImgs/moon5.svg" alt=""></div>
       <div class="item-6" ><img src="/public/heroImgs/moon6.svg" alt=""></div>
       <div class="item-7" ><img src="/public/heroImgs/moon7.svg" alt=""></div>
       <div class="item-8" ><img src="/public/heroImgs/moon8.svg" alt=""></div>
       <div class="item-9" ><img src="/public/heroImgs/moon9.svg" alt=""></div>
       <div class="item-10"><img  src="/public/heroImgs/moon10.svg" alt=""></div>
       <div class="item-11"><img  src="/public/heroImgs/moon11.svg" alt=""></div>
     </div>
     <div class="cover"></div>
   </div>
</template>

<style scoped>
@keyframes rotating {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(-360deg);
  }
}
@keyframes reversal {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
.domain2{
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.domain2 .show{
  background-color: #888888;
  position: relative;
  animation: rotating 24s infinite linear;
  left: 140px;
  top: 120px;
}

.domain2 .show div{
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
}
.domain2 .show  div img{
  max-width: none;
  animation: reversal 24s infinite linear;
}

.domain2 .show .item-0  { transform: translate(0, -240px); }               /* (0°) 顶部 */
.domain2 .show .item-1  { transform: translate(120px, -207.85px); }       /* (-60°) 右上 */
.domain2 .show .item-2  { transform: translate(207.85px, -120px); }       /* (-30°) 右中 */
.domain2 .show .item-3  { transform: translate(240px, 0); }               /* (0°) 右侧 */
.domain2 .show .item-4  { transform: translate(207.85px, 120px); }        /* (30°) 右下 */
.domain2 .show .item-5  { transform: translate(120px, 207.85px); }        /* (60°) 左下 */
.domain2 .show .item-6  { transform: translate(0, 240px); }               /* (90°) 底部 */
.domain2 .show .item-7  { transform: translate(-120px, 207.85px); }       /* (120°) 左下 */
.domain2 .show .item-8  { transform: translate(-207.85px, 120px); }       /* (150°) 左中 */
.domain2 .show .item-9  { transform: translate(-240px, 0); }              /* (180°) 左侧 */
.domain2 .show .item-10 { transform: translate(-207.85px, -120px); }       /* (210°) 左上 */
.domain2 .show .item-11 { transform: translate(-120px, -207.85px); }      /* (240°) 右上 */

.domain2 .cover{
  background: radial-gradient(50% 50% at 50% 50%, transparent 0%, #191919 100%);
  width: 402px;
  height: 402px;
  position: absolute;
}
</style>
