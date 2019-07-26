import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		socket: {
			isConnected: false,
			message: '',
			reconnectError: false,
		},
		room: {
			name: "",
			currentSource: "",
			queue: [],
			isPlaying: false,
			playbackPosition: 0,
			playbackDuration: 0
		}
	},
	mutations:{
		SOCKET_ONOPEN (state, event)  {
			console.log("socket open");
			Vue.prototype.$socket = event.currentTarget;
			state.socket.isConnected = true;
		},
		SOCKET_ONCLOSE (state, event)  {
			console.log("socket close");
			state.socket.isConnected = false;
		},
		SOCKET_ONERROR (state, event)  {
			console.error(state, event);
		},
		// default handler called for all methods
		SOCKET_ONMESSAGE (state, message)  {
			console.log("socket message");
			state.socket.message = message;
		},
		// mutations for reconnect methods
		SOCKET_RECONNECT(state, count) {
			console.info("reconnect", state, count);
		},
		SOCKET_RECONNECT_ERROR(state) {
			state.socket.reconnectError = true;
		},
	},
	actions: {
		sendMessage(context, message) {
			Vue.prototype.$socket.send(message);
		},
		sync(context, message) {
			console.log("SYNC", message);
			this.state.room.name = message.name;
			this.state.room.currentSource = message.currentSource;
			this.state.room.queue = message.queue;
			if (this.state.room.isPlaying != message.isPlaying) {
				this.state.room.isPlaying = message.isPlaying;
				if (message.isPlaying) {
					Vue.prototype.$events.emit("playVideo");
				}
				else {
					Vue.prototype.$events.emit("pauseVideo");
				}
			}
			this.state.room.playbackPosition = message.playbackPosition;
			this.state.room.playbackDuration = message.playbackDuration;
		}
	}
});