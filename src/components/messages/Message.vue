<template>
  <div>
    <div class="mt-3 mb-5 a">
      <div v-for="message in messages" :key="message.id">
        <div
          class="media"
          :class="{
            self_message: selfMessage(message.user),
            mediaFile: isFile(message),
          }"
        >
        <div>
            <img
            :src="message.user.avatar"
            height="50px"
            alt=""
            class="align-self-start mr-3"
          />
        </div>
          
          <div class="media-body">
            <div class="arriba">
                <h6 class="mt-2">
                  <a href="#">{{ message.user.name }}</a
                  ><small>
                    -
                    {{ message.timestamp | fromNow }}
                  </small>
                </h6>
            </div>
            <p v-if="!isFile(message)" class="mensaje">{{ message.content }}</p>
            <img :src="message.image" alt="image" class="img mensaje" v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-------------------------------------SCRIPT---------------------->
<script>
//imports
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Message",
  props: ["messages"],
  computed: {
    ...mapGetters(["currentUser"]),
  },
  filters: {
    fromNow(value) {
      return moment(value).fromNow();
    },
  },
  methods: {
    selfMessage(user) {
      return user.id == this.currentUser.uid;
    },
    isFile(message) {
      return message.content == null && message.image != null;
    },
  },
};
</script>

<style scoped>
.media {
  display: flex;
  flex-direction: row;
  margin-left: 5vw;
  background-color: rgba(110, 105, 105, 0.75);
  /* rgb(145, 142, 142); */
  opacity: 0.9;
  height: 4em;
  margin-bottom: 1em;
  border-radius: 1em;
}

.self_message {
  background-color: rgba(7, 100, 102, 0.75);
}
.mediaFile {
  height: 15em;
}

img {
  margin-left: 0.6em;
  margin-top: 0.4em;
  margin-right: 0.5em;
  border-radius: 1em;
}

a {
  color: black;
  font-weight: bold;
  text-decoration: none;
}

small {
  color: rgb(46, 43, 43);
  margin-left: 0.4em;
}

.mensaje {
  color: rgb(8, 8, 8);
  font-weight: 500;
  font-family: "KoHo", sans-serif;
  font-size: 1.3em;
  margin-top: -7px;
  text-align: initial;
  margin-left: 10px;
}

.img {
  /* margin: auto; */
  display: flex;
  height: 75%;
  margin-top: 0.4em;
  align-content: initial;
}

.arriba{
    display: flex;
    flex-direction: row;
    align-content: center;
}
</style>