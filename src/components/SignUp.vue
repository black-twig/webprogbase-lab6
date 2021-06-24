<template>
<div>
<div v-if="error">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Registration failed!</strong> {{error}}
            <button @click="noerr" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
</div>

<form @submit="registerUser">
  <label>
    <p class="label-txt">ENTER YOUR NAME</p>
    <input type="text" class="input"  v-model="username" required>
    <div class="line-box">
      <div class="line"></div>
    </div>
  </label>
  <label>
    <p class="label-txt">ENTER YOUR PASSWORD</p>
    <input  type="password" class="input"  v-model="password" required>
    <div class="line-box">
      <div class="line"></div>
    </div>
  </label>
  <button type="submit" id="signupButton">Register</button>
  <div id="some">Already have an account? <router-link to="/signin">Sign in now</router-link></div>
</form>
</div>
</template>
<script>
import {onLogin} from '../vue-apollo'
import { REGISTER_USER, LOGIN_USER} from '@/graphql/user_query' // @ is an alias to /src
export default {
    name: 'signup',
    data(){
        return{
            //id: null,
            //errors: null,
            username: null,
            password: null,
            error:null,
            //er_mes:"",
            skipQuery:true
        };
    },
    methods:{
         async registerUser(e){
             e.preventDefault()
             let registerRes=null;
             let loginRes=null;
             try{
              registerRes= await this.$apollo.query({
                    query: REGISTER_USER,
                    variables: { username: this.username,
                                  password: this.password},
                  })
              console.log('registerRes',registerRes.data);
              if (registerRes.data)
              {
                  loginRes= await this.$apollo.query({
                      query: LOGIN_USER,
                      variables: {  username: this.username,
                                    password: this.password}
                    })
                  console.log('loginRes',loginRes.data.login);
                  localStorage.setItem('username',this.username);
                  await onLogin(this.$apollo.provider.defaultClient,loginRes.data.login);
                  this.$router.push('/chat');
              }
              else
                this.error='Registration failed by unknown reason. Please try again later.'

            } catch({ graphQLErrors, networkError }){
                if (graphQLErrors)
                  graphQLErrors.map(({ message}) => this.error=message);
                if (networkError) 
                  this.error=networkError;
            }

        },
        noerr(){
            this.error=""
        }
    }
};
</script>
<style scoped>
form {
  font-family: Century Gothic;
  width: 55%;
  margin: 60px auto;
  background: #F1FAEE;
  padding: 60px 120px 80px 120px;
  text-align: center;
  
  border: 2px solid honeydew;
  border-radius: 10px;
}
label {
  display: block;
  position: relative;
  margin: 40px 0px;
}
.label-txt {
  position: absolute;
  top: -1.6em;
  padding: 10px;
  font-size: .8em;
  letter-spacing: 1px;
  color: rgb(120,120,120);
  transition: ease .3s;
}
.input {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  outline: none;
}

.line-box {
  position: relative;
  width: 100%;
  height: 2px;
  background: #BCBCBC;
}

.line {
  position: absolute;
  width: 0%;
  height: 2px;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: #8BC34A;
  transition: ease .6s;
}

.input:focus + .line-box .line {
  width: 100%;
}

.label-active {
  top: -3em;
}

#signupButton {
  background-color: #457B9D;
    color: white;
    font-size: 10px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #457B9D;
    border-radius: 6px;
    height: 50px;
    width: 120px;
    margin-left: 5px;
}

#signupButton:hover {
  background-color: #E63946;
}
a:link{
  
  color: #42b983;
}
#some{
  padding: 10px;
  font-size: .8em;
  letter-spacing: 1px;
  color: rgb(120,120,120);
  transition: ease .3s;
}

</style>