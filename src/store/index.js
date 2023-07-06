import { createStore } from "vuex";

// Get collections from local storage if available
const savedCollections = JSON.parse(localStorage.getItem("collections")) || [];

export default createStore({
  state: {
    collections: savedCollections,
  },
  mutations: {
    addToCollection(state, { movie, collection }) {
      state.collections.push({ movie, collection });
      // Save collections to local storage
      localStorage.setItem("collections", JSON.stringify(state.collections));
    },
  },
});
