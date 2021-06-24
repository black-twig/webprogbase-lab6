<template>
  <div class="home">
    <img alt="chat logo" src="https://image.flaticon.com/icons/png/512/3698/3698348.png">
    <div class="hello-message">
    <h1>Welcome to the Vue.js Chat App!</h1>
    <p>Your
    </p>
    <h3>Quick links</h3>
    <ul>
      <li>Already have an account? <router-link to="/signin">Sign in now</router-link></li>
      <li>Do not have an account yet? <router-link to="/signup">Sing up now</router-link></li>
      <li>Open our <router-link to="/chat">Community Chat</router-link></li>
    </ul>
  </div>
  </div>
</template>




<script>

export default {
  name: 'Home',
  components: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
