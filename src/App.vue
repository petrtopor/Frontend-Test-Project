<template>
  <v-app>
    <auth-dialog @userLogined="onUser" @rootLogined="onRootLogined"/>

    <event-add-dialog @event_add="eventAddHandle"/>

    <page-header @event_create="createNewEvent"/>

    <page-content v-if="contentVisible" :events="events" @event_edit="eventEditHandle" @event_delete="eventDeleteHandle"/>
    
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
import AuthDialog from './components/AuthDialog'
export default {
  name: 'App',
  store,
  components: {
    PageHeader,
    PageContent,
    EventAddDialog,
    AuthDialog
  },
  data () {
    return {
      eventToEdit: {},
      fixed: false,
      contentVisible: false
    }
  },
  beforeCreate () {
    // this.$nextTick(() => this.$store.dispatch('fetchEventsFromServer'))
  },
  computed:
  {
    events () {
      return this.$store.getters.events
    }
  },
  methods: {
    onRootLogined: function () {
      this.contentVisible = true
    },
    onUser: function (user) {
      // console.log('USER CAME FROM auth-dialog: ', user)
      console.log('USER CAME FROM auth-dialog: ', user.user.email)
      this.$store.dispatch('setCurrentUser', user)
      this.$store.dispatch('fetchEventsFromServerByEmail', user.user.email)
      this.contentVisible = true
    },
    createNewEvent: function () {
      var emptyEvent = {
        'Caption': '',
        'Content': '',
        'Location': '',
        'Time': '',
        'Date': '',
        'MapCoordinates': {
          'Latitude': '',
          'Longitude': ''
        },
        'email': ''
      }
      this.eventToEdit = Object.assign({}, emptyEvent)
      this.$store.dispatch('setCurrentEditingEvent', this.eventToEdit)
      this.$forceUpdate()
      this.$store.dispatch('setIsAddDialogVisible', true)
    },
    eventDeleteHandle: function (event) {
      this.$nextTick(function () {
        this.$store.dispatch('removeEvent', event)
        this.$forceUpdate()
      })
    },
    eventEditHandle: function (event) {
      console.log('Event came from PageContent or PageHeader: \n', event)
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