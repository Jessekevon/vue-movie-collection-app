<template>
  <div class="container mt-5">
    <h1 class="title is-4">Collections</h1>
    <ul>
      <li v-for="(item, index) in collections" :key="index">
        <div class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img
                v-if="
                  index === 0 ||
                  item.movie.id !== collections[index - 1].movie.id
                "
                :src="
                  'https://image.tmdb.org/t/p/w200' + item.movie.poster_path
                "
                alt="Movie Poster"
              />
            </figure>
          </div>
          <div class="media-content">
            <div
              v-if="
                index === 0 || item.movie.id !== collections[index - 1].movie.id
              "
            >
              <h3 class="title is-6">{{ item.movie.title }}</h3>
              <p class="subtitle is-7">
                Collection Count: {{ countCollections(item.movie) }}
              </p>
            </div>
          </div>
          <div class="media-right">
            <p>Collection: {{ item.collection }}</p>
          </div>
        </div>
        <button @click="removeFromCollection(index)" class="button is-danger">
          Remove from Collection
        </button>
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
      return this.$store.state.collections.filter(
        (item) => item.movie.id === movie.id
      ).length;
    },
    removeFromCollection(index) {
      this.$store.state.collections.splice(index, 1);
      // Save updated collections to local storage
      localStorage.setItem(
        "collections",
        JSON.stringify(this.$store.state.collections)
      );
    },
  },
};
</script>

<style>
  ul li:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
  }
</style>
