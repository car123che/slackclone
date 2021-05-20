<template>
  <div class="text-light">
    <h4>Users</h4>

    <!-- channels list -->
    <div class="mt-4">
      <button
        class="list-group-item list-group-item-action"
        v-for="user in users"
        :key="user.id"
        :class="{ active: isActive(user) }"
        @click.prevent="changeChannel(user)"
      >
        <span
          :class="{
            'fa fa-circle online': isOnline(user),
            'fa fa-circle offline': !isOnline(user),
          }"
        >
        </span>

        <span>
          <img :src="user.avatar" height="20" class="img rounded-circle" />
          <span
            ><a
              href="#"
              :class="{
                'text-light': isActive(user),
              }"
              >{{ user.name }}</a
            >
            <span v-if="getNotification(user) >= 1 ">{{getNotification(user)}} </span>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<!-----------------------------SCRIPT----------------------->
<script>
//imports
import database from "firebase/database";
import { mapGetters } from "vuex";
import mixin from "../../mixins";

export default {
  name: "Users",
  data() {
    return {
      users: [],
      usersRef: firebase.database().ref("users"),
      connectedRef: firebase.database().ref(".info/connected"),
      presenceRef: firebase.database().ref("presence"),
      pirvateMessagesRef: firebase.database().ref("privateMessages"),
      notifCount: [],
      channel: null,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "currentChannel", "isPrivate"]),
  },
  mixins: [mixin],
  methods: {
    addListeners() {
      this.usersRef.on("child_added", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          //builds
          const USER = snapshot.val();
          USER["uid"] = snapshot.key;
          USER["status"] = "offline";
          this.users.push(USER);
        }
      });
      //presenceRef child_added
      this.presenceRef.on("child_added", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          //pass to user status method
          this.addStatusToUser(snapshot.key);

          let channelID = this.getChannelId(snapshot.key);
          this.pirvateMessagesRef.child(channelID).on("value", (snapshot) => {
            this.handleNotificatiosn(
              channelID,
              this.currentChannel.id,
              this.notifCount,
              snapshot
            );
          });
        }
      });

      //presenceRef child removed
      this.presenceRef.on("child_removed", (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          //pass to user status method
          this.addStatusToUser(snapshot.key, false);
          this.pirvateMessagesRef.child(this.getChannelId(snapshot.key)).off();
        }
      });

      //returns onnected to every user connected to our application
      this.connectedRef.on("value", (snapshot) => {
        if (snapshot.val() === true) {
          let ref = this.presenceRef.child(this.currentUser.uid);
          ref.set(true);
          ref.onDisconnect().remove();
        }
      });
    },
    detachListeners() {
      this.usersRef.off();
      this.presenceRef.off();
      this.connectedRef.off();
      
      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })

    },
    resetNotifications(user=null){
      let channelId = null
      if(user !== null){
        channelId = this.getChannelId(user.uid);
      }else{
        channelId = this.changeChannel.id
      }
      let index = this.notifCount.findIndex(el =>  el.id === channelId);
      if(index !== -1){
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal;
        this.notifCount[index].notif = 0;
      }

    },
    getNotification(user){
      let channelId = this.getChannelId(user.uid);
      let notif = 0;
      this.notifCount.forEach(el =>{
        if(el.id === channelId){
          notif = el.total;
        }
      });
      return notif;
    },
    addStatusToUser(userId, connected = true) {
      const INDEX = this.users.findIndex((user) => user.uid === userId);
      if (INDEX !== -1) {
        connected === true
          ? (this.users[INDEX].status = "online")
          : (this.users[INDEX].status = "offline");
      }
    },
    isOnline(user) {
      return user.status == "online";
    },
    changeChannel(user) {
      if(this.channel == null){
        this.resetNotifications(user);
      }else{
        this.resetNotifications();
      }
      //we need channel id
      let channelId = this.getChannelId(user.uid);
      //create channel object with id and name
      let channel = { id: channelId, name: user.name };

      this.channel = channel;
      this.$store.dispatch("setPrivate", true);
      this.$store.dispatch("setCurrentChannel", channel);
    },
    getChannelId(userId) {
      return userId < this.currentUser.uid
        ? userId + "/" + this.currentUser.uid
        : this.currentUser.uid + "/" + userId;
    },
    isActive(user) {
      let channelId = this.getChannelId(user.uid);
      return this.currentChannel.id == channelId;
    },
  },
  mounted() {
    this.addListeners();
  },
  beforeDestroy() {
    this.detachListeners();
  },
  watch:{
    isPrivate(){
      if(!this.isPrivate){
        this.resetNotifications();
      }
    }
  }
};
</script>    

<style scoped>
.online {
  color: green;
}

.offline {
  color: red;
}
</style>