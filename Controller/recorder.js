/**
 * Initialize the app
 */

const record = document.getElementById("record");
const stop = document.getElementById("stop");
const reproduce = document.getElementById("reproduce");
const soundClips = document.getElementById("soundClips");

function init() {
  // Reproduce with bttn
  // reproduce.onclick = () => {
  //   var audio = document.getElementById("audioOne");
  //   audio.play();
  // };
  record.onclick = () => processAudio();
  var resultOne = amplitudToOneHundred(100);
  console.log(resultOne);
  drawGraphInCanvas();
}
init();
/**
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
 * @param {*} stream
 */
function testing(stream) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0;
  var source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);
  // This is converted half the value
  // for technical resons.
  analyser.fftSize = 32;

  var bufferLength = analyser.frequencyBinCount;
  console.log("The buffer", bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  var arrayofAmplitud = [];
  // insiderFunc();
  var counerOfInterval = 0;
  var myInterval = setInterval(function() {
    counerOfInterval++;
    if (counerOfInterval === 30) clearInterval(myInterval);
    insiderFunc();
  }, 1000);

  function insiderFunc() {
    analyser.getByteFrequencyData(dataArray);

    let soundAmplitud = calculateTheSoundAmplitud(dataArray); // calculateRMS(dataArray);
    let hundredSoundAmplitued = amplitudToOneHundred(soundAmplitud);
    arrayofAmplitud.push(hundredSoundAmplitued);
    console.log("The Squared Result Sound Amplitud: ", hundredSoundAmplitued);
    console.log("Array Sound Amplitud: ", arrayofAmplitud);
    console.log(dataArray);
  }
}

//https://codepen.io/AdamBlum/pen/hIKnm
function drawGraphInCanvas() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;

  var stats = [40, 65, 0, 120, 250, 87, 100, 42];

  context.translate(0, height);
  context.scale(1, -1);

  // context.fillStyle = "#f6f6f6";
  // context.fillRect(0, 0, width, height);

  var left = 0,
    prev_stat = stats[0],
    move_left_by = 10;

  for (stat in stats) {
    the_stat = stats[stat];

    context.beginPath();
    context.moveTo(left, prev_stat);
    context.lineTo(left + move_left_by, the_stat);
    context.lineWidth = 1;
    context.lineCap = "round";

    context.stroke();

    prev_stat = the_stat;
    left += move_left_by;
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
/**
 *
 * @param {int} num
 */
function amplitudToOneHundred(num) {
  return Math.round((num / 255) * 100);
}

function processAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true
        }
      )

      // Success callback
      .then(function(stream) {
        // Store the audio
        let chunks = [];
        const mediaRecorder = new MediaRecorder(stream);
        startRecording(mediaRecorder);

        stop.onclick = () => stopRecording(mediaRecorder);
        // This is fire automatically after MediaRecorder
        // method stop() is called.
        mediaRecorder.onstop = () => onStopRecording(chunks);
        //This method is fire when the MediaRecorder delivers data
        // to the application
        mediaRecorder.ondataavailable = () =>
          onDataAvalRecording(event, chunks);

        /**
         *
         */

        testing(stream);

        // analyser.fftSize = 2048;
        // var bufferLength = analyser.frequencyBinCount;
        // var dataArray = new Uint8Array(bufferLength);
        // analyser.getByteTimeDomainData(dataArray);
        // console.log(bufferLength);
      })

      // Error callback
      .catch(function(err) {
        console.log("The following getUserMedia error occured: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
}

/**
 * Begin recording the media
 * @param {Object} mediaRecorder
 */
function startRecording(mediaRecorder) {
  mediaRecorder.start();
  console.log(mediaRecorder.state);
  console.log("recorder started");
  record.style.background = "red";
  record.style.color = "black";
}

/**
 * Stop recording the media
 * @param {Object} mediaRecorder
 */
function stopRecording(mediaRecorder) {
  mediaRecorder.stop();
  console.log(mediaRecorder.state);
  console.log("recorder stopped");
  record.style.background = "";
  record.style.color = "";
}

/**
 * Function response to the media recording.
 * This is designed to be used with the MediaRecorder
 * API after the stop method of this API has been called.
 */
function onStopRecording(chunks) {
  console.log("recorder stopped FIRE automatically");
  const clipName = prompt("Enter a name for your sound clip");

  const clipContainer = document.createElement("article");
  const clipLabel = document.createElement("p");
  const audio = document.createElement("audio");
  const deleteButton = document.createElement("button");

  clipContainer.classList.add("clip");
  audio.setAttribute("controls", "");
  deleteButton.innerHTML = "Delete";
  clipLabel.innerHTML = clipName;

  clipContainer.appendChild(audio);
  clipContainer.appendChild(clipLabel);
  clipContainer.appendChild(deleteButton);
  soundClips.appendChild(clipContainer);

  const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  chunks = [];
  const audioURL = window.URL.createObjectURL(blob);
  audio.src = audioURL;
  audio.id = "audioOne";

  deleteButton.onclick = function(event) {
    let evtTgt = event.target;
    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
  };
}

/**
 * This function is designed to run in response
 * to the Blob data being made available for use.
 * This has to be implemented with the "ondataavailable"
 * method of the MediaStream Recording API.
 */
function onDataAvalRecording(event, chunks) {
  console.log("On data available");
  chunks.push(event.data);
}

function drawGraph(stream) {
  var canvas = document.getElementById("canvas");
  console.log("Graph");

  console.log("This is the buffer", bufferLength);
  // console.log("Data array", dataArray);

  canvas.clearRect(0, 0, WIDTH, HEIGHT);
}

/**
 * This function calculates the sound amplitud
 * according to the data provided by the method
 * getByteFrequencyData which copies the current
 * frequency data into the array provided as a parameter
 * in this function. This function only takes the first two
 * values of the array to determine the average of the
 * amplitud.
 * @param {Array} arr
 */
function calculateTheSoundAmplitud(arr) {
  // Conver the array to a 16-bit to
  // allow storage
  var dataArray = new Uint16Array(arr);

  let counterInArray = 0;
  let Squares = dataArray.map((val, index) => {
    if (index < 2) {
      counterInArray++;
      return val;
    }
  });

  // Function reduce the array to a value
  // Here, all the elements gets added to the first
  // element which acted as the accumulator initially.
  let Sum = Squares.reduce((acum, val) => acum + val);
  // console.log("***** Square: ", Squares);
  // console.log("***** Toal Sum: ", Sum);
  // console.log("***** Medium: ", Sum / counterInArray);

  var averageMean = Sum / counterInArray;
  return averageMean;
}

// Source: https://www.geeksforgeeks.org/rms-value-of-array-in-javascript/
// function calculateRMS(arr) {
//   // Conver the array to a 16-bit to
//   // allow storage
//   var dataArray = new Uint16Array(arr);

//   // Map will return another array with each
//   // element corresponding to the elements of
//   // the original array mapped according to
//   // some
//   let counterInArray = 0;
//   let Squares = dataArray.map((val, index) => {
//     if (val > 0) {
//       counterInArray++;
//       return val * val;
//     }
//   });
//   console.log("Counter in Array: ", counterInArray);

//   // Function reduce the array to a value
//   // Here, all the elements gets added to the first
//   // element which acted as the accumulator initially.
//   let Sum = Squares.reduce((acum, val) => acum + val);

//   console.log("***** Square: ", Squares);
//   // console.log("***** Toal Sum: ", Sum);
//   console.log("***** Medium: ", Sum / counterInArray);
//   Mean = Sum / counterInArray;
//   return Math.sqrt(Mean);
// }
