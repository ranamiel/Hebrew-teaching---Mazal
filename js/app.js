/* === Hebrew Reading Site - Main Application === */

const App = {
  // Current state
  state: {
    familyName: '',
    gender: null, // 'boy' or 'girl'
    currentPage: 'welcome',
  },

  // Gender-aware text templates
  genderText: {
    boy: {
      welcome: 'ברוך הבא',
      listen: 'הקשב למילה',
      press: 'לחץ',
      say: 'אמור',
      didYouHear: 'שמעת את המילה?',
      tryAgain: 'נסה שוב',
      excellent: 'מצוין!',
      great: 'כל הכבוד!',
      readAloud: 'קרא בקול רם',
      chooseAnswer: 'בחר תשובה',
      howManySyllables: 'כמה הברות שמעת?',
      clickOnLetter: 'לחץ על האות',
      whatIsTheName: 'מה השם של האות?',
      whatIsTheSound: 'מה הצליל של האות?',
      readTheWord: 'קרא את המילה',
      youRead: 'קראת',
      correct: 'נכון!',
      tryMore: 'בוא ננסה עוד',
      pointTo: 'הצבע על',
    },
    girl: {
      welcome: 'ברוכה הבאה',
      listen: 'הקשיבי למילה',
      press: 'לחצי',
      say: 'אמרי',
      didYouHear: 'שמעת את המילה?',
      tryAgain: 'נסי שוב',
      excellent: 'מצוינת!',
      great: 'כל הכבוד!',
      readAloud: 'קראי בקול רם',
      chooseAnswer: 'בחרי תשובה',
      howManySyllables: 'כמה הברות שמעת?',
      clickOnLetter: 'לחצי על האות',
      whatIsTheName: 'מה השם של האות?',
      whatIsTheSound: 'מה הצליל של האות?',
      readTheWord: 'קראי את המילה',
      youRead: 'קראת',
      correct: 'נכון!',
      tryMore: 'בואי ננסה עוד',
      pointTo: 'הצביעי על',
    }
  },

  // Get gender-aware text
  text(key) {
    const gender = this.state.gender || 'boy';
    return this.genderText[gender][key] || key;
  },

  // Initialize the app
  init() {
    this.loadState();
    this.bindEvents();
    this.showPage(this.state.currentPage);
  },

  // Save state to localStorage
  saveState() {
    localStorage.setItem('hebrewReadingState', JSON.stringify(this.state));
  },

  // Load state from localStorage
  loadState() {
    const saved = localStorage.getItem('hebrewReadingState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(this.state, parsed);
      } catch (e) {
        console.warn('Could not load saved state');
      }
    }
  },

  // Bind global events
  bindEvents() {
    // Welcome page - family name form
    const familyForm = document.getElementById('family-form');
    if (familyForm) {
      familyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('family-name-input');
        const name = input.value.trim();
        if (name) {
          this.state.familyName = name;
          this.saveState();
          this.showPage('gender-select');
        }
      });
    }

    // Gender selection
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.dataset.gender;
        this.state.gender = gender;
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.saveState();
        // Short delay then navigate
        setTimeout(() => {
          this.showPage('dashboard');
        }, 400);
      });
    });

    // Navigation buttons
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.navigate;
        this.showPage(target);
      });
    });

    // Subtopic buttons
    document.querySelectorAll('[data-activity]').forEach(btn => {
      btn.addEventListener('click', () => {
        const activity = btn.dataset.activity;
        this.navigateToActivity(activity);
      });
    });
  },

  // Show a specific page
  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      this.state.currentPage = pageId;
      this.saveState();

      // Update dynamic content
      this.updatePageContent(pageId);

      // Scroll to top
      window.scrollTo(0, 0);
    }
  },

  // Update dynamic content on page show
  updatePageContent(pageId) {
    if (pageId === 'gender-select') {
      const nameEl = document.getElementById('gender-family-name');
      if (nameEl) nameEl.textContent = this.state.familyName;
    }

    if (pageId === 'dashboard') {
      const nameEl = document.getElementById('dashboard-family-name');
      if (nameEl) nameEl.textContent = this.state.familyName;

      const genderGreeting = document.getElementById('dashboard-greeting');
      if (genderGreeting) {
        genderGreeting.textContent = this.text('welcome') + '!';
      }
    }
  },

  // Navigate to activity page
  navigateToActivity(activity) {
    const activityPages = {
      'syllables': 'pages/phonological/syllables.html',
      'combinations': 'pages/phonological/combinations.html',
      'letters': 'pages/phonological/letters.html',
      'nikud-coding': 'pages/nikud/coding.html',
      'nikud-practice': 'pages/nikud/practice.html',
      'reading': 'pages/reading/texts.html',
    };

    const url = activityPages[activity];
    if (url) {
      window.location.href = url;
    }
  },

  // Reset and go back to welcome
  resetFamily() {
    this.state.familyName = '';
    this.state.gender = null;
    this.state.currentPage = 'welcome';
    this.saveState();
    this.showPage('welcome');
    const input = document.getElementById('family-name-input');
    if (input) input.value = '';
  },

  // Show feedback message
  showFeedback(container, type, message) {
    const div = document.createElement('div');
    div.className = `feedback ${type}`;
    div.textContent = message;

    // Remove existing feedback
    const existing = container.querySelector('.feedback');
    if (existing) existing.remove();

    container.appendChild(div);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (div.parentNode) div.remove();
    }, 3000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
