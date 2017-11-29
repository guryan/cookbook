<template>
  <div class="ExpandToggle" 
      :class="{
        'ExpandToggle_hover': toggler_hovered,
        'ExpandToggle_expanded': toggler_expanded
      }"
      @mouseenter="hover(true)"
      @mouseleave="hover(false)"
      @click="expand">
      {{ toggler_expanded ? 'Свернуть' : 'Развернуть' }}
    </div>
</template>

<script>
export default {
  data: function  () {
    return {
      toggler_hovered: false,
      toggler_expanded: false
    }
  },
  props: [
    'hovered',
    'expanded'
  ],
  methods: {
    hover: function (hovered) {
      this.toggler_hovered = hovered
      if (typeof this.hovered === 'function') {
        this.hovered()
      }
    },
    expand: function (e) {
      this.toggler_expanded = !this.toggler_expanded
      if (typeof this.expanded === 'function') {
        this.expanded()
      }
    }
  }
}
</script>

<style>
.ExpandToggle {
  width: 655px;
  cursor: pointer;
  display: block;
  padding: 0 20px;
  background: url(/dev_toplink.png) no-repeat;
  background-position: left -13px;
  margin: 5px 0px 5px;
}
.ExpandToggle_hover {
  text-decoration: underline;
}
.ExpandToggle_expanded {
  background-position: left 0px;
}
</style>