/**
 * This function is designed to draw a graph
 * according to the frequency received.
 * //https://codepen.io/AdamBlum/pen/hIKnm
 * @param {Array} arr
 */
function drawGraphInCanvas(arr) {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;

  var amplitudRecord = [40, 65, 0, 120, 250, 87, 100, 42];

  context.translate(0, height);
  context.scale(1, -1);

  var left = 0,
    previousValue = amplitudRecord[0],
    moveLeftBy = 10;

  for (stat in amplitudRecord) {
    currentValue = amplitudRecord[stat];

    context.beginPath();
    context.moveTo(left, previousValue);
    context.lineTo(left + moveLeftBy, currentValue);
    context.lineWidth = 1;
    context.lineCap = "round";

    context.stroke();

    previousValue = currentValue;
    left += moveLeftBy;
  }
  // var canvas = document.getElementById("canvas");
  // var arryRandom = [100, 80, 150, 125, 130, 50];

  // var width = canvas.width;
  // var height = canvas.height;
  // // canvas.width = width;
  // // canvas.height = height;

  // var ctx = canvas.getContext("2d");
  // console.log(width, " ", height);

  // ctx.translate(0, height);
  // ctx.scale(1, -1);

  // ctx.beginPath();
  // ctx.moveTo(5, 0);
  // ctx.lineTo(5, 150);
  // ctx.lineWidth = "5";
  // ctx.strokeStyle = "green";
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(11, 0);
  // ctx.lineTo(11, 150);

  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(17, 0);
  // ctx.lineTo(17, 150);

  // ctx.stroke();
}
