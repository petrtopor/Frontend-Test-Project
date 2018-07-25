<template>
  <div class="date-group">
    {{date}}
    <event v-for="event in events" :event=event @event_edit="eventEditHandle"/>
  </div>
</template>
<script>
  import store from './../store'
  import Event from './Event'
  import './../assets/css/DateGroup.scss'
  export default {
    name: 'DateGroup',
    store,
    components: {
      Event
    },
    data: function () {
      return {
        testData: 'Test data from DateGroup component'
      }
    },
    props: {
      date: '',
      allEvents: {}
    },
    computed: {
      events: function () {
        var events = []
        for (var i = 0; i < this.allEvents.length; i++) {
          if (this.allEvents[i].Date === this.date) {
            events.push(this.allEvents[i])
          }
        }
        return events
      }
    },
    methods: {
      eventEditHandle: function (event) {
        console.log('Event came from eventEditHandle: \n', event)
        this.$emit('event_edit', event)
      }
    }
  }
</script>
