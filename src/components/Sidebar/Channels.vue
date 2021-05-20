<template>
  <div>
    <button @click="openModal" class="btn btn-outline-primary">
      Add Channel
    </button>

    <!-- channels list -->
    <div class="mt-4">
      <button
        class="list-group-item list-group-item-action"
        v-for="channel in channels"
        :key="channel.id"
        :class="{ active: setActiveChannel(channel) }"
        @click="changeChannel(channel)"
      >
        {{ channel.name }}
        <span
          class="float-right"
          v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id"
        >
          {{ getNotification(channel) }}
        </span>
      </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="channelModal">
      <div class="modal-dialog modal-dialog-center" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">Add Channel</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <!-- <span aria-hidden="true">&times;</span> -->
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <input
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  class="form-control"
                  placeholder="Channel name"
                  v-model="new_channel"
                />
              </div>
              <ul class="list-group" v-if="errorB">
                <li
                  class="list-group-item text-danger"
                  v-for="error in errors"
                  :key="error.id"
                >
                  {{ error }}
                </li>
              </ul>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button @click="addChannel" type="button" class="btn btn-primary">
              Add Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--------------------------------SCRIPTS---------------------------->
<script>
//imports
import database from "firebase/database";
import { mapGetters } from "vuex";
import mixins from '../../mixins';

export default {
  name: "channels",
  mixins: [mixins],
  data() {
    return {
      new_channel: "",
      errors: [],
      channelsRef: firebase.database().ref("channels"),
      messagesRef: firebase.database().ref("messages"),
      notifCount: [],
      errorB: false,
      channels: [],
      channel: null,
    };
  },
  methods: {
    openModal() {
      $("#channelModal").appendTo("body").modal("show");
    },
    //add channel
    addChannel() {
      this.errors = [];
      //get key to the new channel
      let key = this.channelsRef.push().key;
      // console.log(key);
      const NEW_CHANNEL = {
        id: key,
        name: this.new_channel,
      };
      this.channelsRef
        .child(key)
        .update(NEW_CHANNEL)
        .then(() => {
          this.new_channel = "";
          $("#channelModal").modal("hide");
        })
        .catch((err) => {
          this.errors.push(err.message);
          this.hasErrors();
        });
    },
    hasErrors() {
      if (this.errors.length > 0) {
        this.errorB = true;
        setTimeout(() => {
          this.errorB = false;
        }, 3000);
      } else {
        this.errorB = false;
      }
    },
    addListeners() {
      //
      this.channelsRef.on("child_added", (snapshot) => {
        // console.log(snapshot.val());
        this.channels.push(snapshot.val());

        //set current channel
        if (this.channels.length > 0) {
          //set the first one
          this.channel = this.channels[0];
          //dispatch currect channel to store
          this.$store.dispatch("setCurrentChannel", this.channel);
          this.addCountListener(snapshot.key);
        }
      });
    },
    addCountListener(channelId) {
      this.messagesRef.child(channelId).on("value", (snapshot) => {
        this.handleNotificatiosn(
          channelId,
          this.currentChannel.id,
          this.notifCount,
          snapshot
        );
      });
    },
    setActiveChannel(channel) {
      return channel.id == this.currentChannel.id;
    },
    changeChannel(channel) {
      //reset notifications
      this.resetNotifications();

      this.$store.dispatch("setPrivate", false);
      this.$store.dispatch("setCurrentChannel", channel);

      //set channel
      this.channel = channel;
    },
    resetNotifications(){
      let index = this.notifCount.findIndex(el =>  el.id === this.channel.id);
      if(index !== -1){
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal;
        this.notifCount[index].notif = 0;
      }
    },
    detachListeners() {
      //
      this.channelsRef.off();
      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    },
    getNotification(channel) {
      let notif = 0;

      this.notifCount.forEach((el) => {
        if (el.id === channel.id) {
          // console.log(el);
          notif = el.total;
        }
      });

      return notif;
    },
  },
  mounted() {
    this.addListeners();
  },
  beforeDestroy() {
    this.detachListeners();
  },
  computed: {
    ...mapGetters(["currentChannel", "isPrivate"]),
  },
  watch: {
    isPrivate(){
      if(this.isPrivate){
        this.resetNotifications();
      }
    }
  }
};
</script>

<style scoped>
button{
    letter-spacing: 2px;
    font-weight: 600;
    /* font-size: 5em; */
    font-family: 'Josefin Sans', sans-serif;
  }

  .list-group-item{
    width: 85%;
    margin: auto;
    font-family: 'Roboto Mono', monospace;
    font-weight:100;
    opacity: 0.80;
  }

  .active{
    background-color: rgb(20, 20, 20);
    border: solid 1px rgb(49, 47, 47);
  }

  
</style>