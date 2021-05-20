<template>
  <div>
    <h2>{{ channelName}} </h2>
    <message :messages="messages"></message>
    <Form></Form>

  </div>
</template>

<!-------------------------------------SCRIPT---------------------->
<script>
//imports
import Message from "./Message";
import Form from "./Form";
import database from "firebase/database";
import { mapGetters } from "vuex";


export default {
  name: "Messages",
  components: {
    Message,
    Form
  },
  data() {
    return {
      messagesRef: firebase.database().ref("messages"),
      messages: [],
      channel: null,
      privateMessagesRef: firebase.database().ref('privateMessages'),
      listeners: []
    };
  },
  computed: {
    ...mapGetters(["currentChannel", "currentUser", "isPrivate"]),
    //channel name
    channelName(){
      if(this.channel != null){
        return this.isPrivate ? '@' + this.channel.name :  ' # ' + this.channel.name;
      }
    }
  },
  watch:{
      currentChannel: function(){
          // this.messages = [];
          this.detachListeners();
          this.addListeners();
          this.channel = this.currentChannel;
      }
  },
  beforeDestroy(){
    this.detachListeners();
  },
  methods:{
      addListeners(){
        let ref = this.getMessagesRef();

          ref.child(this.currentChannel.id).on('child_added', (snapshot) => {
            let message = snapshot.val();
            message['id'] = snapshot.key;
              this.messages.push(message);
                //scrol to the top
              this.$nextTick(() => {
                $("html, body").scrollTop($(document).height());
              });

          });
          //pass arguments to addtolisteners
          this.addToListeners(this.currentChannel.id, ref, 'child_added')
      },
      addToListeners(id, ref, event){
        let index = this.listeners.findIndex( el => {
          return el.id === id && el.ref == ref && el.event === event
        });
        if(index === -1){
          this.listeners.push({id:id, ref:ref, event:event})
        }
      },
      detachListeners(){
          /* if(this.channel !== null){
              this.messagesRef.child(this.channel.id).off()
          } */
          this.listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event)
          });
          this.listeners = [];
          this.messages = [];
        },
      getMessagesRef(){
        if(this.isPrivate){
          return this.privateMessagesRef
        }else{
          return this.messagesRef
        }
      }
  }
};
</script>