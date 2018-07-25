import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './../firebase'

Vue.use(Vuex)

export default new Vuex.Store(
  {
    state:
    {
      events: [],
      isAddEventDialogVisible: false,
      currentEditingEvent: {}
    },
    mutations:
    {
      ADD_EVENTS (state, events) {
        state.events = events
      },
      ADD_SINGLE_EVENT_MANUALLY (state, event) {
        state.events.push(event)
      },
      TOGGLE_IS_ADD_DIALOG_VISIBLE (state) {
        state.isAddEventDialogVisible = !state.isAddEventDialogVisible
      },
      SET_IS_ADD_DIALOG_VISIBLE (state, newValue) {
        state.isAddEventDialogVisible = newValue
      },
      REMOVE_EVENT (state, event) {
        var index = state.events.indexOf(event)
        state.events.splice(index, 1)
      },
      SET_CURRENT_EDITING_EVENT (state, event) {
        state.currentEditingEvent = event
      },
      CLEAR_CURRENT_EDITING_EVENT (state) {
        state.currentEditingEvent = {}
      }
    },
    actions:
    {
      fetchEventsFromServer (context) {
        firebase.database().ref('Events').once('value').then(snapshot => context.commit('ADD_EVENTS', snapshot.val())).catch(err => console.log(err))
      },
      pushEventsToServer (context) {
        alert('pushEventsToServer dispatched')
        firebase.database().ref('Events').set(this.state.events).then(() => console.log('События успешно загружены на сервер в БД')).catch(() => console.log('ОШИБКА при загрузке данных на сервер в БД'))
      },
      addSingleEventManually (context, event) {
        context.commit('ADD_SINGLE_EVENT_MANUALLY', event)
      },
      toggleIsAddEventDialogVisible (context) {
        // alert('toggleIsAddEventDialogVisible')
        context.commit('TOGGLE_IS_ADD_DIALOG_VISIBLE')
      },
      setIsAddDialogVisible (context, newValue) {
        context.commit('SET_IS_ADD_DIALOG_VISIBLE', newValue)
      },
      removeEvent (context, event) {
        context.commit('REMOVE_EVENT', event)
      },
      setCurrentEditingEvent (context, event) {
        // alert('setCurrentEditingEvent')
        context.commit('SET_CURRENT_EDITING_EVENT', event)
      },
      clearCurrentEditingElement (context) {
        context.commit('CLEAR_CURRENT_EDITING_EVENT')
      }
    },
    getters:
    {
      events (state) {
        return state.events
      },
      isAddEventDialogVisible (state) {
        return state.isAddEventDialogVisible
      },
      currentEditingEvent (state) {
        return state.currentEditingEvent
      }
    }
  })
