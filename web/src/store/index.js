import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
		projects: [],
	},
	getters: {
		projects: state => state.projects,
	},
	mutations: {
		setProjects (state, payload) {
			state.projects = payload
		},
		addProject (state, payload) {
			state.projects.push(payload)
		},
	},
	actions: {
		// プロジェクト一覧更新
		updateProjectsAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/project/',
				method: 'GET',
			})
			.then(res => {
				console.log('最新プロジェクト一覧', res)
				this.commit('setProjects', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		addProjectsAction (ctx, kwargs) {
			this.commit('addProject', kwargs)
		},
	},
	modules: {
	},
    plugins: [
        VuexPersistedstate({
            storage: window.localStorage
        })
    ]
})
