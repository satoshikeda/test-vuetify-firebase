<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
    >
      <v-list dense>
        <v-list-item link @click="clickLinkSidenav('top')">
          <v-list-item-action>
            <v-icon>mdi-youtube</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Youtube</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="clickLinkSidenav('twitter')">
          <v-list-item-action>
            <v-icon>mdi-twitter</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Twitter</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="clickLinkSidenav('facebook')">
          <v-list-item-action>
            <v-icon>mdi-facebook</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Facebook</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="clickLinkSidenav('chat')">
          <v-list-item-action>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Chat</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>TEST Vuetify + Firebase Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
          v-if="page === 'top'"
          class="fill-height"
          fluid
      >
        <v-row>
          <v-col v-for="id in youtubeVideoIds" :key="id">
            <iframe
                width="560"
                height="315"
                v-bind:src="`https://www.youtube.com/embed/${id}`"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
          </v-col>
        </v-row>
        <v-row>
          <v-col :style="{display: 'flex'}">
            <div>
              <input
                  type="text"
                  v-model="newYoutubeVideoId"
                  :style="{
                    backgroundColor: 'white',
                    width: '300px'
                  }"
                  placeholder="plz enter youtube video id"
                  v-on:keyup.enter="clickAddYoutubeVideoIdButton('scuba')"
              />
            </div>
            <div>
              <button
                  @click="clickAddYoutubeVideoIdButton('scuba')"
                  :style="{
                    marginLeft: '10px',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '0 2px',
                    width: '100px'
                  }"
              >Add
              </button>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <ul>
            <li
                v-for="item in firebaseData"
                :key="item"
            >{{ item }}
            </li>
          </ul>
        </v-row>
      </v-container>
      <v-container v-if="page === 'twitter'">
        <v-row>
          <v-col v-for="id in twitterIds" :key="id">
            <Timeline
                :id="id"
                :source-type="'profile'"
                :options="{
                  theme: 'dark',
                  tweetLimit: '3'
                }"
            ></Timeline>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="page === 'facebook'">
        <v-row>
          <v-col>後回し</v-col>
          <v-col>
            <div class="fb-page"
                 data-href="https://www.facebook.com/mareaokinawa"
                 data-tabs="timeline"
                 data-width=""
                 data-height=""
                 data-small-header="false"
                 data-adapt-container-width="true"
                 data-hide-cover="false"
                 data-show-facepile="true">
              <blockquote
                  cite="https://www.facebook.com/mareaokinawa"
                  class="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/mareaokinawa">マレア沖縄</a></blockquote>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="page === 'chat'">
        <v-row>
          <v-col>
            <input
                type="text"
                v-model="newChatMessage"
                v-on:keyup.enter="enterNewChatMessage"
                :style="{
                  backgroundColor: 'white',
                  width: '300px'
                }"
                placeholder="plz input message and press enter"
            />
          </v-col>
        </v-row>
        <v-row>
          <ul>
            <li v-for="data in sortedChatMessages" :key="data.message">{{data.date}} {{ data.message }}</li>
          </ul>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>


<script>
import * as firebase from 'firebase';
import { Timeline } from 'vue-tweet-embed';
import dayjs from 'dayjs';

export default {
  props: {
    source: String,
  },
  components: {
    Timeline,
  },

  data: ()=>({
    drawer: null,
    firebaseData: [],
    newYoutubeVideoId: '',
    page: 'top',
    youtubeVideoIds: [],
    twitterIds: [
      'DiveDesk',
      'ecotours2015',
      'thailand_divers',
      'scubadivergear',
      'GomantakScuba',
    ],
    chatMessages: [],
    newChatMessage: '',
  }),

  created() {
    this.$vuetify.theme.dark = true;

    firebase.database().ref('scuba').on('child_added', this.childAddedScuba);
    firebase.database().ref('chat').on('child_added', this.childAddedChat);
  },

  mounted() {
    // if (!document.getElementById('facebook-jssdk')) {
    //   (function (d, s, id) {
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) return;
    //     js = d.createElement(s);
    //     js.id = id;
    //     js.src = 'https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v3.2';
    //     fjs.parentNode.insertBefore(js, fjs);
    //   }(document, 'script', 'facebook-jssdk'));
    // }
    let recaptchaScript = document.createElement('script');
    recaptchaScript.setAttribute('src', 'https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v8.0&appId=588395481367238&autoLogAppEvents=1');
    recaptchaScript.setAttribute('crossorigin', 'anonymous');
    recaptchaScript.setAttribute('nonce', 'C5dOuTce');

    document.head.appendChild(recaptchaScript);
  },

  methods: {
    clickAddYoutubeVideoIdButton(label) {
      if (!this.newYoutubeVideoId) {
        return;
      }

      firebase.database().ref(label).push({
        videoId: this.newYoutubeVideoId,
      });

      this.newYoutubeVideoId = '';
    },
    childAddedScuba(snap) {
      this.youtubeVideoIds.push(snap.val().videoId);
    },
    clickLinkSidenav(page) {
      this.page = page;
    },
    enterNewChatMessage() {
      if (this.newChatMessage === '') {
        return;
      }
      dayjs.locale('ja')
      firebase.database().ref('chat').push({
        date: dayjs().format('YYYY/MM/DD HH:mm:ss'),
        message: this.newChatMessage
      });

      this.newChatMessage = '';
    },
    childAddedChat(snap) {
      this.chatMessages.push(snap.val());
    }
  },
  computed: {
    sortedChatMessages: function () {
      return [].concat(this.chatMessages).sort((a,b)=>{
        return dayjs(b.date) - dayjs(a.date)
      })
    }
  }
};
</script>
