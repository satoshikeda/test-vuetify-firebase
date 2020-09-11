<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
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
          class="fill-height"
          fluid
      >
        <v-row>
          <v-col :style="{display: 'flex'}">
            <div>
              <input
                  type="text"
                  v-model="addData"
                  :style="{ backgroundColor: 'white'}"
                  placeholder="plz enter string"
              />
            </div>
            <div>
              <button
                  @click="clickButton"
                  :style="{
                    marginLeft: '10px',
                    backgroundColor: 'white',
                    color: 'black'
                  }"
              >foo</button>
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
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import * as firebase from 'firebase';

export default {
  props: {
    source: String,
  },

  data: ()=>({
    drawer: null,
    firebaseData: [],
    addData: ''
  }),

  created() {
    this.$vuetify.theme.dark = true;

    firebase.database().ref('test').on('child_added', this.childAdded);
  },

  methods: {
    clickButton() {
      console.log('this.addData: ', this.addData);
      if (!this.addData) {
        return;
      }

      firebase.database().ref('test').push({
        test: 'foo',
        data: this.addData,
      });
    },
    childAdded(snap) {
      console.log('childAdded: ', snap.val());
      console.log('this.firebaseData: ', this.firebaseData);
      this.firebaseData.push(snap.val().data);
    }
  }
};
</script>
