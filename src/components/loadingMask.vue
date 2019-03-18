<template>
    <div class="loading-mask-container">
		<div class="spinner">
			<div class="loading">
          <div class="point p1"></div>
          <div class="point p2"></div>
          <div class="point p3"></div>
          <div class="point p4"></div>
			</div>
		</div>
		<div class="text">
			数据加载中，请稍后<span class="s1"></span><span class="s2"></span><span class="s3"></span>
		</div>
	</div>
</template>
<style>
.loading-mask-container {
  margin: 0;
  padding: 0;
  background-color: rgba(255,255,255,.7);
  position: fixed;
  top:0;
  left: 0;
  z-index: 99999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.loading-mask-container .spinner {
			width: 50px;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
.loading-mask-container .loading {
  width: 20px;
  height: 20px;
  animation: loading-anim 2s linear infinite;

  position: relative;
}
.loading-mask-container .point {
  width: 9.8px;
  height: 9.8px;
  border-radius: 9.8px;
  position: absolute;
}
.loading-mask-container .point.p1 {
  opacity: 0.4;
  background: #7AC7FF;
  top: 0;
  left: 0;
  animation: loading-p1 2s linear infinite;
}
.loading-mask-container .point.p2 {
  opacity: 0.6;
  background: #77C5FE;
  top: 0;
  right: 0;
  animation: loading-p2 2s linear infinite;
}
.loading-mask-container .point.p3 {
  opacity: 0.8;
  background: #59B9FF;
  bottom:  0;
  left: 0;
  animation: loading-p3 2s linear infinite;
}
.loading-mask-container .point.p4 {
  background: #44ABF6;
  bottom: 0;
  right: 0;
  animation: loading-p4 2s linear infinite;
}
@keyframes loading-anim {
  0% {
      transform: rotate(0deg);
  }
  50% {
      transform: rotate(0.5turn);
  }
  100% {
      transform: rotate(1turn);
  }
}
@keyframes loading-p1 {
  0% {
      transform: translate(0px, 0px);
  }
  50% {
      transform: translate(-4px, -4px);
  }
  100% {
      transform: translate(0px, 0px);
  }
}
@keyframes loading-p2 {
  0% {
      transform: translate(0px, 0px);
  }
  50% {
      transform: translate(4px, -4px);
  }
  100% {
      transform: translate(0px, 0px);
  }
}
@keyframes loading-p3 {
  0% {
      transform: translate(0px, 0px);
  }
  50% {
      transform: translate(-4px, 4px);
  }
  100% {
      transform: translate(0px, 0px);
  }
}
@keyframes loading-p4 {
  0% {
      transform: translate(0px, 0px);
  }
  50% {
      transform: translate(4px, 4px);
  }
  100% {
      transform: translate(0px, 0px);
  }
}
.loading-mask-container .text {
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 12px;
    color: #34495E;
    letter-spacing: 0;
}
.loading-mask-container .text span {
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 2px;
  background-color: #34495E;
  margin-left: 2px;
}
.loading-mask-container .text .s1 {
  opacity: 0;
  animation: loading-s  2s  0s steps(2, end)  infinite alternate;
}
.loading-mask-container .text .s2 {
  opacity: 0;
  animation: loading-s  2s  0.6s steps(2, end)  infinite alternate;
}
.loading-mask-container .text .s3 {
  opacity: 0;
  animation: loading-s  2s  1.2s steps(2, end)  infinite alternate;
}
@keyframes loading-s {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
