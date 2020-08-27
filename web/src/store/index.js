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
        updateProject (state, payload) {
            const index = state.projects.findIndex(project => project.id === payload.id)
            Vue.set(state.projects, index, payload)
        },
        deleteProject (state, payload) {
            const index = state.projects.findIndex(project => project.id === payload.id)
            state.projects = state.projects.filter((_, i) => i !== index)
        }
	},
	actions: {
		// プロジェクト一覧更新
		getProjectsAction (ctx, kwargs) {
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
        // 作成したプロジェクトを一覧に追加
		addProjectsAction (ctx, kwargs) {
			this.commit('addProject', kwargs)
        },
        // プロジェクトの更新
        updateProjectAction (ctx, kwargs) {
            this.commit('updateProject', kwargs)
        },
        deleteProjectAction (ctx, kwargs) {
            console.log(ctx, kwargs)
            Vue.prototype.$axios({
                url: `/api/project/${kwargs.id}/`,
                method: 'DELETE',
            })
            .then(res => {
                console.log(res)
                this.commit('deleteProject', kwargs)
            })
            .catch(e => {
                console.log(e)
            })
        }
	},
	modules: {
	},
    plugins: [
        VuexPersistedstate({
            storage: window.localStorage
        })
    ]
})
