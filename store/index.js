import Vuex from 'vuex'
import _ from 'lodash'

// Генерирует новый ID
const newId = function (collection) {
  return (parseInt(_.max(_.map(collection, function (i) { return i.id }))) || 0 + 1).toString()
}

// Из ингридиентов, из второго аргумента
// Возвращает лишь те, что принадлежат компоненту, переданому первым аргументов
const rComponentIngridients = function (rComponent, allIngridients) {
  return _.filter(allIngridients, function (i) { return i.rc_id === rComponent.id })
}

const state = {
  recipes: [
    {
      id: '1',
      title: 'Торт'
    },
    {
      id: '2',
      title: 'Селедка под шубой'
    }
  ],
  recipe_components: [
    {
      id: '1',
      r_id: '1',
      title: 'Тесто'
    },
    {
      id: '2',
      r_id: '1',
      title: 'Крем'
    },
    {
      id: '3',
      r_id: '1',
      title: 'Начинка'
    },
    {
      id: '4',
      r_id: '2',
      title: 'Верхний слой'
    },
    {
      id: '5',
      r_id: '2',
      title: 'Нижний слой'
    }
  ],
  ingridients: [
    {
      id: '1',
      rc_id: '1',
      title: 'Дрожи',
      mass: 10
    },
    {
      id: '2',
      rc_id: '1',
      title: 'Яйцо',
      mass: 30
    },
    {
      id: '3',
      rc_id: '1',
      title: 'Мука',
      mass: 60
    },
    {
      id: '4',
      rc_id: '2',
      title: 'Мед',
      mass: 150
    },
    {
      id: '5',
      rc_id: '2',
      title: 'Сметана',
      mass: 150
    },
    {
      id: '6',
      rc_id: '3',
      title: 'Ягоды свежие',
      mass: 600
    },
    {
      id: '7',
      rc_id: '4',
      title: 'Свекла',
      mass: 500
    },
    {
      id: '8',
      rc_id: '4',
      title: 'Картошка',
      mass: 250
    },
    {
      id: '9',
      rc_id: '4',
      title: 'Марковка',
      mass: 250
    },
    {
      id: '10',
      rc_id: '5',
      title: 'Селдь',
      mass: 900
    },
    {
      id: '11',
      rc_id: '5',
      title: 'Лук',
      mass: 100
    }
  ]
}

// Все хорошо и понятно
const mutations = {
  ADD_RCOMPONENT: function (state, data) {
    var id = newId(_.filter(state.recipe_components, function (i) {
      return i.r_id === data.recipe.id
    }))
    console.log(id)
    state.recipe_components.push({
      id: id,
      r_id: data.recipe.id,
      title: 'RCOMPONENT ' + id
    })
  },
  REMOVE_RCOMPONENT: function (state, data) {
    state.recipe_components = _.filter(state.recipe_components, function (i) {
      if (i.id !== data.r_component_id) { return i }
    })
  },
  CHANGE_MASS: function (state, data) {
    var coef =  data.mass / data.recipe.mass
    _.each(state.ingridients, function (i) {
      i.mass = i.mass * coef
    })
  },
  RCOMPONENT_MASS: function (state, data) {
    var coef =  data.mass / data.r_component.mass
    _.each(data.r_component.ingridients, function (i) {
      i.mass = i.mass * coef
    })
  },
  RCOMPONENT_MASS_PROPORTIONALLY: function (state, data) {
    var coef =  data.mass / data.r_component.mass
    _.each(state.ingridients, function (i) {
      i.mass = i.mass * coef
    })
  },
  RCOMPONENT_RELATIVE_MASS: function (state, data) {
    var newRelativeMass, coef, rComponentMass, oldRComponentMass, totalMass
    totalMass =  data.recipe.mass
    coef = 1 + (data.r_component.calculate_percent_mass - data.mass) / (100 - data.r_component.calculate_percent_mass)
    rComponentMass = function (item) {
      return _.sumBy(rComponentIngridients(item, state.ingridients), function (i) {
        return parseFloat(i.mass)
      })
    }
    _.each(data.recipe.r_components, function (i) {
      oldRComponentMass = rComponentMass(i)
      if (i.id === data.r_component.id) {
        newRelativeMass = data.mass / 100
      } else {
        newRelativeMass = oldRComponentMass / totalMass * coef
      }
      _.each(rComponentIngridients(i, state.ingridients), function (i) {
        i.mass = ((i.mass / oldRComponentMass) * (data.r_component.mass / data.mass * 100) * newRelativeMass).toFixed(2)
      })
    })
  },
  ADD_INGRIDIENT: function (state, data) {
    var id = newId(_.filter(state.ingridients, function (i) {
      return i.rc_id === data.r_component.id
    }))
    state.ingridients.push({
      id: id,
      rc_id: data.r_component.id,
      title: 'ingridient ' + id,
      mass: 0,
      percent_mass: null
    })
  },
  REMOVE_INGRIDIENT: function (state, data) {
    state.ingridients = _.filter(state.ingridients, function (i) {
      if (i.id !== data.ingridient_id) { return i }
    })
  },
  INGRIDIENT_MASS: function (state, data) {
    _.find(data.r_component.ingridients, function (i) {
      return i.id === data.ingridient.id
    }).mass = data.mass
  },
  INGRIDIENT_MASS_PROPORTIONALLY: function (state, data) {
    console.log('CHANGE_MASS_PROPORTIONALLY')
    var newMass, coef
    coef = data.mass / data.ingridient.calculate_percent_mass * 100 / data.r_component.mass
    _.each(data.r_component.ingridients, function (i) {
      if (i.id === data.ingridient.id) {
        newMass = data.mass
      } else {
        newMass = i.mass * coef
      }
      i.mass = newMass
    })
  },
  INGRIDIENT_RELATIVE_MASS: function (state, data) {
    var newRelativeMass, coef, rComponentMass
    rComponentMass = data.r_component.mass
    coef = 1 + (data.ingridient.calculate_percent_mass - data.mass) / (100 - data.ingridient.calculate_percent_mass)
    _.each(data.r_component.ingridients, function (i) {
      if (i.id === data.ingridient.id) {
        newRelativeMass = data.mass / 100
      } else {
        newRelativeMass = i.mass / rComponentMass * coef
      }
      i.mass = ((data.ingridient.ingridient.mass / data.mass * 100) * newRelativeMass).toFixed(2)
    })
  }
}

const createStore = () => {
  return new Vuex.Store({
    state: state,
    mutations: mutations
  })
}

export default createStore
