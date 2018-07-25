<template>
  <header>
    <v-toolbar
      app
      flat>
      <v-container>
        <v-layout>
          <v-flex>
            <div id="logo"></div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div id="header-text">
              Друзья, мои походы пока ещё  не закончились, делюсь с вами!
            </div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <button id="button-add-event">Событие +</button>
            <button id="button-refresh" @click="refreshButtonClick">Обновить</button>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
  </header>
</template>

<script>
  import store from './../store'
  import './../assets/css/PageHeader.scss'
  export default {
    name: 'PageHeader',
    store,
    data: function () {
      return {
        testData: 'Test data from PageHeader component'
      }
    },
    methods: {
      refreshButtonClick: function () {
        this.$store.dispatch('pushEventsToServer')
      }
    }
  }
</script>
