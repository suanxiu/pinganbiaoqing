const STORAGE_KEY = 'pingan.style-choices';
const MIN_CHOICES = 3;
const CONFIDENCE_THRESHOLD = 0.7;

function getChoices() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function recordChoice(styleId) {
  const next = getChoices().concat([{ styleId: styleId, createdAt: Date.now() }]).slice(-30);
  wx.setStorageSync(STORAGE_KEY, next);
}

function getPreference() {
  const choices = getChoices();
  const counts = {};
  let winner = '';
  let winnerCount = 0;
  choices.forEach(function (item) {
    counts[item.styleId] = (counts[item.styleId] || 0) + 1;
    if (counts[item.styleId] > winnerCount) {
      winner = item.styleId;
      winnerCount = counts[item.styleId];
    }
  });
  return {
    styleId: winner,
    choiceCount: choices.length,
    confidence: choices.length ? winnerCount / choices.length : 0,
    qualified: choices.length >= MIN_CHOICES && choices.length ? winnerCount / choices.length >= CONFIDENCE_THRESHOLD : false
  };
}

function sortCandidates(candidates, scene, dayKey) {
  const preference = getPreference();
  const offset = dayKey % Math.max(candidates.length, 1);
  const rotated = candidates.slice(offset).concat(candidates.slice(0, offset));
  const sorted = rotated.sort(function (left, right) {
    const leftScore = left.defaultWeight + (preference.qualified && left.theme === preference.styleId ? 1000 : 0);
    const rightScore = right.defaultWeight + (preference.qualified && right.theme === preference.styleId ? 1000 : 0);
    return rightScore - leftScore;
  });
  return { items: sorted, preference: preference, scene: scene };
}

module.exports = { recordChoice: recordChoice, getPreference: getPreference, sortCandidates: sortCandidates };
