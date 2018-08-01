<template>
  <v-dialog id="auth-dialog" persistent max-width="500px" v-model="showAuthDialog" style="z-index: 999999; position: absolute;">
    <v-container style="background-color: white;">
      <v-layout>
        <v-flex>
          <v-text-field label="Email" required="true" v-model="email"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-text-field label="Password" required="true" v-model="password"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-btn flat @click="buttonPressed">{{actionButtonCaption}}</v-btn>
          <v-btn flat @click="switchPressed">{{switchButtonCaption}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-dialog>
</template>
<script>
  import firebase from './../firebase'
  import store from './../store'
  export default {
    name: 'AuthDialog',
    store,
    data: function () {
      return {
        email: '',
        password: '',
        showAuthDialog: true,
        actionToDo: false // true - register; false - login
      }
    },
    computed: {
      actionButtonCaption: function () {
        return this.actionToDo ? 'Зарегистрироваться' : 'Войти'
      },
      switchButtonCaption: function () {
        return this.actionToDo ? 'Перейти к авторизации' : 'Перейти к регистрации'
      }
    },
    methods: {
      switchPressed: function () {
        this.actionToDo = !this.actionToDo
      },
      hideDialog: function () {
        this.showAuthDialog = false
      },
      login: function () {
        console.log('login function is gonna be executed')
        var email = this.email
        var password = this.password
        var hideDialog = this.hideDialog
        var th = this
        firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
          console.log('Successfully signed in as a user:\n', user)
          th.$emit('userLogined', user)
          hideDialog()
        }).catch(error => console.log(error))
      },
      register: function () {
        console.log('register function is gonna be executed')
        var email = this.email
        var password = this.password
        var hideDialog = this.hideDialog
        var th = this
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
          console.log('New user account has been created:\n', user)
          // th.$emit('user', user)
          th.$emit('userLogined', user)
          hideDialog()
        }).catch(error => console.log(error))
      },
      buttonPressed: function () {
        console.log('buttonPressed() function invoked')
        console.log('this.email === ', this.email)
        if (this.email !== this.$store.getters.superUser) {
          console.log('this.email is NOT equal to this.$store.getters.superUser')
          console.log('buttonPressed and this.actionToDo === ', this.actionToDo)
          this.actionToDo ? this.register() : this.login()
        } else {
          this.login = null
          this.register = null
          console.log('this.email is equal to this.$store.getters.superUser')
          // this.$store.dispatch('fakeData')
          this.$store.dispatch('fetchEventsFromServer')
          this.$emit('rootLogined')
          this.hideDialog()
        }
      }
    }
  }
</script>