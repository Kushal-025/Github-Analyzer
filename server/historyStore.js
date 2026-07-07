const createHistoryStore = () => {
  const items = [];

  return {
    addSearch(search) {
      items.unshift({
        id: Date.now() + Math.random(),
        ...search,
        searched_at: new Date().toISOString(),
      });
      return items[0];
    },
    getRecentSearches(limit = 10) {
      return items.slice(0, limit);
    },
  };
};

module.exports = { createHistoryStore };
