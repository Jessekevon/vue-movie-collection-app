<template>
  <div id="app">
    <nav class="navbar is-primary" role="navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item text-xl font-bold" href="#">
            Movie Search
          </a>
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu"
            @click="toggleNav">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div :class="['navbar-menu', { 'is-active': isNavOpen }]">
          <div class="navbar-end">
            <router-link to="/" class="navbar-item text-xl font-bold">Movie Search</router-link>
            <router-link to="/collections" class="navbar-item text-xl font-bold">Collections</router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNavOpen: false,
    };
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
  },
};
</script>
