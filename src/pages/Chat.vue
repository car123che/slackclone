<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 sidebar">
          <Sidebar></Sidebar>
        </div>
        <div class="col-md-8 content">
          <messages></messages>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Messages from '../components/messages/Messages';
import Sidebar from "../components/Sidebar/Sidebar";
// import Messages from "../components/messages/Messages"

export default {
  name: "Chat",
  components: { Sidebar, Messages }
};
</script>

<style scoped>
.container-fluid {
  margin-top: -3.8em;
}
.sidebar {
  width: 38vw;
  display: block;
  float: left;
  position: fixed;
  height: 101%;
  background:  url('../assets/Fondos/side.png');
  /* background-color: black; */
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 2em;
  overflow: auto;
  font-family: 'Roboto Mono', monospace;
}

.sidebar::-webkit-scrollbar{
  width: 8px;
  display: none;
}
.content {
  width: 64vw;
  background-image: url('../assets/Fondos/tic-tac-toe.png');
  height: auto; 
  display: block;
  float: left;
  margin-left: 34%;
  font-family: 'Roboto', sans-serif;
}

.content::-webkit-scrollbar{
  width: 8px;
  display: none;
}
</style>