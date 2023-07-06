<template>
    <div>
        <h1>Movie Search</h1>
        <input type="text" v-model="searchTerm" placeholder="Search for a movie">
        <button @click="searchMovies">Search</button>

        <div class="grid grid-cols-4 gap-4">
            <div v-for="movie in movies" :key="movie.id">
                <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" alt="Movie Poster">
                <h3>{{ movie.title }}</h3>
                <select v-model="selectedCollection" @change="addToCollection(movie)">
                    <option disabled value="">Select Collection</option>
                    <option value="vhs">VHS</option>
                    <option value="blu-ray">Blu-ray</option>
                    <option value="4k UHD">4K UHD</option>
                    <option value="laserdisc">Laserdisc</option>
                    <option value="dvd">DVD</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return {
            searchTerm: '',
            movies: [],
            selectedCollection: '',
        };
    },
    watch: {
        searchTerm: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.searchMovies();
                } else {
                    this.movies = [];
                }
            },
        },
    },
    methods: {
        async searchMovies() {
            try {
                const response = await api.get('search/movie', {
                    params: {
                        query: this.searchTerm,
                    },
                });
                this.movies = response.data.results;
            } catch (error) {
                console.error(error);
            }
        },
        addToCollection(movie) {
            this.$store.commit('addToCollection', {
                movie,
                collection: this.selectedCollection,
            });
        },
    },
};
</script>
