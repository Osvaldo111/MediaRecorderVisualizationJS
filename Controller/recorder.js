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
  let arr = [4, 9];

  let RMSresult = calculateRMS(arr);
  console.log(RMSresult);
}
init();

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

function testing(stream) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  var source = audioCtx.createMediaStreamSource(stream);
  analyser.fftSize = 2048;

  var bufferLength = analyser.frequencyBinCount;
  console.log("The buffer", bufferLength);
  var dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);

  // console.log("The array: ", dataArray);
  var counter = 0;
  insiderFunc();
  function insiderFunc() {
    counter++;
    if (counter < 60) {
      let soundAmplitud = calculateRMS(dataArray);
      console.log(soundAmplitud);
    }

    analyser.getByteTimeDomainData(dataArray);
    requestAnimationFrame(insiderFunc);
  }
}

// Source: https://www.geeksforgeeks.org/rms-value-of-array-in-javascript/
function calculateRMS(arr) {
  // var arr = Array.from(arr);

  // Map will return another array with each
  // element corresponding to the elements of
  // the original array mapped according to
  // some relation
  let Squares = arr.map(val => val * val);

  // Function reduce the array to a value
  // Here, all the elements gets added to the first
  // element which acted as the accumulator initially.
  let Sum = Squares.reduce((acum, val) => acum + val);
  // console.log("Sum: ", Sum);
  Mean = Sum / arr.length;
  return Math.sqrt(Mean);
}
