/* === Progress Tracking === */

const Progress = {
  data: {},

  // Load progress for current family
  load(familyName) {
    const key = `progress_${familyName}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.data = {};
      }
    } else {
      this.data = {};
    }
  },

  // Save progress
  save(familyName) {
    const key = `progress_${familyName}`;
    localStorage.setItem(key, JSON.stringify(this.data));
  },

  // Get progress for a specific activity
  getActivity(activityId) {
    return this.data[activityId] || { completed: 0, total: 0, items: {} };
  },

  // Mark an item as completed in an activity
  completeItem(familyName, activityId, itemId) {
    if (!this.data[activityId]) {
      this.data[activityId] = { completed: 0, total: 0, items: {} };
    }
    if (!this.data[activityId].items[itemId]) {
      this.data[activityId].items[itemId] = true;
      this.data[activityId].completed = Object.keys(this.data[activityId].items).length;
    }
    this.save(familyName);
  },

  // Set total items for an activity
  setTotal(familyName, activityId, total) {
    if (!this.data[activityId]) {
      this.data[activityId] = { completed: 0, total: 0, items: {} };
    }
    this.data[activityId].total = total;
    this.save(familyName);
  },

  // Get completion percentage
  getPercentage(activityId) {
    const activity = this.getActivity(activityId);
    if (activity.total === 0) return 0;
    return Math.round((activity.completed / activity.total) * 100);
  },

  // Update progress bar element
  updateProgressBar(element, activityId) {
    const pct = this.getPercentage(activityId);
    const fill = element.querySelector('.fill');
    if (fill) {
      fill.style.width = pct + '%';
    }
  }
};
