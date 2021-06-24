<template>
<div>
  <form @submit="createRoom">
    <div class="stylish-input-group">
      <input type="text" class="search-bar" placeholder="new room name" 
        v-model="room_name" required>
      <span class="input-group-addon">
        <button class="submit-button" type="submit" value="create">Create</button>
      </span>
    </div>
  </form>
</div>     
</template>

<script>
import {CREATE_ROOM} from "@/graphql/chat_query";

export default {
  name: 'CreateRoom',
  data(){
        return{
           room_name:null,
           username:localStorage.getItem('username'),
        };
    },

      methods:{
        async createRoom(e){
             e.preventDefault()
             try{
                    console.log('create post');
                    const result = await this.$apollo.mutate({
                    mutation: CREATE_ROOM,
                    variables: { name: this.room_name}
                    });
                    console.log(result);

            }
            catch(error){
                console.log(error)
            }

        }
    
      }

}


</script>
<style scoped>

.submit-button{
   background-color: #457B9D;
    color: white;
    font-size: 10px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #457B9D;
    border-radius: 6px;
    height: 40px;
    width: 95px;
    margin-left: 5px;
}
.submit-button:hover {
    background-color: #E63946;
  }
  .search-bar {
    background-color: honeydew;
    width: 67%;
    border:2px solid honeydew;
    border-radius: 6px;
    font-size: 15px;
  }
</style>