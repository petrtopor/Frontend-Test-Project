<template>
  <!--<div class="text-xs-center" style="position: absolute; z-index: initial;">-->
    <v-dialog id="add-event-dialog" persistent max-width="500px" v-model="showEventAddDialog" style="z-index: 999999; position: absolute;">
      <v-container grid-list-md style="background-color: white;">
        <v-layout wrap>
          <v-flex xl12 lg12 md12>
            <v-text-field label="Событие" required="true" v-model="caption" maxlength="40"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap align-baseline>
          <v-flex xl7 lg7 md7>
            <v-text-field id="place" label="Место" required="true" v-model="location"></v-text-field>
          </v-flex>
          <v-flex xl1 lg1 md1>
            <v-icon style="color: #a9d85f;" @click="showMap">fas fa-globe</v-icon>
          </v-flex>
          <v-flex lg4 md4>
            <v-text-field
                v-model="dateAndTimeTextFieldContent"
                label="Дата и время"
                readonly
                @click="DatePickDialogClick"
                @focus="DatePickDialogFocus"
                @blur="DatePickDialogUnfocus"
              >
            </v-text-field>

            <v-dialog
              ref="dateDialog"
              v-model="DatePickDialogVisible"
              :return-value.sync="dateModel"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-date-picker v-model="dateModel" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="DatePickDialogVisible = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="DatePickDialogDatePicked(dateModel)">OK</v-btn>
              </v-date-picker>
            </v-dialog>

            <v-dialog
              ref="mapDialog"
              v-model="MapDialogVisible"
              persistent
              full-width
              width="600px"
              >
              <div id="map" style="width: 600px; height: 400px"></div>
              <div class="map-buttons">
                <v-btn @click="mapPlacePicked">Выбрать место</v-btn>
                <v-btn @click="mapAutodetectPositionClick">Определить автоматически</v-btn>
                <v-btn>Отмена</v-btn>
              </div>
            </v-dialog>

            <v-dialog
              ref="TimeDialog"
              v-model="TimePickDialogVisible"
              :return-value.sync="timeModel"
              persistent
              lazy
              full-width
              width="290px"
            >
              
              <v-time-picker
                v-if="TimePickDialogVisible"
                v-model="timeModel"
              >
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="TimePickDialogVisible = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="TimePickDialogTimePicked(timeModel)">OK</v-btn>
              </v-time-picker>
            </v-dialog>

          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xl12 lg12 md12>
            <v-textarea id="description" label="Описание" required="true" v-model="content" maxlength="250"></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xl7 lg7 md7>
            <v-checkbox id="checkbox1"
                       value="accepted"
                       unchecked-value="not_accepted"
                       label="Пометить событие как важное">
            </v-checkbox>
          </v-flex>
          <v-flex xl3 lg3 md3>
            <v-btn id="applyButtonAddEventDialog" @click="applyButtonClickAddEventDialog" style="font-family: GothamProBold; background-color: #a9d85f; color: #ffffff; border-radius: 6px; border-color: #a9d85f; border-style: solid; border-width: 3px; box-shadow: none;">Готово</v-btn>
          </v-flex>
          <v-flex xl3 lg3 md3>
            <v-btn id="cancelButtonAddEventDialog" @click="cancelButtonClickAddEventDialog" style="font-family: GothamProBold; background-color: #a9d85f; color: #ffffff; border-radius: 6px; border-color: #a9d85f; border-style: solid; border-width: 3px; box-shadow: none;">Удалить</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-dialog>
</template>
<script>
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import 'vuetify/dist/vuetify.min.css'
  import store from './../store'
  import './../assets/css/EventAddDialog.scss'
  Vue.use(Vuetify)
  export default {
    name: 'EventAddDialog',
    store,
    watch: {
      caption: function (newCaption, oldCaption) {
        //
      }
    },
    data () {
      return {
        dialog: false,
        DatePickDialogVisible: false,
        DatePickDialogFocused: false,
        TimePickDialogVisible: false,
        MapDialogVisible: false,
        dateModel: null,
        timeModel: null,
        event: {},
        YMapsScript: null,
        map: null,
        mapPlacemark: null
      }
    },
    updated: function () {
      // alert('EventAddDialog is updated')
      this.event = this.currentEditingEvent
    },
    mounted: function () {
      //
    },
    created: function () {
      this.fetchYMapsScript().then((YMapsScript) => {
        this.YMapsScript = YMapsScript
      })
    },
    methods: {
      mapAutodetectPositionClick: function () {
        var YMapsScript = this.YMapsScript
        YMapsScript.geolocation.get({provider: 'browser'}).then((result) => {
          // console.log(result.geoObjects.get(0).getAddressLine())
          this.location = result.geoObjects.get(0).getAddressLine()
          // this.event.MapCoordinates.Latitude = result.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.InternalToponymInfo.Point.coordinates[0]
          // this.event.MapCoordinates.Longitude = result.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.InternalToponymInfo.Point.coordinates[1]
          this.mapPlacemark.geometry.setCoordinates(result.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.InternalToponymInfo.Point.coordinates)
          // console.log(result.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.InternalToponymInfo.Point.coordinates)
        })
      },
      addressLine: function () {
        var YMapsScript = this.YMapsScript
        var mapPlacemark = this.mapPlacemark
        return new Promise(function (resolve, reject) {
          YMapsScript.geocode(mapPlacemark.geometry.getCoordinates()).then(function (res) {
            resolve(res.geoObjects.get(0).getAddressLine())
          })
        })
      },
      mapPlacePicked: function () {
        this.event.MapCoordinates.Latitude = this.mapPlacemark.geometry.getCoordinates()[0]
        this.event.MapCoordinates.Longitude = this.mapPlacemark.geometry.getCoordinates()[1]
        this.addressLine().then((addrLine) => {
          this.location = addrLine
          this.MapDialogVisible = false
        })
      },
      mapClickEventHandler: function (event) {
        var coordinates = event.get('coords')
        this.mapPlacemark.geometry.setCoordinates(coordinates)
      },
      showMap: function () {
        var center = [0, 0]
        if (this.event.MapCoordinates !== null && this.event.MapCoordinates !== 'undefined') {
          center[0] = this.event.MapCoordinates.Latitude
          center[1] = this.event.MapCoordinates.Longitude
        } else {
          center[0] = 55.76
          center[1] = 37.64
        }
        if (this.map === 'undefined' || this.map === null) {
          this.map = new this.YMapsScript.Map('map', {center: center, zoom: 7}, {balloonMaxWidth: 200})
          this.map.events.add('click', this.mapClickEventHandler)
          this.mapPlacemark = new this.YMapsScript.Placemark([this.event.MapCoordinates.Latitude, this.event.MapCoordinates.Longitude], {hintContent: 'Место события на карте', balloonContent: 'Поменять место можно кликнув в любом месте карты и нажав "Выбрать место"'})
          this.map.geoObjects.add(this.mapPlacemark)
        }
        this.MapDialogVisible = true
        this.event.email = this.$store.getters.currentUserEmail
      },
      fetchYMapsScript: function () {
        return new Promise(function (resolve, reject) {
          const yandexMapScript = document.createElement('SCRIPT')
          const ymapSource = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
          yandexMapScript.setAttribute('src', ymapSource)
          yandexMapScript.setAttribute('defer', '')
          document.body.appendChild(yandexMapScript)
          yandexMapScript.onload = function () {
            window.ymaps.ready(function () {
              if (window.ymaps) {
                resolve(window.ymaps)
                console.log('map is assigned: ', window.ymaps)
              }
            })
            window.ymaps.onerror = function (error) {
              reject(error)
              console.log('Error loading Yandex Map: ', error)
            }
          }
        })
      },
      DatePickDialogFocus: function () {
        this.DatePickDialogFocused = true
        this.DatePickDialogVisible = true
      },
      DatePickDialogUnfocus: function () {
        this.DatePickDialogFocused = false
      },
      DatePickDialogClick: function () {
        if (this.DatePickDialogVisible === true && this.DatePickDialogFocused === true) {
          this.DatePickDialogVisible = false
        }
        if (this.DatePickDialogVisible === false && this.DatePickDialogFocused === true) {
          this.DatePickDialogVisible = true
        }
      },
      applyButtonClickAddEventDialog: function () {
        // this.$emit('event_add', this.event)
        this.$nextTick(function () {
          this.caption = this.caption
          this.content = this.content
          this.location = this.location
          this.date = this.date
          this.time = this.time
          console.log('event emitting from dialog: ', this.event)
          this.$emit('event_add', this.event)
        })
      },
      cancelButtonClickAddEventDialog: function () {
        this.showEventAddDialog = false
      },
      DatePickDialogDatePicked: function (date) {
        console.log('Date picked in dialog: ', this.dateModel)
        this.date = this.dateModel
        this.$refs.dateDialog.save(date)
        this.TimePickDialogVisible = true
      },
      TimePickDialogTimePicked: function (time) {
        console.log('Time picked in dialog: ', this.timeModel)
        this.time = this.timeModel
        this.$refs.TimeDialog.save(this.time)
      }
    },
    computed: {
      dateAndTimeTextFieldContent: function () {
        var date = ''
        var time = ''
        if (this.date !== null && this.date !== undefined) {
          date = this.date.toString()
        }
        if (this.time !== null && this.time !== undefined) {
          time = this.time.toString()
        }
        return date + ' ' + time
      },
      showEventAddDialog: {
        get: function () {
          return this.$store.getters.isAddEventDialogVisible
        },
        set: function (newValue) {
          this.$store.dispatch('setIsAddDialogVisible', newValue)
        }
      },
      currentEditingEvent: function () {
        return this.$store.getters.currentEditingEvent
      },
      caption: {
        get: function () {
          return this.$store.getters.currentEditingEvent.Caption
        },
        set: function (newCaption) {
          this.event.Caption = newCaption
        }
      },
      location: {
        get: function () {
          return this.$store.getters.currentEditingEvent.Location
        },
        set: function (newLocation) {
          this.event.Location = newLocation
        }
      },
      content: {
        get: function () {
          return this.$store.getters.currentEditingEvent.Content
        },
        set: function (newContent) {
          this.event.Content = newContent
        }
      },
      date: {
        get: function () {
          return this.$store.getters.currentEditingEvent.Date
        },
        set: function (newDate) {
          this.event.Date = newDate
        }
      },
      time: {
        get: function () {
          return this.$store.getters.currentEditingEvent.Time
        },
        set: function (newTime) {
          this.event.Time = newTime
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import url("https://use.fontawesome.com/releases/v5.1.0/css/all.css");
  #inputs {
    display: flex;
    flex-direction: column;
    .input-row {
      display: flex;
      flex-direction: row;
      align-items: baseline;
    }
  }
  .v-picker {
    position: relative;
    background-color: #a9d85f;
    color: white;
  }
</style>