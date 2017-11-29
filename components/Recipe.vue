<template>
  <div>
    <div class="Recipe"
        :class="{ 'Recipe__Toggler_hover': toggler_hovered }">
      <div v-if="editing">
      <div class="clearfix">
        <button class="Recipe__Edit" @click="editing = !editing">Сохранить</button>
      </div>
        <label class="Recipe__Title">Название</label>
        <input class="Recipe__Title" v-model="recipe.title">
        <br>

        <label class="Recipe__Mass">Масса</label>
        <input class="Recipe__Mass" :value="mass" @input="total_mass = $event.target.value">
        <br>

        <label class="Recipe__Proportions"
          :for="'proportional_recipe'+ id">
          {{ proportional ? 'Сохранять пропорции' : 'Не сохранять пропорции' }}
        </label>
        <input class="Recipe__Proportions" 
          :id="'proportional_recipe'+ id"
          type="checkbox"
          v-model="proportional">
      </div>
      <div v-else>
        <div class="clearfix">
          <h2 class="Recipe__Title">{{ recipe.title }}</h2>
          <button class="Recipe__Edit" @click="editing = !editing">Редактировать</button>
        </div>
      </div>

      <ExpandToggle :expanded="expand" :hovered="hover" v-if="editing"/>
      <div v-if="expanded || !editing"
          :class="{
            Recipe__RecipeComponents: editing
          }">
        <RecipeComponent v-for="item in r_components" :id="item.id" :key="item.id"/>
        <button class="Recipe__Add__RecipeComponent" @click="addRComponent" v-if="editing">Добавить компонент</button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import RecipeComponent from '~/components/RecipeComponent.vue'
import ExpandToggle from '~/components/ExpandToggle.vue'

export default {
  components: {
    RecipeComponent,
    ExpandToggle
  },
  props: ['id'],
  data: function () {
    var recipe, self
    self = this
    recipe = _.find(this.$store.state.recipes, function (r) {
      return r.id === self.id
    })
    return {
      recipe: recipe,
      total_mass: null,
      proportional: true,
      expanded: false,
      toggler_hovered: false,
      editing: false
    }
  },
  computed: {
    r_components: function () {
      var self = this
      return _.filter(this.$store.state.recipe_components, function (r) {
        return r.r_id === self.id
      })
    },
    mass: function () {
      var self = this
      return _.sumBy(this.r_components, function (rc) {
        return _.sumBy(_.filter(self.$store.state.ingridients, function (i) {
          return i.rc_id === rc.id
        }), function (i) {
          return parseFloat(i.mass)
        })
      })
    }
  },
  watch: {
    total_mass: function (newValue) {
      this.$store.commit('CHANGE_MASS', {
        recipe: this,
        mass: newValue
      })
    }
  },
  methods: {
    expand: function (e) {
      this.expanded = !this.expanded
    },
    hover: function (e) {
      this.toggler_hovered = !this.toggler_hovered
    },
    addRComponent: function (id) {
      this.$store.commit('ADD_RCOMPONENT', {recipe: this})
    },
    removeRComponent: function (id) {
      this.$store.commit('REMOVE_RCOMPONENT', {r_component_id: id, recipe: this})
    }
  }

}
</script>

<style>
  .Recipe {
    padding: 10px;
    margin: 10px auto;
    border: 2px solid gray;
    width: 697px;
    box-shadow: 5px 5px 20px 5px rgba(0,0,0,.5);
  }
  .Recipe__Edit {
    float: right;
  }
  
  h2.Recipe__Title {
    text-align: center;
    display: inline-block;
    width: 300px;
  }
  label.Recipe__Mass,
  label.Recipe__Title,
  label.Recipe__Proportions {
    display: inline-block;
    padding-left: 20px;
    width: 391px;
  }

  input.Recipe__Mass,
  input.Recipe__Title {
    width: 220px;
    padding: 3px;
    margin: 2px;
  }
  input.Recipe__Proportions {
    width: 13px;
    padding: 3px;
    margin: 2px;
    margin-top: 8px;
  }

  .Recipe__RecipeComponents {
    /*border: 1px dashed gray;*/
    margin: 10px;
    margin-left: 20px;
    width: 655px;
  }

  .Recipe__RecipeComponents__Expand {
    width: 655px;
    cursor: pointer;
    display: block;
    padding: 0 20px;
    background: url(/dev_toplink.png) no-repeat;
    background-position: left -13px;
    margin: 5px 0px 0px 0px;
  }
  .Recipe__Toggler_hover, .RecipeComponent__Toggler_hover {
    background-color: rgba(196, 216, 240, 0.47843);
  }
  .Recipe__RecipeComponents_hover {
    text-decoration: underline;
  }
  .Recipe__RecipeComponents_expanded {
    background-position: left 0px;
  }
.RecipeComponent_editing:last-child{ background: red; }


  .RecipeComponents {
    padding: 10px;
  }

  .RecipeComponent {
    padding: 10px;
  }

  .RecipeComponent__Title {
    float: left;
    display: inline-block;
    margin: 0px;
    width: 110px;
  }
  .RecipeComponent__Title, .RecipeComponent__Mass {
    border-bottom: 1px solid; 
    margin-top: 5px;
    display: inline-block;
  }

  .RecipeComponent_editing {
    padding-top: 5px;
    border-bottom: 1px dashed; 
  }

  .RecipeComponent__Ingridients {
    padding: 10px;
  }
  
  label.RecipeComponent__Title_editing,
  label.RecipeComponent__Mass__Absolute_editing,
  label.RecipeComponent__Mass__Relative_editing,
  label.RecipeComponent__Proportions {
    padding-left: 21px;
    display: inline-block;
    width: 358px;
  }

  input.RecipeComponent__Title_editing,
  input.RecipeComponent__Mass__Absolute_editing,
  input.RecipeComponent__Mass__Relative_editing {
    width: 210px;
    padding: 3px;
    margin: 2px;
  }
  input.RecipeComponent__Proportions  {
    width: 13px;
    padding: 3px;
    margin-top: 8px;
  }

  .Recipe__Add__RecipeComponent {
    margin: 10px 10px 10px 10px;
  }
  .RecipeComponent__Add__Ingridient {
    margin: 10px 10px 10px 0px;
  }

  .RecipeComponent__Remove,
  .Ingridient__Remove {
    width: 100%;
  }

  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }

  .RecipeComponent__Remove button,
  .Ingridient__Remove button {
    float: right;
  }

  .Ingridient {
    padding-left: 10px;
    width: 200px;
  }
  .Ingridient_editing {
    background: #ddd;
    border: 1px dashed gray;
    padding: 10px;
    width: 594px;
  }

  label.Ingridient__Title_editing,
  label.Ingridient__Mass__Relative_editing,
  label.Ingridient__Mass__Absolute_editing {
    display: inline-block;
    width: 360px;
  }
  input.Ingridient__Title_editing,
  input.Ingridient__Mass__Relative_editing,
  input.Ingridient__Mass__Absolute_editing {
    padding: 3px;
    margin: 2px;
    width: 190px;
  }
  .Ingridient__Title, .Ingridient__Mass {
    width: 100px; 
    float: left;
  }

</style>