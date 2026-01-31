/* === Speech Recognition & Audio Utilities === */

const Speech = {
  recognition: null,
  isRecording: false,

  // Initialize speech recognition if available
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'he-IL';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    }
    return !!this.recognition;
  },

  // Start listening
  startListening(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError('זיהוי דיבור לא זמין בדפדפן זה');
      return false;
    }

    this.recognition.onresult = (event) => {
      const results = [];
      for (let i = 0; i < event.results[0].length; i++) {
        results.push({
          text: event.results[0][i].transcript.trim(),
          confidence: event.results[0][i].confidence
        });
      }
      this.isRecording = false;
      if (onResult) onResult(results);
    };

    this.recognition.onerror = (event) => {
      this.isRecording = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      document.querySelectorAll('.mic-btn').forEach(btn => btn.classList.remove('recording'));
    };

    try {
      this.recognition.start();
      this.isRecording = true;
      return true;
    } catch (e) {
      if (onError) onError(e.message);
      return false;
    }
  },

  // Stop listening
  stopListening() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  },

  // Compare spoken text with expected
  compareText(spoken, expected) {
    // Normalize both texts - remove nikud and whitespace for comparison
    const normalize = (text) => {
      return text
        .replace(/[\u0591-\u05C7]/g, '') // Remove nikud
        .replace(/\s+/g, '')              // Remove spaces
        .trim();
    };

    const normalSpoken = normalize(spoken);
    const normalExpected = normalize(expected);

    return normalSpoken === normalExpected;
  },

  // Play audio file
  playAudio(src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.onended = resolve;
      audio.onerror = () => {
        console.warn(`Audio not found: ${src} - using TTS fallback`);
        reject(new Error('Audio not found'));
      };
      audio.play().catch(() => {
        console.warn(`Could not play audio: ${src}`);
        reject(new Error('Could not play audio'));
      });
    });
  },

  // TTS fallback (used only when no recording is available)
  speak(text, rate = 0.8) {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';
        utterance.rate = rate;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }
};
