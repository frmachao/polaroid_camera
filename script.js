const state = {
  currentAngle: 0,
  backgroundOpacity: 1,
  backgroundColor: '#fff',
  isFlashing: false,
  backgroundFilters: {
    brightness: 100,
    contrast: 100,
    blur: 0
  }
};

const animationDuration = 400;

// Filters too expensive for my macbook air :(
// Can try enabling if you have a good GPU
const enableCSSFilters = false;

function getElement(className) {
  return document.getElementsByClassName(className)[0];
}

// Scale down so it fits inside dev.to embed
if (window.self !== window.top) {
  const camera = getElement('camera');
  camera.style.scale = 0.7;
}

const background = getElement('background-image');

// Lock background on mobile
if (/Mobi/.test(navigator.userAgent)) {
  background.style.backgroundSize = 'cover';
}

const backroundContainer = getElement('background-container');
const filmDoorLever = getElement('handle');
const lightenDarkenToggle = getElement('lighten');
const timer = getElement('timer');
const lens = getElement('lens');
const glass = getElement('glass');
// 快门
const shutter = getElement('shutter');
const flashOverlay = getElement('flash-overlay');

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

  console.log(state.backgroundFilters)

  if (resetTransform) {
    lightenDarkenToggle.style.transform = '';
    state.backgroundOpacity = 1;
    if (enableCSSFilters) {
      state.backgroundFilters.brightness = 100;
      state.backgroundFilters.contrast = 100;
    }
  } else if (lightenDarkenToggle.classList.contains('lighten')) {
    lightenDarkenToggle.style.transform = 'translateX(15px)';
    lightenDarkenToggle.classList.remove('lighten');
    if (enableCSSFilters) {
      state.backgroundFilters.brightness = 110;
      state.backgroundFilters.contrast = 90;
    } else {
      state.backgroundOpacity = 0.9;
      state.backgroundColor = '#fff';
    }
  } else {
    lightenDarkenToggle.style.transform = 'translate(-15px)';
    lightenDarkenToggle.classList.add('lighten');
    if (enableCSSFilters) {
      state.backgroundFilters.brightness = 90;
      state.backgroundFilters.contrast = 110;
    } else {
      state.backgroundOpacity = 0.9;
      state.backgroundColor = '#000';
    }
  }

  if (enableCSSFilters) {
    background.style.filter = formatBackgroundFilters(state);
  } else {
    background.style.opacity = state.backgroundOpacity;
    backroundContainer.style.backgroundColor = state.backgroundColor;
  }
}

/* Shutter */
function onTouchShutterStart(e) {
  if (!state.isFlashing) {
    shutter.classList.add('shutter-clicked');
    state.isFlashing = true;
    backroundContainer.style.backgroundColor = '#fff';
    flashOverlay.style.opacity = 1;
    background.style.opacity = 0.75;

    setTimeout(() => {
      flashOverlay.style.transition = `opacity ${animationDuration * 2}ms ease-out`;
      background.style.transition = `opacity ${animationDuration * 2}ms ease-out`;
      flashOverlay.style.opacity = 0;
      background.style.opacity = 1;
    }, 0);

    setTimeout(() => {
      state.isFlashing = false;
      flashOverlay.style.transition = '';
      background.style.transition = '';
      backroundContainer.style.backgroundColor = state.backgroundColor;
    }, animationDuration * 2);
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

  // TODO: add relative zoom
  // Need to capture when change in direction is detected
  // const modifier = state.startingDragProperties.zoomingIn ? 1 : -1;
  // const relativeAngle = Math.min(Math.max(state.startingDragProperties.angle * modifier + state.currentAngle, 0), 360);

  if (enableCSSFilters) {
    state.backgroundFilters.blur = 10 - Number(angle / 180).toPrecision(2) * 10;
    background.style.filter = formatBackgroundFilters(state);
  }

  background.style.backgroundSize = `${100 + Math.floor(angle / 360 * 30)}%`;

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