// Initialize the speech recognition object only once
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();

// Initialize the speech synthesis object
const synthesis = window.speechSynthesis;

// Function to convert text to speech
function speakText(command) {
  const utterance = new SpeechSynthesisUtterance(command);
  synthesis.speak(utterance);
}

// Function to start speech recognition
function startSpeechRecognition() {
  // Reset any previous state
  recognition.stop();
  recognition.abort();

  // Variable to track whether voice was detected
  let voiceDetected = false;
  let timeout;

  // Loop infinitely for user to speak
  recognition.continuous = true;
  recognition.lang = "en-US"; // Set the language to English

  recognition.onstart = function () {
    console.log("Speech recognition started...");
    voiceDetected = false;
  };

  recognition.onresult = function (event) {
    const result =
      event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Did you say ", result);
    // speakText(result);
    document.getElementById("convert_text").value = result;
    voiceDetected = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("No voice detected for 4 seconds. Stopping recording.");
      recognition.stop();
    }, 4000);
  };

  recognition.onerror = function (event) {
    console.error("Recognition error occurred", event.error);
  };

  recognition.onend = function () {
    if (!voiceDetected) {
      console.log("No voice detected. Stopping recording.");
      clearTimeout(timeout);
    }
  };

  // Start speech recognition
  recognition.start();
}

// Attach event listener to the button
document
  .getElementById("click_to_record")
  .addEventListener("click", startSpeechRecognition);
