<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <img
          src="@/assets/conversation/3288524.jpg"
          class="img-fluid"
          alt="chat"
        />
      </div>
    </div>
    <div class="alert alert-info" v-if="this.loading">Processing...</div>
    <div class="alert alert-danger" v-if="errorB">
      <div v-for="err in error" :key="err.id">{{ err }}</div>
    </div>

    <div class="row mt-5">
      <h1 class="text-center">SLACK CLONE WEBCHAT</h1>
      <h5>No lo olvides nunca: todo comunica</h5>
    </div>
    <div class="row mt-5">
      <div class="col-xs-6 mb-4">
        <button
          class="btn btn-outline-danger btn-lg agrandar"
          @click="loginWithGoogle"
        >
          <i class="fab fa-google mx-2"></i>
          Login with Google
        </button>
      </div>
      <div class="col-xs-6">
        <button
          class="btn btn-outline-primary btn-lg px-4"
          @click="loginWithFacebook"
        >
          <i class="fab fa-facebook mx-2"></i>
          Login with Facebook
        </button>
      </div>
    </div>
  </div>
</template>
  
<!---------------------------------SCRIPTS------------------------------>
<script>
//IMPORTS
import auth from "firebase/auth";
import database from "firebase/database";

export default {
  name: "Login",
  data() {
    return {
      error: [],
      loading: false,
      errorB: false,
      usersRef: firebase.database().ref("users"),
    };
  },
  methods: {
    loginWithGoogle() {
      //loading set to true
      this.loading = true;
      //clrear old errors
      this.error = [];
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((res) => {
          //pass user to save in db
          this.saveUserToUsersRef(res.user);
          //dispatch setUser action
          this.$store.dispatch("setUser", res.user);
          // sessionStorage.setItem("user", res.user.email);
          //then redirect user to '/' page
          this.$router.push("/");
        })
        .catch((err) => {
          this.error.push(err.message);
          this.loading = false;
          this.hasErrors();
        });
    },
    saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL,
      });
    },
    loginWithFacebook() {
      //loading set to true
      this.loading = true;
      //clrear old errors
      this.error = [];
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then((res) => {
          this.saveUserToUsersRef(res.user);
          //dispatch setUser action
          this.$store.dispatch("setUser", res.user);
          // sessionStorage.setItem("user", res.user.email);
          //then redirect user to '/' page
          this.$router.push("/");
        })
        .catch((err) => {
          this.error.push(err.message);
          this.loading = false;
          this.hasErrors();
        });
    },
    hasErrors() {
      if (this.error.length > 0) {
        this.errorB = true;
        setTimeout(() => {
          this.errorB = false;
        }, 2500);
      } else {
        this.errorB = false;
      }
    },
  },
};
</script>


<!-------------------------------------STYLES------------------------------->
<style scoped>
.container {
  margin-top: -1em;
  overflow: auto;
}

.img-fluid {
  height: 35vh;
}
.text-center {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.btn-outline-info:hover {
  color: white;
}

.fa-facebook {
  font-size: 1.2em;
}

.agrandar {
  width: 14em;
}
</style>