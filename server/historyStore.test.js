const test = require('node:test');
const assert = require('node:assert/strict');
const { createHistoryStore } = require('./historyStore');

test('stores and retrieves recent searches in order', () => {
  const store = createHistoryStore();

  store.addSearch({
    username: 'octocat',
    avatar_url: 'https://example.com/octocat.png',
    rating: 8.7,
    rating_reason: 'Strong engineer',
  });

  store.addSearch({
    username: 'gaearon',
    avatar_url: 'https://example.com/gaearon.png',
    rating: 6.4,
    rating_reason: 'Solid contributor',
  });

  const history = store.getRecentSearches();

  assert.equal(history.length, 2);
  assert.equal(history[0].username, 'gaearon');
  assert.equal(history[1].username, 'octocat');
});
