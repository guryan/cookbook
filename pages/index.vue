<template>
  <div>
    <Recipe v-for="recipe in this.$store.state.recipes" :id="recipe.id" :key="recipe.id"/>
  </div>
</template>

<script>
import Recipe from '~/components/Recipe.vue'

export default {
  components: {
    Recipe
  }
}
</script>