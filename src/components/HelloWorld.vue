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
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Youtube</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="clickLinkSidenav('twitter')">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Twitter</v-list-item-title>
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
            <iframe width="560" height="315" v-bind:src="`https://www.youtube.com/embed/${id}`" frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
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
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>


<script>
import * as firebase from 'firebase';
import { Timeline } from 'vue-tweet-embed';

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
    twitterIds: ['DiveDesk', 'ecotours2015', 'thailand_divers', 'scubadivergear']
  }),

  created() {
    this.$vuetify.theme.dark = true;

    firebase.database().ref('scuba').on('child_added', this.childAddedScuba);
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
    }
  }
};
</script>
