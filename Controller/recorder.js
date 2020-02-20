/**
 * Initialize the app
 */

const record = document.getElementById("record");
const stop = document.getElementById("stop");
const reproduce = document.getElementById("reproduce");
const soundClips = document.getElementById("soundClips");
const TIME_TO_RECORD = 5; // seconds
var arrayofAmplitud = [10, 20];
function init() {
  // Reproduce with bttn
  // reproduce.onclick = () => {
  //   var audio = document.getElementById("audioOne");
  //   audio.play();
  // };
  record.onclick = () => processAudio();
  var resultOne = amplitudToOneHundred(100);
  console.log(resultOne);
  var arrayTest = [2, 47, 89, 52, 14, 78, 12, 18, 12, 19, 10, 15, 74, 12, 89];

  drawGraphInCanvas(arrayofAmplitud);
}
init();
/**
 * This function is designed to connect the stream to the AudioContext
 * and the AnalyserNode to get the frequency data. This function sets the
 * Audio Context interface that represents an audio-proccesing graph build
 * from audio modules.
 * This interface uses the createMediaStreamSource method to create a
 * MediaElementAudioSourceNode from which the audio can be manipulated.
 * The AnalyserNode interface represents a node that provides real-time
 * frequency and time-domain analysis information.
 * This function receives a MediaStream object that is return by the
 * getUserMedia method from the MediaDevices interface.
 * https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 * @param {MediaStream} stream
 */
function connectionToStreamSource(stream) {
  // Setting the Audio Context parameters
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0;
  var source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);
  // The fftSize is converted half the value
  // for technical resons.
  analyser.fftSize = 32;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var counerOfInterval = 0;
  var myInterval = setInterval(function() {
    counerOfInterval++;
    getFrequencyData(analyser, dataArray);
    if (counerOfInterval === TIME_TO_RECORD) clearInterval(myInterval);
  }, 1000);
}

/**
 * This function is designed to get the current
 * frequency trhough the method getByteFrequencyData
 * of the AnalyserNode interface. The friquency data is
 * composed of integers between the range 0-255.
 * @param {BaseAudioContext} analyser
 * @param {Array} dataArray
 * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
 * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
 */
function getFrequencyData(analyser, dataArray) {
  analyser.getByteFrequencyData(dataArray);
  let soundAmplitud = calculateTheSoundAmplitud(dataArray);
  let hundredSoundAmplitued = amplitudToOneHundred(soundAmplitud);
  arrayofAmplitud.push(hundredSoundAmplitued);
  // console.log("The Squared Result Sound Amplitud: ", hundredSoundAmplitued);
  // console.log("Array Sound Amplitud: ", arrayofAmplitud);
  // console.log(dataArray);
  // drawGraphInCanvas(arrayofAmplitud);
  getFinalFrequencyData(arrayofAmplitud);
  console.log("The amplitud array: ", arrayofAmplitud);
}

function getFinalFrequencyData(arr) {
  return arr;
}

/**
 * This function is designed to draw a graph
 * according to the frequency received.
 * //https://codepen.io/AdamBlum/pen/hIKnm
 * @param {Array} arr
 */
function drawGraphInCanvas(amplitudRecord) {
  // requestAnimationFrame(drawGraphInCanvas);
  console.log("Drawing", arrayofAmplitud);
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height,
    arrayLenght = amplitudRecord.length;

  /**
   * 30 is the fixed number
   */
  // console.log("Array Length: ", 30);
  // console.log("Canvas Width: ", width, " Canvas Height: ", height);
  // console.log("Pixels for item X axis: ", width / 30);
  var distanceMovement = width / 30;

  // var amplitudRecord = [40, 65, 0, 120, 250, 87, 100, 42];

  context.translate(0, height);
  context.scale(1, -1);

  function drawPerformace() {
    requestAnimationFrame(drawPerformace);
    console.log("Hello");
    var left = 0,
      previousValue = amplitudRecord[0],
      moveLeftBy = distanceMovement;

    var colors = ["red", "green", "blue", "pink"];
    for (stat in amplitudRecord) {
      currentValue = amplitudRecord[stat];

      context.beginPath();
      context.moveTo(left, previousValue);
      context.lineTo(left + moveLeftBy, currentValue);
      context.lineWidth = 10;
      context.lineCap = "round";

      var strokeColor = getRandomColor(); //   "rgb(" + currentValue + "," + currentValue + "," + currentValue + ")";
      context.strokeStyle = strokeColor;

      context.stroke();

      previousValue = currentValue;
      left += moveLeftBy;
    }
  }
  drawPerformace();
}

/**
 * Random color generator
 * https://stackoverflow.com/questions/1484506/random-color-generator
 */
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * This function returns the input received into a  range of 0-100.
 * The function takes the integer 255 as the maximum value that
 * can be received by the frequency, thou is considered as the 100%
 * @param {int} num
 * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
 */
function amplitudToOneHundred(num) {
  return Math.round((num / 255) * 100);
}

/**
 * This function is designed to check and as for permission
 * to record the audio from the user. This implemets the
 * getUserMedia method from the Media devices to received the
 * MediaStream object which consists of several audio tracks.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
 */
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

        // Connection to Visualize the Data.
        connectionToStreamSource(stream);

        // This stop the recording, although it does not
        // stop the stream source.
        var counterStopRecording = 0;
        var timeToStopRecording = setInterval(function() {
          counterStopRecording++;
          console.log(counterStopRecording);
          if (counterStopRecording === TIME_TO_RECORD) {
            stopRecording(mediaRecorder);
            clearInterval(timeToStopRecording);
          }
        }, 1000);
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
 * This funcion is used on the onstop method from the Media
 * Recorder interface with the purpose of creating the audio
 * tag and Blob object.
 * @param {Array} chunks
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/onstop
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
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/ondataavailable
 */
function onDataAvalRecording(event, chunks) {
  console.log("On data available");
  chunks.push(event.data);
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
