<template>
  <div class="whole-page">
    <div class="div-left">
      <div class="container scroll-bar-status" id="container">
        <div class="user-container">
          <div class="search-header">
            <div class="user-header">
              USER: {{ username }}
            </div>
            <div class="search-room-bar">
              <CreateRoom room_name="new chat room" />
            </div>
          </div>
          <div class="div-chat">
            <div v-for="room in rooms" v-bind:key="room.id">
              <div
                class="chat-container selected-chat"
                v-if="room.owner.username == username"
                aria-current="true"
              >
                <div class="chat-members">
                  <div class="chat-icon">
                    <img
                      src="https://image.flaticon.com/icons/png/512/724/724689.png"
                      alt="chat icon"
                    />
                  </div>
                  <div class="chat-members-list">
                    <span id="text">{{ room.name }}</span
                    ><input
                      @click="joinRoom(room)"
                      class="btn btn-outline-secondary"
                      type="submit"
                      value="connect"
                      id="my-button"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="chat-container">
                <div class="chat-members">
                  <div class="chat-icon">
                    <img
                      src="https://image.flaticon.com/icons/png/512/724/724689.png"
                      alt="chat icon"
                    />
                  </div>
                  <div class="chat-members-list">
                    <span id="text"> {{ room.name }}</span
                    ><input
                      @click="joinRoom(room)"
                      class="btn btn-outline-secondary"
                      type="submit"
                      value="connect"
                      id="my-button"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!$apollo.loading">
      <div v-if="deleted">
        <img
          src="https://image.flaticon.com/icons/png/512/2603/2603105.png"
          alt="chat deleted"
        />
      </div>
      <div v-else-if="me.currentRoom" class="div-center">
        <div class="">
          <div class="search-header">
            <div class="user-header">
              ROOM: {{ me.currentRoom.name }}
            </div>
            <div
              class="search-room-bar"
              v-if="username == me.currentRoom.owner.username"
            >
              <div class="stylish-input-group">
                <form @submit.prevent="updateRoom(me.currentRoom)" >
                  <input
                    type="text"
                    class="name-update"
                    placeholder="new name"
                    v-model="update"
                    required
                  />
                  <span class="input-group-addon">
                    <button class ="submit-button" type="submit" value="create">Update</button>
                  </span>
                </form>
              </div>
            </div>
          </div>

          <div class="messages-div">
            <div class="chat-messages">
              <div
                v-for="message in me.currentRoom.lastMessages"
                v-bind:key="message.id"
              >
                <div
                  class="new-message"
                  v-if="message.author.username != username"
                >
                  <div class="new-message-image">
                    <img
                      src="https://image.flaticon.com/icons/png/512/747/747545.png"
                      alt="new message"
                    />
                  </div>
                  <div class="recent-message">
                    <div class="recent-message-info">
                      <p>{{ message.text }}</p>
                      <span class="message-time">
                        {{ message.timestamp }} | [{{
                          message.author.username
                        }}]</span
                      >
                    </div>
                  </div>
                </div>
                <div class="outgoing_msg" v-else>
                  <div class="your-message">
                    <p>{{ message.text }}</p>
                    <span class="message-time">
                      {{ message.timestamp }} | [you]</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <form @submit.prevent="createMessage">
              <div class="message-create-div">
                <div class="message-create">
                  <input
                    type="text"
                    class="message-input"
                    placeholder="Type a message"
                    v-model="message"
                    required
                  />
                  <button class="send-message-btn" type="submit" value="Send">
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="div-right">
          <div class="container scroll-bar-status" id="container">
            <div class="search-header">
              <div class="user-header">
                <div class="search-room-bar">
                  <div class="stylish-input-group">
                    <span class="input-group-addon">
                      <button
                        type="submit"
                        value="create"
                        @click="deleteRoom(me.currentRoom)"
                        v-if="username == me.currentRoom.owner.username"
                        class="delete-button"
                      >
                        Delete
                      </button></span
                    >
                  </div>
                </div>
              </div>
              <div class="search-room-bar">
                <div class="stylish-input-group">
                  <span class="input-group-addon">
                    <button class ="leave-btn" type="submit" value="create" @click="leaveRoom">
                      Leave
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div class="user-container">
              <div class="div-chat">
                <ul class="list-group">
                  <div
                    v-for="member in this.me.currentRoom.members"
                    v-bind:key="member.id"
                  >
                    <div
                      class="chat-container selected-chat"
                      v-if="member.username == username"
                      aria-current="true"
                    >
                      <div class="chat-members">
                        <div class="chat-members-list">
                          <span id="text">{{ member.username }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="chat-container">
                      <div class="chat-members">
                        <div class="chat-members-list">
                          <span id="text">{{ member.username }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateRoom from "@/components/chat/RoomCreate.vue";

import {
  GET_ROOMS,
  ROOM_SUB_CREATE,
  ROOM_SUB_UPDATE,
  ROOM_SUB_DELETE,
  GET_ME_ROOM,
  CURRENT_ROOM_UPDATE,
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ROOM,
  DELETE_ROOM,
  MEMBER_JOIN,
  MEMBER_LEFT,
  MESSAGE_SUB_CREATE,
  MESSAGE_CREATE,
} from "@/graphql/chat_query";

export default {
  name: "Chat",
  components: {
    CreateRoom,
  },
  data() {
    return {
      rooms: [],
      room_name: null,
      username: localStorage.getItem("username"),
      message: null,
      me: null,
      update: null,
      deleted: false,
      id: 1,
    };
  },
  apollo: {
    rooms: { query: GET_ROOMS},
    me: { query: GET_ME_ROOM, fetchPolicy: 'no-cache' },
    $subscribe: {
      roomCreated: {
        query: ROOM_SUB_CREATE,
        // Result hook
        result({ data }) {
          const { roomCreated } = data;
          console.log("SUB CREATE ROOM", roomCreated);
          this.rooms.push(roomCreated);
        },
      },
      roomDeleted: {
        query: ROOM_SUB_DELETE,
        result({ data }) {
          for (let index = 0; index < this.rooms.length; index++) {
            if (this.rooms[index].id == data.roomDeleted.id) {
              this.rooms.splice(index, 1);
            }
          }
          if (this.me.currentRoom.id == data.roomDeleted.id) {
            this.deleted = true;
            this.me.currentRoom = null;
          }

          console.log("SUB ROOM DELETE", data.roomDeleted);
        },
      },
      roomUpdated: {
        query: ROOM_SUB_UPDATE,
        // Result hook
        result({ data }) {
          for (let index = 0; index < this.rooms.length; index++) {
            if (this.rooms[index].id == data.roomUpdated.id) {
              console.log(this.rooms[index]);
              this.$set(this.rooms, index, data.roomUpdated);
              console.log(this.rooms[index]);
            }
          }
          console.log("SUB ROOM UPDATE", data.roomUpdated);
        },
      },
      currentRoomChanged: {
        query: CURRENT_ROOM_UPDATE,
        result({ data }) {
          if (data.currentRoomChanged.currentRoom)
            this.$set(
              this.me.currentRoom,
              "currentRoom",
              data.currentRoomChanged.currentRoom
            );
          else this.me.currentRoom = null;
          console.log("SUB ROOM UPDATED", data.currentRoomChanged.currentRoom);
        },
      },
      memberJoin: {
        query: MEMBER_JOIN,
        result({ data }) {
          console.log("MEMBER_JOIN_SUB",data);
          console.log('this.me',this.me);
          //this.$apollo.queries.me.refetch().then(function(){
              console.log("this.me after refresh",this.me);
              if (this.me.currentRoom)
              {
                this.me.currentRoom.members.push(data.memberJoined);
                const mes = {
                  id: this.id,
                  author: { username: "system" },
                  text: data.memberJoined.username + " entered to room",
                };
                this.me.currentRoom.lastMessages.push(mes);
              }
              this.id++;
              console.log("SUB MEMBER JOIN", data.memberJoined);

          //    });
          
          
        },
      },
      memberLeft: {
        query: MEMBER_LEFT,
        result({ data }) {
          for (let i = 0; i < this.me.currentRoom.members.length; i++) {
            if (this.me.currentRoom.members[i].id == data.memberLeft.id) {
              this.me.currentRoom.members.splice(i, 1);
            }
          }
          const mes = {
            id: this.id,
            author: { username: "system" },
            text: data.memberLeft.username + " left",
          };
          this.me.currentRoom.lastMessages.push(mes);
          this.id++;
          console.log("SUB MEMBER LEFT", data.memberLeft);
        },
      },
      messageSubCreate: {
        query: MESSAGE_SUB_CREATE,
        result({ data }) {
          this.me.currentRoom.lastMessages.push(data.messageCreated);
          console.log("SUB MESSAGE CREATE", data.messageCreated);
        },
      },
    },
  },
  methods: {
    async joinRoom(room) {
      try {
        this.deleted = false;
        console.log("Hello");
        console.log("room",room);
        console.log("this.me",this.me);
        if (!this.me.currentRoom) {
          console.log("enter room");
          const result = await this.$apollo.mutate({
            mutation: JOIN_ROOM,
            variables: { roomId: room.id },
          });
          console.log(result);
        } else {
          console.log("leave room");
          const result = await this.$apollo.mutate({
            mutation: LEAVE_ROOM,
          });
          console.log(room);
          console.log(result);
          console.log("enter room");
          const result2 = await this.$apollo.mutate({
            mutation: JOIN_ROOM,
            variables: { roomId: room.id },
          });
          console.log(result2);
        }
        await this.$apollo.queries.me.refetch();
      } catch (error) {
        console.log(error);
      }
    },
    async leaveRoom() {
      this.me.currentRoom=null;
      try {
        console.log("leave room");
        const result = await this.$apollo.mutate({
          mutation: LEAVE_ROOM,
        });
        console.log(result);
        
      } catch (error) {
        console.log(error);
      }
    },
    async updateRoom(room) {
      try {
        console.log(room);
        console.log("update room");
        const result = await this.$apollo.mutate({
          mutation: UPDATE_ROOM,
          variables: { id: room.id, name: this.update },
        });
        console.log(result);
      } catch (error) {
        console.log(error);
      }
      this.update = null;
    },
    async deleteRoom(room) {
      try {
        console.log(room);
        console.log("delete room");
        const result = await this.$apollo.mutate({
          mutation: DELETE_ROOM,
          variables: { id: room.id },
        });
        console.log(result);
/*         for (let i = 0; i < this.me.currentRoom.members.length; i++)
          this.me.currentRoom.members[i].currentRoom = null; */
      } catch (error) {
        console.log(error);
      }
    },
    async createMessage() {
      try {
        console.log("create message");
        const result = await this.$apollo.mutate({
          mutation: MESSAGE_CREATE,
          variables: { text: this.message },
        });
        console.log(result);
      } catch (error) {
        console.log(error);
      }
      this.message = null;
    },
  },
};
</script>
<style scoped>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.user-container {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 100%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.user-header {
  float: left;
  width: 30%;
}
.search-room-bar {
  float: left;
  width: 67%;
  margin-left: 10px;
}
.search-header {
  padding: 10px 29px 10px 20px;
    border-radius: 4px;
  overflow: hidden;
  background-color: #A8DADC;
  border-bottom: 3px solid #457B9D;
}
.user-header {
  color: #1D3557;
  font-size: 20px;
  font-weight: bold;
  margin: auto;
}
.name-update {
  border: 2px solid honeydew;
    border-radius: 10px;
  background-color: honeydew;
  width: 50%;
}

.chat-members-list h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat-members-list h5 span {
  font-size: 13px;
  float: right;
}
.chat-members-list p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat-icon {
  float: left;
  width: 11%;
}
.chat-members-list {
  float: left;
  text-align: left;
  font-size: 12pt;
}
#wer {
  text-align: right;
}
.chat-members {
  overflow: hidden;
  clear: both;
}
.chat-container {
  background-color: #A8DADC;
  border-bottom: 3px dotted #457B9D;
  margin: 0;
  font-size:27px;
  color:#1D3557;
  padding: 18px 16px 10px;
}
.div-chat {
  height: 700px;
  background-color: #A8DADC;
  overflow-y: scroll;
}

.selected-chat {
  background-color: #A8DADC;
  border-bottom: 3px dotted #457B9D;
}

.new-message-image {
  display: inline-block;
  width: 6%;
}
.recent-message {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.recent-message-info p {
  background: honeydew none repeat scroll 0 0;
  border-radius: 3px;
  color: #1D3557;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.message-time {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.recent-message-info {
  width: 50%;
}
.messages-div {
  float: left;
  padding: 30px 15px 0 25px;
  width: 70%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.your-message {
  float: right;
  width: 46%;
}
.your-message p {
  background: #1D3557 none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.message-create input {
    background-color: honeydew;
    width: 90%;
    border:2px solid honeydew;
    border-radius: 6px;
    font-size: 15px;
}

.message-create-div {
  border-top: 1px solid #A8DADC;
  position: relative;
}
.send-message-btn {
  background-color: #457B9D;
    color: white;
    font-size: 5px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #457B9D;
    border-radius: 6px;
    margin-left: 5px;
}
.send-message-btn:hover {
  background-color: #E63946;
}
.messaging {
  padding: 0 0 50px 0;
}
.message-input{
  background-color: honeydew;
    width: 67%;
    border:2px solid honeydew;
    border-radius: 6px;
    font-size: 15px;
}
.submit-button{
background-color: #457B9D;
    color: white;
    font-size: 10px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #457B9D;
    border-radius: 6px;
    height: 40px;
    width: 100px;
    margin-left: 5px;
}
.submit-button:hover {
    background-color: #E63946;
  }
  .delete-button{
background-color: #457B9D;
    color: white;
    font-size: 10px;
    float: left;
    text-align: center;
    border: 2px solid #457B9D;
    border-radius: 6px;
    height: 40px;
    width: 100px;
    margin-left: 5px;
    margin-bottom: 5px;
}
.delete-button:hover {
    background-color: #E63946;
  }
.chat-messages {
  height: 700px;
  overflow-y: auto;
}
.leave-btn{
  background-color: #457B9D;
    color: white;
    font-size: 5px;
    float: left;
    text-align: center;
    border: 2px solid #457B9D;
    border-radius: 6px;
    margin-left: 5px;
}
.leave-btn:hover {
  background-color: #E63946;
}
#my-button {
  display: inline-block;
  background-color: #457B9D;
    color: white;
    font-size: 5px;
    text-align: center;
    vertical-align: middle;
  background-color: #457B9D;
    color: white;
    font-size: 5px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #457B9D;
    border-radius: 6px;
    margin-left: 5px;
    border: 2px solid #457B9D;
    border-radius: 6px;
    margin-left: 5px;
}

#my-button:hover {
  background-color: #E63946;
}
#text {
  font-size: 20px;
  color: #464646;
  text-align: center;
  margin: 1pc;
}
.whole-page{
  display: table;
  width: 100%;
  font-family: Century Gothic;
}
.div-left {
  width: 30%;
  height: 700px;
  float: left;
}
.div-center{
  float: left;
  width: 70%;
  height: 700px;
  padding: 10px;
}
.div-right {
  height: 100%;
  width: 30%;
  overflow: auto;
}

/* 
color codes:
E63946 - imperial red
F1FAEE - honeydew
A8DADC - powder blue
457B9D - celadon blue
1D3557 - prussian blue
*/
</style>
