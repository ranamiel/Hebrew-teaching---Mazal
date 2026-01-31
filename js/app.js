/* === Hebrew Reading Site - Main Application === */

const App = {
  state: {
    familyName: '',
    childName: '',
    gender: null, // 'boy' or 'girl'
    currentPage: 'welcome',
  },

  // טקסטים מותאמי מין - מרוכזים במקום אחד
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
      listenAndPress: 'הקשב לשם האות ולחץ עליה',
      hearLetterName: 'שמע את שם האות',
      whatLetterName: 'מה השם של האות? בחר את התשובה הנכונה',
      whatLetterSound: 'מה הצליל של האות? בחר את התשובה הנכונה',
      listenToWord: 'הקשב למילה ולחץ על ההברות בסדר הנכון',
      hearWord: 'שמע את המילה',
      listenAndCount: 'הקשב למילה. כמה חלקים (צירופים) יש בה?',
      howManyCombinations: 'כמה צירופים שמעת במילה?',
      readWithNikud: 'קרא את האות עם הניקוד',
      hearNikud: 'שמע את הצליל',
      readAndCount: 'קרא את המילה וספור כמה הברות יש בה',
      pressOnMic: 'לחץ על המיקרופון וקרא את המילה המודגשת',
      didntHear: 'לא שמעתי... נסה שוב',
      tryAgainEncourage: 'בסדר, נסה שוב! 💪',
      finishedAll: 'סיימת את הכל! כל הכבוד! 🌟',
      letsPlay: 'בוא נתרגל!',
      chooseText: 'בחר טקסט לקריאה',
      notExactly: 'לא בדיוק... נסה שוב!',
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
      listenAndPress: 'הקשיבי לשם האות ולחצי עליה',
      hearLetterName: 'שמעי את שם האות',
      whatLetterName: 'מה השם של האות? בחרי את התשובה הנכונה',
      whatLetterSound: 'מה הצליל של האות? בחרי את התשובה הנכונה',
      listenToWord: 'הקשיבי למילה ולחצי על ההברות בסדר הנכון',
      hearWord: 'שמעי את המילה',
      listenAndCount: 'הקשיבי למילה. כמה חלקים (צירופים) יש בה?',
      howManyCombinations: 'כמה צירופים שמעת במילה?',
      readWithNikud: 'קראי את האות עם הניקוד',
      hearNikud: 'שמעי את הצליל',
      readAndCount: 'קראי את המילה וספרי כמה הברות יש בה',
      pressOnMic: 'לחצי על המיקרופון וקראי את המילה המודגשת',
      didntHear: 'לא שמעתי... נסי שוב',
      tryAgainEncourage: 'בסדר, נסי שוב! 💪',
      finishedAll: 'סיימת את הכל! כל הכבוד! 🌟',
      letsPlay: 'בואי נתרגל!',
      chooseText: 'בחרי טקסט לקריאה',
      notExactly: 'לא בדיוק... נסי שוב!',
    }
  },

  // Get gender-aware text
  text(key) {
    const gender = this.state.gender || 'boy';
    return this.genderText[gender][key] || key;
  },

  init() {
    this.loadState();
    this.bindEvents();
    this.showPage(this.state.currentPage);
  },

  saveState() {
    localStorage.setItem('hebrewReadingState', JSON.stringify(this.state));
  },

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

  bindEvents() {
    // שלב 1: הכנסת שם משפחה
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

    // שלב 2: בחירת מין
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const gender = btn.dataset.gender;
        this.state.gender = gender;
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.saveState();
        setTimeout(() => {
          this.showPage('child-name');
        }, 400);
      });
    });

    // שלב 3: הכנסת שם הילד/ה
    const childForm = document.getElementById('child-name-form');
    if (childForm) {
      childForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('child-name-input');
        const name = input.value.trim();
        if (name) {
          this.state.childName = name;
          this.saveState();
          this.showPage('dashboard');
        }
      });
    }

    // ניווט כללי
    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.navigate;
        this.showPage(target);
      });
    });

    // כפתורי נושאים
    document.querySelectorAll('[data-activity]').forEach(btn => {
      btn.addEventListener('click', () => {
        const activity = btn.dataset.activity;
        if (btn.classList.contains('locked')) return;
        this.navigateToActivity(activity);
      });
    });
  },

  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      this.state.currentPage = pageId;
      this.saveState();
      this.updatePageContent(pageId);
      window.scrollTo(0, 0);
    }
  },

  updatePageContent(pageId) {
    if (pageId === 'gender-select') {
      const nameEl = document.getElementById('gender-family-name');
      if (nameEl) nameEl.textContent = this.state.familyName;
    }

    if (pageId === 'child-name') {
      const titleEl = document.getElementById('child-name-title');
      if (titleEl) {
        const genderWord = this.state.gender === 'girl' ? 'הבת' : 'הבן';
        titleEl.textContent = `מה השם של ${genderWord}?`;
      }
      const input = document.getElementById('child-name-input');
      if (input && this.state.childName) {
        input.value = this.state.childName;
      }
    }

    if (pageId === 'dashboard') {
      const nameEl = document.getElementById('dashboard-family-name');
      if (nameEl) nameEl.textContent = this.state.familyName;

      const childEl = document.getElementById('dashboard-child-name');
      if (childEl) childEl.textContent = this.state.childName;

      const genderGreeting = document.getElementById('dashboard-greeting');
      if (genderGreeting) {
        genderGreeting.textContent = this.text('welcome') + ', ' + this.state.childName + '!';
      }

      // הצגת האותיות של השם בדשבורד
      const lettersEl = document.getElementById('child-name-letters');
      if (lettersEl && this.state.childName) {
        const uniqueLetters = this.getChildNameLetters();
        lettersEl.textContent = uniqueLetters.join('  ');
      }

      this.updateDashboardLocks();
    }
  },

  // חילוץ אותיות ייחודיות מהשם, בלי סופיות
  getChildNameLetters() {
    const finalToRegular = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
    const seen = new Set();
    const letters = [];

    for (const char of this.state.childName) {
      const normalized = finalToRegular[char] || char;
      // רק אותיות עבריות
      if (/[\u05D0-\u05EA]/.test(normalized) && !seen.has(normalized)) {
        seen.add(normalized);
        letters.push(normalized);
      }
    }
    return letters;
  },

  // חישוב סדר פדגוגי של האותיות לפי שם הילד/ה
  computeLetterOrder(allLetters) {
    const childLetters = this.getChildNameLetters();
    const childLetterSet = new Set(childLetters);

    // שלב 1: אותיות השם
    const nameLetters = allLetters.filter(l => childLetterSet.has(l.letter));
    // שמירה על הסדר מהשם
    nameLetters.sort((a, b) => {
      return childLetters.indexOf(a.letter) - childLetters.indexOf(b.letter);
    });

    // שלבים 2-5: שאר האותיות לפי קבוצה פדגוגית, בלי מה שכבר בשם
    const remaining = allLetters.filter(l => !childLetterSet.has(l.letter));
    remaining.sort((a, b) => a.group - b.group);

    return [...nameLetters, ...remaining];
  },

  // בדיקה ועדכון נעילות בדשבורד
  updateDashboardLocks() {
    // ניקוד נפתח רק אחרי שיש התקדמות במודעות פונולוגית
    // קריאה נפתחת רק אחרי שיש התקדמות בניקוד
    const progress = JSON.parse(localStorage.getItem('progress_' + this.state.familyName) || '{}');

    const hasPhonologicalProgress = (
      (progress['syllables'] && progress['syllables'].completed > 0) ||
      (progress['letters-identify'] && progress['letters-identify'].completed > 0)
    );

    const hasNikudProgress = (
      (progress['nikud-coding'] && progress['nikud-coding'].completed > 0)
    );

    const nikudCard = document.getElementById('nikud-card');
    const readingCard = document.getElementById('reading-card');

    if (nikudCard) {
      if (hasPhonologicalProgress) {
        nikudCard.classList.remove('topic-locked');
        nikudCard.querySelectorAll('.subtopic-btn').forEach(b => b.classList.remove('locked'));
      } else {
        nikudCard.classList.add('topic-locked');
        nikudCard.querySelectorAll('.subtopic-btn').forEach(b => b.classList.add('locked'));
      }
    }

    if (readingCard) {
      if (hasNikudProgress) {
        readingCard.classList.remove('topic-locked');
        readingCard.querySelectorAll('.subtopic-btn').forEach(b => b.classList.remove('locked'));
      } else {
        readingCard.classList.add('topic-locked');
        readingCard.querySelectorAll('.subtopic-btn').forEach(b => b.classList.add('locked'));
      }
    }
  },

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

  resetFamily() {
    this.state.familyName = '';
    this.state.childName = '';
    this.state.gender = null;
    this.state.currentPage = 'welcome';
    this.saveState();
    this.showPage('welcome');
    const input = document.getElementById('family-name-input');
    if (input) input.value = '';
  },

  showFeedback(container, type, message) {
    const div = document.createElement('div');
    div.className = `feedback ${type}`;
    div.textContent = message;

    const existing = container.querySelector('.feedback');
    if (existing) existing.remove();

    container.appendChild(div);

    setTimeout(() => {
      if (div.parentNode) div.remove();
    }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
