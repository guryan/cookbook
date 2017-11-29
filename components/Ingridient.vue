<template>
  <div :class="{
    Ingridient: !editing,
    Ingridient_editing: editing
  }">
    <div v-if="editing">
      <div class="Ingridient__Remove clearfix">
        <button @click="$parent.removeIngridient(id)" alt="Удалить">X</button>
      </div>
      <label class="Ingridient__Title_editing">Название</label>
      <input class="Ingridient__Title_editing" v-model="ingridient.title">
      <br>

      <label class="Ingridient__Mass__Absolute_editing">Масса</label>
      <input class="Ingridient__Mass__Absolute_editing" :value="ingridient.mass"
      @input="absolute_mass = $event.target.value">
      <br>

      <label class="Ingridient__Mass__Relative_editing">Процентная доля</label>
      <input class="Ingridient__Mass__Relative_editing" :value="calculate_percent_mass"
      @input="percent_mass = $event.target.value"
      :disabled="! $parent.proportional">
    </div>
    <div v-else class="clearfix">
      <div class="Ingridient__Title">
        {{ ingridient.title }}
      </div>
      <div class="Ingridient__Mass">
        <b>{{ ingridient.mass }}</b>
      </div>


    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: [
    'id'
  ],
  data: function () {
    var ingridient, self
    self   = this
    ingridient = _.find(this.$store.state.ingridients, function (r) {
      return r.id === self.id
    })
    return {
      ingridient: ingridient,
      percent_mass: null,
      absolute_mass: null
    }
  },
  computed: {
    editing: function () {
      return this.$parent.editing
    },
    calculate_percent_mass: function () {
      return (this.ingridient.mass / this.$parent.mass * 100).toFixed(2)
    }
  },
  watch: {
    absolute_mass: function (newValue) {
      var data
      data = {
        mass: parseFloat(newValue),
        ingridient: this,
        r_component: this.$parent
      }
      if (this.proportional) {
        this.$store.commit('INGRIDIENT_MASS_PROPORTIONALLY', data)
      } else {
        this.$store.commit('INGRIDIENT_MASS', data)
      }
    },
    percent_mass: function (newValue) {
      this.$store.commit('INGRIDIENT_RELATIVE_MASS', {
        mass: parseFloat(newValue),
        ingridient: this,
        r_component: this.$parent
      })
    }
  }
}
</script>
