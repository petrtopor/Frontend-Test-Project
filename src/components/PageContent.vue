<template>
  <main>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex>
            <date-group v-for="dateGroup in dateGroups" :date="dateGroup" :allEvents="events" @event_edit="eventEditHandle" @event_delete="eventDeleteHandle"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </main>
</template>

<script>
  import DateGroup from './DateGroup'
  import './../assets/css/PageContent.scss'
  export default {
    name: 'PageContent',
    data: function () {
      return {
        testData: 'Test data from PageContent component'
      }
    },
    props: {
      events: {}
    },
    computed: {
      dateGroups: function () {
        var dates = []
        for (var i = 0; i < this.events.length; i++) {
          if (!dates.includes(this.events[i].Date)) {
            dates.push(this.events[i].Date)
          }
        }
        return dates
      }
    },
    components: {
      DateGroup
    },
    methods: {
      eventDeleteHandle: function (event) {
        console.log('Event came from DateGroup: \n', event)
        this.$emit('event_delete', event)
      },
      eventEditHandle: function (event) {
        console.log('Event came from DateGroup: \n', event)
        this.$emit('event_edit', event)
      }
    }
  }
</script>
