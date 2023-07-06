import { createStore } from 'vuex';

export default createStore({
    state: {
        collections: [],
    },
    mutations: {
        addToCollection(state, { movie, collection }) {
            state.collections.push({ movie, collection });
        },
    },
});
