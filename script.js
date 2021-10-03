// from https://zhuanlan.zhihu.com/p/76517599
function getMedia() {
  let constraints = {
    //参数
    video: { width: 500, height: 500, facingMode: "user" },
  };
  //获得video摄像头区域
  let video = document.getElementById("video");
  //返回的Promise对象
  let promise = navigator.mediaDevices.getUserMedia(constraints);
  //then()异步，调用MediaStream对象作为参数
  promise.then(function (MediaStream) {
    video.srcObject = MediaStream;
    video.play();
  });
}

function takePhoto() {
  //获得Canvas对象
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');
  //绘图
  ctx.drawImage(video, 0, 0, 300, 300);
}

/*建立模态框对象*/
var modalBox = {};

/*获取模态框*/
modalBox.modal = document.getElementById("myModal");

/*获得trigger按钮*/
modalBox.triggerBtn = document.getElementById("triggerBtn");

/*获得关闭按钮*/
modalBox.closeBtn = document.getElementById("closeBtn");

/*获得保存按钮*/
modalBox.saveImg = document.getElementById("saveImg")

/*模态框显示*/
modalBox.show = function () {
  this.modal.style.display = "block";
}
/**
 * 保存照片
 */
modalBox.exportCanvasAsPNG = function (id, fileName) {
  const photo = document.querySelector(".photo")
  const modal_content = document.querySelector(".modal-content")
  console.log(photo.offsetLeft + modal_content.offsetLeft)
  console.log(-(photo.offsetTop))
  html2canvas(photo, {
    useCORS: true,
    x: (photo.offsetLeft + modal_content.offsetLeft),
    y: (-(photo.offsetTop))
  }).then(canvas => {
    var div = document.createElement("div");
    div.id = "hidden_canvas";
    div.style.display = "none";
    document.body.appendChild(div);
    document.querySelector('#hidden_canvas').appendChild(canvas);
    var canvasElement = document.getElementById('hidden_canvas').childNodes[0];
    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = `${absoluteHumanTime(new Date)}.png`;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
    document.body.removeChild(div);
  });
}

/*模态框关闭*/
modalBox.close = function () {
  this.modal.style.display = "none";
}

/*当用户点击模态框内容之外的区域，模态框也会关闭*/
modalBox.outsideClick = function () {
  var modal = this.modal;
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

/*模态框初始化*/
modalBox.init = function () {
  var that = this;
  this.triggerBtn.onclick = function () {
    that.show();
}
  this.closeBtn.onclick = function () {
    that.close();
  }
  this.saveImg.onclick = function () {
    that.exportCanvasAsPNG()
  }
  this.outsideClick();
}
modalBox.init();

function absoluteHumanTime(t) {
  return `${t.getFullYear()}.${t.getMonth() + 1
    }.${t.getDate()}`;
}

const state = {
  // 相机镜头的角度
  currentAngle: 0,
  backgroundOpacity: 1,
  backgroundColor: '#fff',
  isFlashing: false,
  // css 滤镜属性
  backgroundFilters: {
    // 明亮度
    brightness: 100,
    // 对比度
    contrast: 100,
    // 模糊度
    blur: 0
  }
};

const animationDuration = 400;

// Filters too expensive for my macbook air :(
// Can try enabling if you have a good GPU
const enableCSSFilters = true;

function getElement(className) {
  return document.getElementsByClassName(className)[0];
}

// Scale down so it fits inside dev.to embed
if (window.self !== window.top) {
  const camera = getElement('camera');
  camera.style.scale = 0.7;
}

const background = document.querySelector('body');

const backroundContainer = getElement('background-container');
const filmDoorLever = getElement('handle');
// 滤镜切换
const lightenDarkenToggle = getElement('lighten');
const timer = getElement('timer');
// 镜头
const lens = getElement('lens');
const glass = getElement('glass');
// 快门
const shutter = getElement('shutter');
// 闪光灯
const flashOverlay = getElement('flash-overlay');
const picture = getElement('picture')

filmDoorLever.parentElement.addEventListener("mousedown", onClickFilmDoor);
lightenDarkenToggle.parentElement.addEventListener("mousedown", onClickLightenDarken);
timer.addEventListener("mousedown", onTouchTimerStart);
timer.addEventListener("mouseup", onTouchTimerStop);
document.addEventListener("mouseup", onTouchTimerStop);
lens.addEventListener("mousedown", onDragLensStart);
lens.addEventListener("mouseup", onDragLensStop);
document.addEventListener("mouseup", onDragLensStop);
shutter.addEventListener("mousedown", onTouchShutterStart);
shutter.addEventListener("mouseup", onTouchShutterStop);
document.addEventListener("mouseup", onTouchShutterStop);

/* Film Door */
function onClickFilmDoor() {
  const resetTransform = filmDoorLever.style.transform;

  if (resetTransform) {
    filmDoorLever.style.transform = '';
  } else {
    filmDoorLever.style.transform = 'translate(-80px)';
  }
}

/* Lighten/Darken */
function formatBackgroundFilters({ backgroundFilters }) {
  const units = {
    brightness: '%',
    contrast: '%',
    blur: 'px'
  };

  return Object.keys(backgroundFilters).map(
    filter => `${filter}(${backgroundFilters[filter]}${units[filter]})`
  ).join(' ');
}

function onClickLightenDarken() {
  const resetTransform = lightenDarkenToggle.style.transform;
  if (resetTransform) {
    lightenDarkenToggle.style.transform = '';
  } else if (lightenDarkenToggle.classList.contains('lighten')) {
    lightenDarkenToggle.style.transform = 'translateX(15px)';
    lightenDarkenToggle.classList.remove('lighten');
  } else {
    lightenDarkenToggle.style.transform = 'translate(-15px)';
    lightenDarkenToggle.classList.add('lighten');
  }
}

/* Shutter */
function onTouchShutterStart(e) {
  if (!state.isFlashing) {
    shutter.classList.add('shutter-clicked');
    state.isFlashing = true;
    flashOverlay.style.opacity = 1;
    background.style.opacity = 0.75;

    setTimeout(() => {
      takePhoto()
      flashOverlay.style.transition = `opacity ${animationDuration * 2}ms ease-out`;
      background.style.transition = `opacity ${animationDuration * 2}ms ease-out`;
      picture.style.animation = `print  ${animationDuration * 6}ms`
      flashOverlay.style.opacity = 0;
      background.style.opacity = 1;
    }, 0);

    setTimeout(() => {
      state.isFlashing = false;
      flashOverlay.style.transition = '';
      background.style.transition = '';
    }, animationDuration * 2);
    setTimeout(() => {
      picture.style.animation = '';
      modalBox.triggerBtn.click()
    }, animationDuration * 6);
  }
}

function onTouchShutterStop(e) {
  shutter.classList.remove('shutter-clicked');
}

/* Timer */
function onTouchTimerStart(e) {
  timer.classList.add('timer-clicked');
}

function onTouchTimerStop(e) {
  timer.classList.remove('timer-clicked');
}

/* Zoom Lens */
function onDragLensStart(e) {
  const { angle } = calculateRelativeLensAngle(e);
  //   state.startingDragProperties = {
  //     angle: angle,
  //     zoomingIn: angle > state.currentAngle
  //   };
  lens.classList.add('dragging');
  document.body.classList.add('dragging');
  document.addEventListener("mousemove", handleMouseMove, true);
}

function onDragLensStop(e) {
  // state.startingDragProperties = null;
  lens.classList.remove('dragging');
  document.body.classList.remove('dragging');
  document.removeEventListener("mousemove", handleMouseMove, true);
}

function calculateRelativeLensAngle(e) {
  const lensPosition = lens.getBoundingClientRect();
  const lensCenter = {
    x: lensPosition.left + lens.offsetWidth / 2,
    y: lensPosition.top + lens.offsetHeight / 2
  };

  const { pageX, pageY } = e;
  let offsetX = Math.floor(Math.abs(pageX - lensCenter.x));
  let offsetY = Math.floor(Math.abs(pageY - lensCenter.y));

  let adjacent = offsetX;
  let opposite = offsetY;
  // const distance = Math.sqrt(adjacent**2 + opposite**2);
  const radians = Math.atan(opposite / adjacent);
  const angle = Math.floor(radians * (180 / Math.PI));

  const posX = pageX > lensCenter.x;
  const posY = pageY > lensCenter.y;

  let offset = 0;
  let calculatedAngle = angle;
  if (posX && !posY) {
    offset = 90;
    calculatedAngle = 90 - angle + offset;
  }
  if (posX && posY) {
    offset = 180;
    calculatedAngle = angle + offset;
  }
  if (!posX && posY) {
    offset = 270;
    calculatedAngle = 90 - angle + offset;
  }

  return {
    angle: calculatedAngle,
    offset
  }
}

/* Drag lens */
function handleMouseMove(e) {
  const {
    angle,
    offset,
    posX,
    posY
  } = calculateRelativeLensAngle(e);
  const irisBaseSize = Math.floor(angle / 360 * 30) + 5;

  glass.style.backgroundImage = `
    radial-gradient(
      rgba(119, 109, 80, 0.85),
      transparent 40%
    ),
    radial-gradient(
      rgba(51,180,105,0.25) 13%,
      rgba(119,159,59,0.2) 53% 70%,
      rgba(119,159,59,0) 68%
    ),
    radial-gradient(
      rgba(51,180,105,0.25) 23%,
      rgba(51,180,105,0.2) 53% 70%,
      rgba(51,180,105,0) 68%
    ),
    radial-gradient(
      #000,
      #000 ${irisBaseSize}%,
      #181818 ${irisBaseSize + 2}%,
      #000 ${irisBaseSize + 4}%,
      #181818 ${irisBaseSize + 6}%,
      #000 ${irisBaseSize + 8}%,
      #181818 ${irisBaseSize + 10}%,
      #241921 22%,
      #241921 55%,
      #080609 70%
    )
  `;
}