<template>
  <v-app>
    <event-add-dialog @event_add="eventAddHandle"/>

    <page-header/>

    <page-content :events="events" @event_edit="eventEditHandle"/>
    
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018 - Vagiz Magdeev - Test Task to get FrontEnd developer position :-)</span>
    </v-footer>
  </v-app>
</template>

<script>
import store from './store'
import PageHeader from './components/PageHeader'
import PageContent from './components/PageContent'
import EventAddDialog from './components/EventAddDialog'
export default {
  name: 'App',
  store,
  components: {
    PageHeader,
    PageContent,
    EventAddDialog
  },
  data () {
    return {
      eventToEdit: {},
      fixed: false
    }
  },
  beforeCreate () {
    this.$nextTick(() => this.$store.dispatch('fetchEventsFromServer'))
  },
  computed:
  {
    events () {
      return this.$store.getters.events
    }
  },
  methods: {
    eventEditHandle: function (event) {
      console.log('Event came from PageContent: \n', event)
      this.$nextTick(function () {
        this.eventToEdit = Object.assign({}, event)
        this.$store.dispatch('setCurrentEditingEvent', this.eventToEdit)
        this.$store.dispatch('removeEvent', event)
        this.$forceUpdate()
        this.$store.dispatch('setIsAddDialogVisible', true)
      })
    },
    eventAddHandle: function (event) {
      console.log('Event came from EventAddDialog: \n', event)
      this.$store.dispatch('addSingleEventManually', event)
      this.$store.dispatch('setIsAddDialogVisible', false)
      this.$nextTick(function () {
        this.$forceUpdate()
      })
    }
  }
}
</script>
