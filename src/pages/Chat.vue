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
  width: 33.5%;
  display: block;
  float: left;
  position: fixed;
  height: 101%;
  background-color: black;
  padding-top: 2em;
  overflow: auto;
}

.content {
  width: 66%;
  display: block;
  float: left;
  margin-left: 34%;
}
</style>