<template>
    <div>
        <div class="mt-3 mb-5">
            <div v-for="message in messages" :key="message.id">
                <div class="media">
                    <img :src="message.user.avatar"  height="50px" alt="" class="align-self-start mr-3">
                    <div class="edia-body">
                        <h6 class="mt-0">
                            <a href="#">{{message.user.name}}</a> - {{message.timestamp | fromNow }}
                        </h6>
                        <p v-if="!isFile(message)" :class="{'self_message': selfMessage(message.user)}" >{{message.content}}</p>
                        <img :src="message.image" alt="image" class="img" v-else height="200">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-------------------------------------SCRIPT---------------------->
<script>
//imports
import moment from 'moment';
import {mapGetters} from 'vuex';

export default {
    name: 'Message',
    props: ['messages'],
    computed:{
        ...mapGetters(['currentUser'])
    },
    filters:{
        fromNow(value){
            return moment(value).fromNow();
        }
    },
    methods:{
        selfMessage(user){
            return user.id == this.currentUser.uid;
        },
        isFile(message){
            return message.content == null && message.image != null;
        }
    }
}
</script>

<style scoped>
    .self_message{
        border-left:  5px solid red;
        padding: 0 10px
    }
</style>