export default {
    namespaced: true,
    state: {
    	setting: {},
    },
    getters: {
    	setting: state => state.setting,
    },
    mutations: {
    	setSetting (state, payload) {
    		state.setting = payload
    	},
    },
    actions: {
    }
}