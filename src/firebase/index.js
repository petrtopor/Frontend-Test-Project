import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyD-yqI5Ax-s0yKT2iRSEvEojOtpMT3uOgQ',
  authDomain: 'frontend-test-vagiz.firebaseapp.com',
  databaseURL: 'https://frontend-test-vagiz.firebaseio.com',
  projectId: 'frontend-test-vagiz',
  storageBucket: 'frontend-test-vagiz.appspot.com',
  messagingSenderId: '418452311666'
}

firebase.initializeApp(config)

var firebaseRef = firebase.database().ref()
export default firebase
export var eventRef = firebaseRef.child('Event')
