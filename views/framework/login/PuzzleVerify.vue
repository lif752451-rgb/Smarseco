<template>
  <div class="slide-verify" style="width: 350px" id="slideVerify" onselectstart="return false;" @mouseleave="$emit('slideOut')">
    <!-- 图片加载遮蔽罩 -->
    <div :class="{ 'slider-verify-loading': loadBlock }"></div>
    <canvas width="350" height="213" ref="canvas"/>
    <canvas width="93" height="213" ref="block" class="slide-verify-block"/>
    <div @click="handleReset" class="slide-verify-refresh-icon"></div>
    <!-- container -->
    <div class="slide-verify-slider" :class="{'container-active': containerActive, 'container-success': containerSuccess }">
      <div class="slide-verify-slider-mask" :style="{
        width: sliderMaskWidth, backgroundColor: hoverBgColor ? hoverBgColor: '#FFF1D6'
      }">
        <!-- slider -->
        <div @mousedown="sliderDown"
             @touchstart="touchStartEvent"
             @touchmove="touchMoveEvent"
             @touchend="touchEndEvent"
             class="slide-verify-slider-mask-item"
             :style="{ left: sliderLeft, backgroundColor: hoverColor ? hoverColor: '#FFA500' }"
        >
          <div class="slide-verify-slider-mask-item-icon"></div>
        </div>
      </div>
      <span class="slide-verify-slider-text">向右滑</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqCheck } from '/@/api/framework/login';
import { ref, onMounted, watch } from "vue";
const props = defineProps({
  imgs: { type: String, default: '' },
  sliderImg: { type: String, default: '' },
  uuid: { type: String, default: '' },
  productFontColor: { type: String, default: '' }
})
const emits = defineEmits<{
  (e: 'success', verifyId: string): void,
  (e: 'refresh'): void,
  (e: 'slideOut'): void
}>()

let width = 350, height = 213;
const hoverColor = ref<string>('')
const hoverBgColor = ref<string>('')
onMounted(() => {
  if (props.productFontColor) {
    hoverColor.value = toColor(props.productFontColor,'1');
    hoverBgColor.value = toColor(props.productFontColor,'0.3');
  }
  init()
})

watch(() => props.sliderImg, _ => {
  canvasCtx.clearRect(0,0, width, height)
  blockCtx.clearRect(0,0, 93, height)
  init()
})

const toColor = (color: string, p: string): string => {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(reg.test(color)){
    return colorHex(color, p);
  }else{
    let hoverColor = '';
    let Numbers: RegExpMatchArray = color.match(/(\d(\.\d+)?)+/g);
    if(Numbers && Numbers.length){
      hoverColor = `rgba(${ Numbers.slice(0,3).concat(p)?.join(',') })`;
      return hoverColor;
    }
    return ''
  }
}

/** 生成十六位进制颜色值 */
const colorHex = (h, p): string => {
  // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  let color = h;
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    let colorChange: number[] = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    colorChange = colorChange.slice(0,3).concat(p);
    return "rgba(" + colorChange.join(",") + ")";
  } else {
    return color;
  }
}

/** 初始化事件 */
const init = (): void => {
  initDom()
  initImg()
  initSmallImg()
  bindEvents()
}

/** 初始化画布 */
const canvas = ref()
const block = ref()
let canvasCtx, blockCtx;
const initDom = (): void => {
  canvasCtx = canvas.value.getContext('2d')
  blockCtx = block.value.getContext('2d')
}

/** 初始化图片 */
const bgImage = ref<HTMLImageElement>()
const loadBlock = ref<boolean>(true)
const initImg = (): void => {
  bgImage.value = createImg(() => {
    // 图片加载完关闭遮蔽罩
    loadBlock.value = false
    canvasCtx.drawImage(bgImage.value, 0, 0, width, height)
  })
}
const createImg = (onload): HTMLImageElement => {
  const img = document.createElement('img')
  img.crossOrigin = 'Anonymous'
  img.onload = onload
  img.onerror = () => {
    img.src = props.imgs
  }
  img.src = props.imgs as string
  return img
}

/** 初始化小图 */
const smallImage = ref<HTMLImageElement>();
const initSmallImg = (): void => {
  smallImage.value = createSmallImg(() => {
    // 图片加载完关闭遮蔽罩
    loadBlock.value = false
    blockCtx.drawImage(smallImage.value, 0, 0, 93, height)
  })
}
const createSmallImg = (onload): HTMLImageElement => {
  const img = document.createElement('img')
  img.crossOrigin = 'Anonymous'
  img.onload = onload
  img.onerror = (): void => {
    img.src = props.sliderImg
  }
  img.src = props.sliderImg
  return img
}

/** 鼠标按下 */
let success: boolean = false,
    originX: number,
    originY: number,
    timestamp: number;
const isMouseDown = ref<boolean>(false)
const sliderDown = (event): void => {
  if (success) return
  originX = event.clientX
  originY = event.clientY
  isMouseDown.value = true
  timestamp = new Date().getTime()
}

/** 触摸开始事件 */
const touchStartEvent = (e): void | null => {
  if (success) return;
  originX = e.changedTouches[0].pageX;
  originY = e.changedTouches[0].pageY;
  isMouseDown.value = true
  timestamp = new Date().getTime()
}

/** 触摸移动事件 */
const touchMoveEvent = (e): void | boolean => {
  if (!isMouseDown.value) return false;
  const moveX = e.changedTouches[0].pageX - originX
  const moveY = e.changedTouches[0].pageY - originY
  if (moveX < 0 || moveX + 38 >= width) return false
  sliderLeft.value = moveX + 'px'
  let blockLeft = (width - 40 - 20) / (width - 40) * moveX
  block.value.style.left = blockLeft + 'px'
  containerActive.value = true
  sliderMaskWidth.value = moveX + 'px'
  trail.push(moveY)
}

/** 触摸结束事件 */
const touchEndEvent = (e): void | boolean => {
  if (!isMouseDown.value) return false;
  isMouseDown.value = false
  if (e.changedTouches[0].pageX === originX) return false
  containerActive.value = false
  timestamp = new Date().getTime() - timestamp
}

/** 绑定移入监听事件 */
const sliderLeft = ref<string>('0')
const containerActive = ref<boolean>(false)
const sliderMaskWidth = ref<string>('0')
const trail: number[] = []
const containerSuccess = ref<boolean>(false)
const bindEvents = (): void => {
  document.addEventListener('mousemove', (e) => {
    if (!isMouseDown.value) return false
    const moveX = e.clientX - originX
    const moveY = e.clientY - originY
    if (moveX < 0 || moveX + 38 >= width) return false
    sliderLeft.value = moveX + 'px'
    let blockLeft = (width - 40 - 20) / (width - 40) * moveX
    block.value.style.left = blockLeft + 'px'
    containerActive.value = true
    sliderMaskWidth.value = moveX + 'px'
    trail.push(moveY)
  })
  document.addEventListener('mouseup', (e) => {
    if (!isMouseDown.value) return false
    isMouseDown.value = false
    if (e.clientX === originX) return false
    containerActive.value = false
    timestamp = new Date().getTime() - timestamp
    const left = parseInt(block.value.style.left)
    const params = {
      xPosition: left,
      yPosition: 5,
      uuid: props.uuid
    };
    reqCheck(params).then(data => {
      if (!data) return handleReset();
      containerSuccess.value = true
      success = true
      emits('success', data.verifyId)
    }).catch(() => handleReset())
  })
}

const handleReset = (): void => {
  success = false;
  containerActive.value = false;
  containerSuccess.value = false;
  sliderLeft.value = '0';
  block.value.style.left = 0;
  sliderMaskWidth.value = '0'
  emits('refresh')
}
</script>

<style scoped lang="less">
.slide-verify {
  position: relative;
  margin: auto;
}

/* 图片加载样式 */
.slider-verify-loading{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 999;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0%{
    opacity: .7;
  }
  100% {
    opacity: 9;
  }
}

.slide-verify-block {
  position: absolute;
  left: 0;
  top: 0
}

.slide-verify-refresh-icon {
  position: absolute;
  right: 0;
  top: 0;
  width: 42px;
  height: 42px;
  cursor: pointer;
  background: url("/@/assets/images/icon_light.png") 0 -437px;
  background-size: 42px 471px
}

.slide-verify-slider {
  position: relative;
  text-align: center;
  width: 100%;
  margin-top: 19px !important;
  background: #f7f9fa;
  color: #45494c;
  line-height: 44px;
  height: 44px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.slide-verify-slider-mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 44px;
}

.slide-verify-slider-mask-item {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 42px;
  height: 42px;
  background: #fff;
  cursor: pointer;
  transition: background .2s linear;
  border-radius: 3px;
}

.slide-verify-slider-mask-item:hover {
  /* background: var(--background-color-hover); */
}

.slide-verify-slider-mask-item:hover .slide-verify-slider-mask-item-icon {
  background-position: 0 -13px
}

.slide-verify-slider-mask-item-icon {
  position: absolute;
  top: 15px;
  left: 13px;
  width: 14px;
  height: 12px;
  background: url("/@/assets/images/icon_light.png") 0 -26px;
  background-size: 34px 471px
}
.container-active .slide-verify-slider-mask-item {
  height: 46px;
  top: -1px;
}

.container-active .slide-verify-slider-mask-item {
  height: 42px;
  top: -1px;
}

.container-success .slide-verify-slider-mask-item {
  height: 42px;
  top: -1px;
  border: 1px solid #52CCBA;
  background-color: #52CCBA !important;
}

.container-success .slide-verify-slider-mask {
  height: 42px;
  border: 1px solid #52CCBA;
  background-color: #D2F4EF !important;
}

.container-success .slide-verify-slider-mask-item-icon {
  background-position: 0 0 !important;
}

.container-fail .slide-verify-slider-mask-item {
  height: 42px;
  top: -1px;
  border: 1px solid #f57a7a;
  background-color: #f57a7a !important;
}

.container-fail .slide-verify-slider-mask {
  height: 42px;
  border: 1px solid #f57a7a;
  background-color: #fce1e1 !important;
}

.container-fail .slide-verify-slider-mask-item-icon {
  top: 14px;
  background-position: 0 -82px !important;
}

.container-active .slide-verify-slider-text,
.container-success .slide-verify-slider-text,
.container-fail .slide-verify-slider-text {
  display: none;
}
</style>
