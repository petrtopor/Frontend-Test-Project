<template>
  <div class="event" v-if="show" style="height: 138px;">
    <div class="close">
      <div class="close-icon"></div>
    </div>
    <div class="caption-content">
      <div class="caption">{{this.event.Caption}}</div>
      <div class="content">{{this.event.Content}}</div>
    </div>
    <div class="time-place">
      <div class="time">
        {{this.event.Time}}
      </div>
      <div class="place">{{this.event.Location}}</div>
    </div>
    <div class="importance"/>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueTouch from 'vue-touch'
  import interact from 'interactjs'
  import TweenMax from 'gsap/TweenMax'
  import Draggable from 'gsap/Draggable'
  import './../assets/css/Event.scss'
  
  Vue.use(VueTouch)

  export default {
    name: 'Event',
    mounted: function () {
      var element = this.$el
      interact(element).draggable({
        onstart: this.onStartListener,
        onmove: this.onMoveListener,
        onend: this.onEndListener
      })
      Draggable.create(element, {type: 'x'})
    },
    beforeUpdate: function () {
      var element = this.$el
      interact(element).draggable({
        onstart: this.onStartListener,
        onmove: this.onMoveListener,
        onend: this.onEndListener
      })
      Draggable.create(element, {type: 'x'})
    },
    data: function () {
      return {
        show: true,
        direction: '',
        startX: 0,
        speed: 0,
        shift: 0,
        touched: false,
        desiredAction: ''
      }
    },
    methods: {
      onStartListener: function (event) {
        this.startX = event.x0
        this.shift = 0
      },
      onMoveListener: function (event) {
        var direction = ''
        if (this.touched === false) {
          if (event.dx > 0) {
            direction = 'right'
          }
          if (event.dx < 0) {
            direction = 'left'
          }
          this.direction = direction
          this.touched = true
        }
        this.speed = event.speed
        this.shift += event.dx

        if (this.direction === 'right') {
          TweenMax.to(event.target, 0.5, {opacity: event.target.offsetWidth / this.shift / 16})
        }
      },
      onEndListener: function (event) {
        // var action = ''
        var th = this
        var animationComplete = function () {
          alert('Animation complete with no further event emission')
        }
        var emitEditEvent = function () {
          // alert('Now it\'s time to emit event...')
          th.$nextTick(function () {
            th.$emit('event_edit', th.event)
          })
        }
        if (this.direction === 'left') {
          // alert('сейчас будем редактировать событие...')
          // this.$nextTick(function () {
          // this.$emit('event_edit', this.event)
          // this.show = false
          animationComplete = emitEditEvent
          // })
        }
        if (this.direction === 'right' && this.shift >= (event.target.offsetWidth / 4)) {
          this.show = false
        } else {
          TweenMax.to(event.target, 0.5, {x: 0})
        }
        TweenMax.to(event.target, 0.9, {opacity: 1, onComplete: animationComplete})
        this.touched = false
        /* if (action === 'edit') {
          this.$nextTick(function () {
            this.$emit('event_edit', this.event)
          })
        } */
        /*
        this.$nextTick(function () {
          if (this.desiredAction === 'edit') {
            this.$nextTick(function () {
              this.$emit('event_edit', this.event)
            })
          }
        }) */
      }
    },
    props: {
      event: Object
    }
  }
</script>
