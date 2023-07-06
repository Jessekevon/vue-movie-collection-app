<template>
    <div>
        <h1>Collections</h1>
        <ul>
            <li v-for="(item, index) in collections" :key="index">
                <div class="flex items-center">
                    <img v-if="index === 0 || item.movie.id !== collections[index - 1].movie.id"
                        :src="'https://image.tmdb.org/t/p/w200' + item.movie.poster_path" alt="Movie Poster">
                    <div v-if="index === 0 || item.movie.id !== collections[index - 1].movie.id">
                        <h3>{{ item.movie.title }}</h3>
                    </div>
                    <p v-if="index === 0 || item.movie.id !== collections[index - 1].movie.id">
                        Collection Count: {{ countCollections(item.movie) }}
                    </p>
                    <p>Collection: {{ item.collection }}</p>
                </div>
                <button @click="removeFromCollection(index)">Remove from Collection</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    computed: {
        collections() {
            return this.$store.state.collections;
        },
    },
    methods: {
        countCollections(movie) {
            return this.$store.state.collections.filter(item => item.movie.id === movie.id).length;
        },
        removeFromCollection(index) {
            this.$store.state.collections.splice(index, 1);
            // Save updated collections to local storage
            localStorage.setItem('collections', JSON.stringify(this.$store.state.collections));
        },
    },
};
</script>

<style scoped>
img {
    width: 100px;
    height: auto;
    margin-right: 1rem;
}
</style>
