<template>
  <div>
    <div class="message-form">
      <!-- Progressbar-->
      <div class="progress" v-if="uploadState !== null && uploadState != 'done'">
        <div
          class="progress-bar progress-bar-stripped progress-bar-animated"
          role="progressbar"
          
        >
          {{ uploadLabel }}
        </div>
      </div>

      <form @submit.prevent="sendMessage">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control mt-3"
            name="message"
            id="message"
            v-model.trim="message"
          />

          <div class="input-group-append">
            <button
              @click="sendMessage"
              class="btn btn-primary mt-3"
              type="button"
            >
              Send
            </button>
          </div>
          <div class="input-group-append">
            <button
              @click.prevent="openFileModal"
              class="btn btn-warning mt-3"
              :disabled="uploadState == 'uploading'"
              type="button"
            >
              Upload
            </button>
          </div>
        </div>
      </form>
      <file-modal ref="file_modal"></file-modal>
    </div>
  </div>
</template>

<!-------------------------------------SCRIPT---------------------->
<script>
//imports
import { mapGetters } from "vuex";
import FileModal from "./FileModal";
import uuidV4 from "uuid/v4";
import storage from "firebase/storage";

export default {
  name: "Form",
  data() {
    return {
      message: "",
      errors: [],
      storageRef: firebase.storage().ref(),
      uploadTask: null,
      uploadState: null,
    };
  },
  components: { FileModal },
  methods: {
    sendMessage() {
      //construct a new message
      /* const NEW_MESSAGE = {
        content: this.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid,
        },
      }; */
      if (this.currentChannel != null) {
        if (this.message.length > 0) {
          this.$parent
            .getMessagesRef()
            .child(this.currentChannel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
              this.$nextTick(() => {
                $("html, body").scrollTop($(document).height());
              });
            })
            .catch((err) => {
              this.errors.push(err.message);
            });
          this.message = "";
        }
      }
    },
    createMessage(fileurl = null) {
      let NEW_MESSAGE = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid,
        },
      };

      if(fileurl == null){
        NEW_MESSAGE['content'] = this.message;
      }else{
        NEW_MESSAGE['image'] = fileurl
      }

      return NEW_MESSAGE;
    },
    uploadFile(file, metada) {
      if (file === null) return false;
      let path = this.currentChannel.id;
      let ref = this.$parent.getMessagesRef();
      let filePath = this.getPath() + "/" + uuidV4() + ".jpg";

      this.uploadTask = this.storageRef.child(filePath).put(file, metada);
      this.uploadState = "uploading";

      //on upload state chagne
      this.uploadTask.on(
        "state_changed",
        (snapshot) => {
          //upload in progress
          let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          $(".progress-bar").css("width", percent + "%");
        },
        (err) => {
          //error
          this.erros.push(err.message);
          this.uploadState = "error";
          this.uploadTask = null;
          this.$refs.file_modal.resetForm();
        },
        () => {
          //upload finished
          this.uploadState = "done";
          this.$refs.file_modal.resetForm();
          //recover the url of file
          let fileUrl = this.uploadTask.snapshot.ref.getDownloadURL().then( fileUrl =>{
            this.sendFileMessage(fileUrl, ref , path);
          })
        }
      );
    },
    //folder directory to store files in firebase storage
    getPath() {
      if (this.isPrivate) {
        return "chat/private/" + this.currentChannel.id;
      } else {
        return "chat/public";
      }
    },
    openFileModal() {
      $("#fileModal").appendTo("body").modal("show");
      // console.log("open");
    },
    sendFileMessage(fileUrl, ref, path){
      ref.child(path).push().set(this.createMessage(fileUrl)).then(() => {
        this.$nextTick( () =>{
          $("html", "body").scrollTop($(document).height())
        })
      }).catch( err => {
        this.errors.push(err);
      });
    }
  },
  computed: {
    ...mapGetters(["currentChannel", "currentUser", "isPrivate"]),
    //upload state
    uploadLabel() {
      switch (this.uploadState) {
        case "uploading":
          return "Uploading in progress";
          break;
        case "error":
          return "Error occured";
          break;
        case "done":
          return "Upload completed";
          break;
        default:
          return "";
      }
    },
  },
  beforeDestroy() {
    if(this.uploadTask !== null){
      this.uploadTask.cancel();
      this.uploadTask = null;
    }
  },
};
</script>

<!----------------------------------STYLES------------------------->
<style scoped>
.message-form {
  position: fixed;
  left: 38vw;
  bottom: 0;
  margin-bottom: -0.95em;
  width: 62vw;
  z-index: 2;
  
}

input,
button {
  height: 40px;
}

.progress {
  margin-bottom: -16px;
}
</style>