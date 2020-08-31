import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'
import { setTitle } from '@/mixins'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
        projects: [],
        favoriteProjects: [],
        detailProject: {},
	},
	getters: {
        projects: state => state.projects,
        favoriteProjects: state => state.favoriteProjects,
        detailProject: state => state.detailProject,
	},
	mutations: {
		setProjects (state, payload) {
			state.projects = payload
		},
		addProject (state, payload) {
			state.projects.push(payload)
        },
        updateProject (state, payload) {
            // プロジェクト詳細の更新
            state.detailProject = payload

            // プロジェクト一覧内のプロジェクトの更新
            const index = state.projects.findIndex(project => project.id === payload.id)
            Vue.set(state.projects, index, payload)
        },
        deleteProject (state, payload) {
            const index = state.projects.findIndex(project => project.id === payload.id)
            state.projects = state.projects.filter((_, i) => i !== index)
        },
        setFavoriteProjects (state, payload) {
            state.favoriteProjects = payload
        },
        addFavoriteProjects (state, payload) {
			state.favoriteProjects.push(payload)
        },
        deleteFavoriteProjects (state, payload) {
            const index = state.favoriteProjects.findIndex(project => project.id === payload.id)
            if (index !== -1) state.favoriteProjects = state.favoriteProjects.filter((_, i) => i !== index)
        },
        setDetailProject (state, payload) {
            state.detailProject = payload
        },
        addSection (state, payload) {
            state.detailProject.sections.push(payload)
        },
        updateSection (state, payload) {
            console.log(payload)
        },
        deleteSection (state, payload) {
            const index = state.detailProject.sections.findIndex(section => section.id === payload)
            if (index !== -1) state.detailProject.sections = state.detailProject.sections.filter((_, i) => i !== index)
        },
	},
	actions: {
		// プロジェクト一覧取得
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
        // プロジェクトの削除
        deleteProjectAction (ctx, kwargs) {
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
        },
        // お気に入りプロジェクト一覧取得
        getFavoriteProjectsAction (ctx, kwargs) {
            Vue.prototype.$axios({
				url: '/api/project/favorites/',
				method: 'GET',
			})
			.then(res => {
				console.log('お気に入りプロジェクト一覧', res)
				this.commit('setFavoriteProjects', res.data)
			})
			.catch(e => {
				console.log(e)
			})
        },
        // お気に入りプロジェクトを追加
		addFavoriteProjectsAction (ctx, kwargs) {
			this.commit('addFavoriteProjects', kwargs)
        },
        // お気に入りプロジェクトを削除
        deleteFavoriteProjectsAction (ctx, kwargs) {
            this.commit('deleteFavoriteProjects', kwargs)
        },
        // プロジェクト詳細取得
        getDetailProjectAction (ctx, id) {
            Vue.prototype.$axios({
                url: `/api/project/${id}/`,
                method: 'GET'
            })
            .then(res => {
                console.log('プロジェクト詳細', res)
                // Ttile設定
                setTitle(res.data.name)
                this.commit('setDetailProject', res.data)
            })
            .catch(e => {
                console.log(e)
            })
        },
        // セクション削除
        deleteSectionAction (ctx, id) {
            Vue.prototype.$axios({
                url: `/api/section/${id}/`,
                method: 'DELETE',
            })
            .then(res => {
                console.log(res)
                this.commit('deleteSection', id)
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
