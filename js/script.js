// GLOBAL VARIABLE
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorPicker = document.querySelector("#color-picker"),
  colorsBtns = document.querySelectorAll(".colors .option"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImageBtn = document.querySelector(".save-img");

// VARIABLE
let ctx = canvas.getContext("2d");
let isDrawing = false,
  brushWidth = 15,
  selectedTool = "brush",
  selectedColor = "#000",
  prevMouseX,
  prevMouseY,
  snapshot;

// CANVAS BACKGROUND
const canvasBakground = ()=>{
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor;
}

// SET CANVAS WIDTH AND HEIGH
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  canvasBakground()
});
//  START DRAWING
const startDraw = (e) => {
  console.log(fillColor.checked);
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
};
// DRAWING RECTANGLE
const drawRectangle = (e) => {
  fillColor.checked
    ? ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      )
    : ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
};
// DRAWING CIRCLE

const drawCircle = (e) => {
  ctx.beginPath();
  const radius =
    Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) +
    Math.pow(prevMouseY - e.offsetY, 2);
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

  fillColor.checked ? ctx.fill() : ctx.stroke();
};
// DRAWING Triangle

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();

  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// DRAWING
const drawing = (e) => {
  if (!isDrawing) return;

  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

    default:
      break;
  }
};
// DRAWING BUTTON SELECTED
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
// SET COLOR TO SHEAPS

colorsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
    console.log(bgColor);
  });
});

// CHANGE SIZE SLIDER

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});
// SAVE LIKE IMAGE 
saveImageBtn.addEventListener("click",()=>{
  const link = document.createElement('a')

  link.download = `savaPaint${Date.now()}.jpg`
  link.href= canvas.toDataURL()
  link.click()
})

// CLEAR CANVAS BUTTON
clearCanvasBtn.addEventListener('click', ()=>{
  ctx.clearRect(0 , 0 , canvas.width, canvas.height)
  canvasBakground()
})


// STOP DRAWING MOUSUP
const stopDraw = () => {
  isDrawing = false;
};
// SET COLOR PICKER

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;

  colorPicker.parentElement.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
