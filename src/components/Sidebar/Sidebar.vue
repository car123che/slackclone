<template>
  <div>
    <h2 class="text-light text-center">SLACKCLONE</h2>
    <hr style="border: 1px solid #333" />
    <span>
      <img
        class="rounded-circle mt-2 mx-2"
        height="40px"
        :src="currentUser.photoURL"
      />
      <span class="text-light nombre"> {{ currentUser.displayName }}</span>
    </span>

    <hr style="border: 1px solid #000" />
    <button @click="logOut" class="btn btn-outline-danger">Logout</button>
    <hr style="border: 1px solid #000" />
    <channels></channels>
    <hr style="border: 1px solid #000" />
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


<style scoped>
  img{
    box-shadow: rgb(212, 203, 203) 0px 0px 7px;
    /* margin-top: -50px; */
  }

  h2{
    font-family: 'Ubuntu', sans-serif;
    letter-spacing: 1px;
    text-align: center;
  }

  .nombre{
    font-size: 1em;
  }
  
  button{
    letter-spacing: 2px;
    font-weight: 600;
    /* font-size: 5em; */
    font-family: 'Josefin Sans', sans-serif;
  }
</style>>
