<template>
  <div>
    <h2 class="text-light">#slacdddk"</h2>
    <hr style="border: 1px solid #333" />
    <span>
      <img
        class="rounded-circle mt-2"
        height="30px"
        :src="currentUser.photoURL"
      />
      <span class="text-light"> {{ currentUser.displayName }}</span>
    </span>

    <hr style="border: 1px solid #333" />
    <button @click="logOut" class="btn btn-outline-light">Logout</button>
    <hr style="border: 1px solid #333" />
    <channels></channels>
    <hr style="border: 1px solid #333" />
    <Users></Users>
  </div>
</template>

<!--------------------------------SCRIPTS----------------------------->
<script>
//imports
import auth from "firebase/auth";
import { mapGetters } from "vuex";
import Channels from "./Channels";
import Users from "./Users";
import database from 'firebase/database';

export default {
  name: "Sidebar",
  methods: {
    logOut() {
      this.presenceRef.child(this.currentUser.uid).remove();
      firebase.auth().signOut();
      this.$store.dispatch("setUser", null);
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  components: { Channels, Users },
  data() {
    return {
      presenceRef: firebase.database().ref('presence')
    }
  },
};
</script>
