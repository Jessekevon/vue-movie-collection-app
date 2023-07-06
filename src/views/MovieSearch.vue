<template>
  <div class="container mt-5">
    <h1 class="title is-4">Movie Search</h1>
    <div class="field is-grouped">
      <div class="control is-expanded">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search for a movie"
          class="input"
        />
      </div>
      <div class="control">
        <button @click="searchMovies" class="button is-primary">Search</button>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="column is-3" v-for="movie in movies" :key="movie.id">
        <div class="card">
          <div class="card-image">
            <figure class="image">
              <a @click="openModal(movie)">
                <img
                  :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path"
                  alt="Movie Poster"
                />
              </a>
            </figure>
          </div>
          <div class="card-content">
            <h3 class="title is-6">{{ movie.title }}</h3>
            <div class="field">
              <label class="label">Select Collection</label>
              <div class="control">
                <div class="select">
                  <select v-model="selectedCollection[movie.id]">
                    <option value="" disabled selected>
                      Select Collection
                    </option>
                    <option value="4k UHD">4K UHD</option>
                    <option value="blu-ray">Blu-ray</option>
                    <option value="dvd">DVD</option>
                    <option value="laserdisc">Laserdisc</option>
                    <option value="vhs">VHS</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              @click="addToCollection(movie, selectedCollection)"
              class="button is-success"
            >
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ 'is-active': isModalOpen }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="box" v-if="selectedMovie">
          <button
            class="button is-success is-pulled-right"
            @click="addToCollection(selectedMovie, selectedCollection)"
          >
            Add to Collection
          </button>
          <article class="media">
            <div class="media-content">
              <div class="content">
                <h2 class="title is-4">{{ selectedMovie.title }}</h2>
                <p>Year: {{ getYear(selectedMovie.release_date) }}</p>
                <p>
                  Top Billed Cast: {{ getTopBilledCast(selectedMovie.credits) }}
                </p>
                <p>{{ selectedMovie.overview }}</p>
              </div>
              <div class="stills-slider" v-flickity ref="stillsSlider">
                <div class="still-item" v-for="still in selectedMovie.stills" :key="still.id">
                  <img :src="still.url" alt="Still" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <button
        class="modal-close is-large"
        aria-label="close"
        @click="closeModal"
      ></button>
    </div>
  </div>
</template>

<script>
import api from "../services/api";
import Flickity from "flickity";
import "flickity/dist/flickity.css";

export default {
  data() {
    return {
      searchTerm: "",
      movies: [],
      selectedCollection: {},
      isModalOpen: false,
      selectedMovie: null,
    };
  },
  directives: {
    flickity: {
      inserted(el) {
        const flickitySlider = new Flickity(el, {
          // Flickity options
          cellAlign: "left",
          contain: true,
          wrapAround: true,
        });

        // Ensure Flickity recalculates its size when the modal is fully visible
        const observer = new MutationObserver(() => {
          flickitySlider.resize();
        });
        observer.observe(el, { attributes: true });

        el.flickitySlider = flickitySlider;
      },
      unbind(el) {
        if (el.flickitySlider) {
          el.flickitySlider.destroy();
          delete el.flickitySlider;
        }
      },
    },
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
    selectedMovie: {
      immediate: true,
      handler() {
        if (
          this.selectedMovie &&
          this.selectedMovie.stills &&
          this.selectedMovie.stills.length > 0
        ) {
          this.initializeSlider();
        }
      },
    },
  },
  methods: {
    async searchMovies() {
      try {
        const response = await api.get("search/movie", {
          params: {
            query: this.searchTerm,
          },
        });
        const filteredMovies = response.data.results.filter(
          (movie) => movie.poster_path
        );
        this.movies = filteredMovies;
      } catch (error) {
        console.error(error);
      }
    },
    addToCollection(movie, collection) {
      if (!collection) {
        return;
      }
      const existingItem = this.$store.state.collections.find(
        (item) => item.movie.id === movie.id && item.collection === collection
      );
      if (!existingItem) {
        this.$store.commit("addToCollection", {
          movie,
          collection,
        });
      }
    },
    async openModal(movie) {
      this.selectedMovie = movie;
      this.isModalOpen = true;
      try {
        const response = await api.get(`movie/${movie.id}/credits`);
        this.selectedMovie.credits = response.data;

        const stillsResponse = await api.get(`movie/${movie.id}/images`, {
          params: {
            include_all_sizes: true,
          },
        });
        this.selectedMovie.stills = stillsResponse.data.backdrops.map(
          (backdrop) => ({
            id: backdrop.file_path,
            url: `https://image.tmdb.org/t/p/w500${backdrop.file_path}`,
          })
        );

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.initializeSlider();
          });
        });
      } catch (error) {
        console.error(error);
      }
    },

    getYear(date) {
      if (date) {
        return new Date(date).getFullYear();
      }
      return "N/A";
    },
    getTopBilledCast(credits) {
      if (credits && credits.cast && credits.cast.length > 0) {
        return credits.cast
          .slice(0, 3)
          .map((cast) => cast.name)
          .join(", ");
      }
      return "N/A";
    },
    closeModal() {
      this.selectedMovie = null;
      this.isModalOpen = false;
    },
    initializeSlider() {
      if (this.selectedMovie && this.selectedMovie.stills && this.selectedMovie.stills.length > 0) {
        this.$nextTick(() => {
          if (this.flickitySlider) {
            this.flickitySlider.destroy();
            this.flickitySlider = null;
          }
          const stillsSlider = this.$refs.stillsSlider;
          if (stillsSlider) {
            stillsSlider.classList.add('flickity-enabled');
            this.flickitySlider = new Flickity(stillsSlider, {
              // Flickity options
              cellAlign: 'left',
              contain: true,
              wrapAround: true
            });
          }
        });
      } else {
        this.$nextTick(() => {
          if (this.flickitySlider) {
            this.flickitySlider.destroy();
            this.flickitySlider = null;
          }
          const stillsSlider = this.$refs.stillsSlider;
          if (stillsSlider) {
            stillsSlider.classList.remove('flickity-enabled');
          }
        });
      }
    }
  },
};
</script>
