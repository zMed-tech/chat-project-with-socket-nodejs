<template>
  <div id="home">
    <div id="con" v-if="users.length == 0">
      <h1>Connection</h1>
      <input
        type="text"
        id="username"
        class="tape"
        v-model="username"
        placeholder="username"
      />

       <input
        type="text"
        id="userTo"
        class="tape"
        v-model="userTo"
        placeholder="To"
      />

      <input
        type="text"
        id="create"
        class="tape"
        v-model="room"
        placeholder="Room"
      />

    
      <p id="err">{{ errMsg }}</p>
      <button @click="connect">Connect</button>
      <button @click="cancel">Cancel</button>
    </div>
    <div id="chat" v-else>
      <h1>Chat</h1>

      <p v-for="(msg, index) in messages" :key="index" :class="msg.style">
        {{ msg.text }}
      </p>

      <input
        type="text"
        name="msg"
        id="msg"
        class="tape"
        v-model="message"
        placeholder="Message"
      />

      <button @click="sendMsg">Send</button> <br />

      <button @click="deconnect" style="margin: 30px 0">Disconnect</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  created() {
    

    this.socket.on("receiveMgs", (data) => {

        this.messages.push({
          text: data,
          style: "you",
        });
      
    });
  },

  beforeDestroy() {

    this.socket.emit('decon', this.users[0])
  },

  data() {
    return {
      users: [],
      usersTo: [],
      username: "",
      userTo: '',
      errMsg: "",
      messages: [],
      message: "",
      socket: io(),
      room: '',
      
      
    };
  },

  methods: {
    connect() {
      if (this.username == "" || this.userTo == "") {
        this.errMsg = "tape ton putain de nom et le nom de ton copin";
      } else {
        this.errMsg = "";

        this.users.push(this.username);
        this.username = "";
        this.usersTo.push(this.userTo)
        this.userTo = ""

        this.socket.emit("con", this.users[0], this.room)

        
        
      }
    },

    cancel() {
      this.username = "";
    },

    deconnect() {
      this.users.splice(0, 1);
    },

    sendMsg() {
      if (this.message != "") {
        this.messages.push({
          text: this.message,
          style: "me",
        });

        this.socket.emit("sendMsg", {
          msg: this.message,
          to: this.usersTo[0],
          room: this.room
        });
        this.message = "";
       
      }
    },
  },
};
</script>

<style scoped>
#home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;

  align-items: center;
}

#con {
  padding: 20px;
  border: 3px solid darkcyan;
  box-shadow: 5px 5px 10px gray;
  border-radius: 20px;
}

.tape {
  padding: 5px;
  outline: none;
  border: 1px solid darkcyan;
  margin: 10px 0;
  font-size: 18px;
}

#err {
  color: red;
  font-weight: bold;
  margin: 10px 0;
}

button {
  cursor: pointer;
  color: red;
  background-color: darkcyan;
  font-weight: bold;
  padding: 5px;
  outline: none;
  border-radius: 20px;
}

.me {
  color: red;
  text-align: start;
}

.you {
  color: blue;
   text-align: end;
}
</style>