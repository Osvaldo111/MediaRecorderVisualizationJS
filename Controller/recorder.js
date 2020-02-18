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
function example() {
  alert();
}
