import Vue from 'vue'

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