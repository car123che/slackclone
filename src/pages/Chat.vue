<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <h2 class="text-light">#slack"</h2>
                    <hr style="border: 1px solid #333;">
                    <button  @click="logOut" class="btn btn-outline-light">Logout</button>
                </div>
                <div class="col-md-8 content">content</div>
            </div>
        </div>
    </div>
</template>

<script>
import auth from 'firebase/auth'
export default {
    name: 'Chat',
    methods: {
        logOut(){
            firebase.auth().signOut()
            this.$store.dispatch('setUser', null)
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>

.container-fluid{
    margin-top: -3.8em;
}
.sidebar{
    width: 33.5%;
    display: block;
    float: left;
    position: fixed;
    height: 101%;
    background-color: black;
    padding-top: 2em;
    overflow: auto;
}    

.content{
    width: 66%;
    display: block;
    float: left;
    margin-left: 34%;
}
</style>