import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './../firebase'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store(
  {
    state:
    {
      events: [],
      isAddEventDialogVisible: false,
      currentEditingEvent: {},
      currentUser: {},
      superUser: 'root@root.root',
      fakeData: [
        {
          'Caption': 'Мы очень круто отдохнули с Марусей!',
          'Content': 'Моя мама очень трудолюбивая и успешная женщина. Однажды она призналась мне, что считает лень — болезнью. Поэтому, когда человек ленится, его надо оставить в пок... \tзаварить чай с малиной. Сейчас она болеет ленью. Это так мило!',
          'Location': 'Румыния, Район берегов Лос-Сантес',
          'Time': '19:30',
          'Date': '19 июня',
          'MapCoordinates': {
            'Latitude': 54.25,
            'Longitude': 48.29
          },
          'email': 'root@root.root'
        },
        {
          'Caption': 'Мы очень круто отдохнули с Марусей!',
          'Content': 'Моя мама очень трудолюбивая и успешная женщина. Однажды она призналась мне, что считает лень — болезнью. Поэтому, когда человек ленится, его надо оставить в пок... \tзаварить чай с малиной. Сейчас она болеет ленью. Это так мило!',
          'Location': 'Румыния, Район берегов Лос-Сантес',
          'Time': '19:30',
          'Date': '19 июня',
          'MapCoordinates': {
            'Latitude': 54.25,
            'Longitude': 48.29
          },
          'email': 'root@root.root'
        },
        {
          'Caption': 'Мы очень круто отдохнули с Марусей!',
          'Content': 'Моя мама очень трудолюбивая и успешная женщина. Однажды она призналась мне, что считает лень — болезнью. Поэтому, когда человек ленится, его надо оставить в пок... \tзаварить чай с малиной. Сейчас она болеет ленью. Это так мило!',
          'Location': 'Румыния, Район берегов Лос-Сантес',
          'Time': '19:30',
          'Date': '19 июня',
          'MapCoordinates': {
            'Latitude': 54.25,
            'Longitude': 48.29
          },
          'email': 'root@root.root'
        },
        {
          'Caption': 'Мы очень круто отдохнули с Марусей!',
          'Content': 'Моя мама очень трудолюбивая и успешная женщина. Однажды она призналась мне, что считает лень — болезнью. Поэтому, когда человек ленится, его надо оставить в пок... \tзаварить чай с малиной. Сейчас она болеет ленью. Это так мило!',
          'Location': 'Румыния, Район берегов Лос-Сантес',
          'Time': '19:30',
          'Date': '19 июня',
          'MapCoordinates': {
            'Latitude': 54.25,
            'Longitude': 48.29
          },
          'email': 'root@root.root'
        }
      ]
    },
    mutations:
    {
      // Actualize fake data
      FAKE_DATA (state) {
        // state.currentUser = state.superUser
        state.currentUser = {
          user: {
            user: {
              email: 'root@root.root'
            }
          }
        }
        state.events = state.fakeData
        console.log(state.fakeData)
      },
      SET_CURRENT_USER (state, user) {
        state.currentUser = user
      },
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
      fakeData (context) {
        // just execute the fake data mutation
        console.log('fakeData action dispatched')
        context.commit('FAKE_DATA')
      },
      setCurrentUser (context, user) {
        context.commit('SET_CURRENT_USER', user)
      },
      fetchEventsFromServerByEmail (context, email) {
        // firebase.database().ref('Events').orderByChild('email').equalTo(email).once('value').then(snapshot => context.commit('ADD_EVENTS', snapshot.val())).catch(err => console.log(err))
        firebase.database().ref('Events').orderByChild('email').equalTo(email).once('value').then(snapshot => snapshot.forEach((snapshotItem) => {
          // console.log('snapshotItem.val(): ', snapshotItem.val())
          context.commit('ADD_SINGLE_EVENT_MANUALLY', snapshotItem.val())
        })).catch(err => console.log(err))
      },
      fetchEventsFromServer (context) {
        console.log('fetchEventsFromServer dispatched')
        firebase.database().ref('Events').once('value').then(snapshot => context.commit('ADD_EVENTS', snapshot.val())).catch(err => {
          console.log('error happened: ', err)
          context.commit('FAKE_DATA')
        })
      },
      pushEventsToServer (context) {
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
      superUser (state) {
        return state.superUser
      },
      currentUserEmail (state) {
        // return state.currentUser.user.email
        // return 'ololo'
        if (_.isEmpty(state.currentUser)) {
          return ''
        } else {
          return state.currentUser.user.email
        }
      },
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
