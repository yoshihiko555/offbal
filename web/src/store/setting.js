import Vue from 'vue'

const initialState = {
	setting: {},
}

export default {
    namespaced: true,
    state: { ...{}, ...initialState },
    getters: {
    	setting: state => state.setting,
    },
    mutations: {
    	setSetting (state, payload) {
    		state.setting = payload
    	},
    	destorySession (state) {
			for (const key in state) {
				if (Object.prototype.hasOwnProperty.call(initialState, key)) {
					state[key] = initialState[key]
				}
			}
    	}
    },
    actions: {
        updateSettingAction (ctx, kwargs) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$axios({
                    url: `/api/setting/${kwargs.id}/`,
                    method: 'PUT',
                    data: kwargs,
                })
                .then(res => {
                    console.log(res)
                    this.commit('setting/setSetting', res.data)
                    resolve(res)
                })
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
            })
        }
    }
}