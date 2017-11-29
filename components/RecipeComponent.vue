<template>
  <div :class="{
        'RecipeComponent__Toggler_hover': toggler_hovered,
        'RecipeComponent_editing': editing
      }">

    <div v-if="editing">
      <div class="RecipeComponent__Remove clearfix">
        <button @click="$parent.removeRComponent(id)" alt="Удалить">X</button>
      </div>

      <label class="RecipeComponent__Title_editing">Название</label>
      <input class="RecipeComponent__Title_editing" v-model="r_component.title">
      <br>

      <label class="RecipeComponent__Mass__Absolute_editing">Масса</label>
      <input class="RecipeComponent__Mass__Absolute_editing"
      :value="mass"
      @input="absolute_mass = $event.target.value">
      <br>

      <label class="RecipeComponent__Mass__Relative_editing">Процентная доля</label>
      <input class="RecipeComponent__Mass__Relative_editing"
      :value="calculate_percent_mass"
      @input="percent_mass = $event.target.value"
      :disabled="! $parent.proportional">
      <br>

      <label class="RecipeComponent__Proportions" :for="'proportional_rcomponent'+ id">
        {{ proportional ? 'Сохранять пропорции' : 'Не сохранять пропорции' }}
      </label>
      <input class="RecipeComponent__Proportions" :id="'proportional_rcomponent'+ id" type="checkbox" v-model="proportional">

    </div>
    <div v-else class="clearfix">
    
      <h4 class="RecipeComponent__Title">{{ r_component.title }}</h4>
      <b class="RecipeComponent__Mass">{{ mass }}&nbsp;г.&nbsp;</b>
      <small class="RecipeComponent__Mass">({{ calculate_percent_mass }}%)</small>
    </div>

    <ExpandToggle :expanded="expand" :hovered="hover" v-if="editing"/>
    <div v-if="expanded || !editing"
        :class="{
          RecipeComponent__Ingridients: editing
        }">
      <Ingridient v-for="i in ingridients" :key="i.id" :id="i.id"/>
      <button class="RecipeComponent__Add__Ingridient" @click="addIngridient" v-if="editing"><b>+</b></button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Ingridient from '~/components/Ingridient.vue'
import ExpandToggle from '~/components/ExpandToggle.vue'

export default {
  components: {
    Ingridient,
    ExpandToggle
  },
  props: [
    'id'
  ],
  data: function () {
    var rComponent, self
    self = this
    rComponent = _.find(this.$store.state.recipe_components, function (r) {
      return r.id === self.id
    })
    return {
      r_component: rComponent,
      absolute_mass: null,
      percent_mass: null,
      proportional: true,
      expanded: false,
      toggler_hovered: false
    }
  },
  computed: {
    editing: function () {
      return this.$parent.editing
    },
    mass: function () {
      return _.sumBy(this.ingridients, function (i) {
        return parseFloat(i.mass)
      })
    },
    ingridients: function () {
      var self, ingridients
      self = this
      return _.filter(this.$store.state.ingridients, function (r) {
        return r.rc_id === self.id
      })
    },
    calculate_percent_mass: function () {
      return (this.mass / this.$parent.mass * 100).toFixed(2)
    }
  },
  watch: {
    absolute_mass: function (newValue) {
      var data = {
        recipe: this.$parent, r_component: this, mass: newValue
      }
      if (this.$parent.proportional) {
        this.$store.commit('RCOMPONENT_MASS_PROPORTIONALLY', data)
      } else {
        this.$store.commit('RCOMPONENT_MASS', data)
      }
    },
    percent_mass: function (newValue) {
      this.$store.commit('RCOMPONENT_RELATIVE_MASS', {
        recipe: this.$parent, r_component: this, mass: newValue
      })
    }
  },
  methods: {
    expand: function () {
      this.expanded = !this.expanded
    },
    hover: function () {
      this.toggler_hovered = !this.toggler_hovered
    },
    addIngridient: function () {
      this.$store.commit('ADD_INGRIDIENT', {r_component: this})
    },
    removeIngridient: function (id) {
      this.$store.commit('REMOVE_INGRIDIENT', {ingridient_id: id, r_component: this})
    }
  }
}
</script>