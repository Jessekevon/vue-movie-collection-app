<template>
    <div>
        <h1>Collections</h1>
        <ul>
            <li v-for="(item, index) in collections" :key="index">
                <h3>{{ item.movie.title }}</h3>
                <p>Collection: {{ item.collection }}</p>
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
};
</script>
