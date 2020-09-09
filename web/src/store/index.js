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
		labels: [],
	    detailProject: {},
	    archivedProjects: [],
	},
	getters: {
	    projects: state => state.projects,
	    favoriteProjects: state => state.favoriteProjects,
		labels: state => state.labels,
		detailProject: state => state.detailProject,
		archivedProjects: state => state.archivedProjects,
	},
	mutations: {
		setProjects (state, payload) {
            state.projects = payload
		},
		setLabels (state, payload) {
            state.labels = payload
		},
		addProject (state, payload) {
            state.projects.push(payload)
		},
		addLabel (state, payload) {
            state.labels.push(payload)
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
        updateProjectIndex (state, payload) {
            state.projects = payload
        },
  		setFavoriteProjects (state, payload) {
	        const favopro = []
	        for (const project of payload) {
	            if (project.favorite) favopro.push(project)
	        }
	      	state.favoriteProjects = favopro
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
	        // プロジェクト詳細
	        state.detailProject.sections.push(payload)

	        // 全体の該当プロジェクト
	        const project = state.projects.find(project => project.id === payload.target_project)
	        project.sections.push(payload)
	    },
	    updateSection (state, payload) {
	        // プロジェクト詳細
	        const index = state.detailProject.sections.findIndex(section => section.id === payload.id)
	        Vue.set(state.detailProject.sections, index, payload)

	        // 全体の該当プロジェクト
	        const project = state.projects.find(project => project.id === payload.target_project)
	        const j = project.sections.findIndex(section => section.id === payload.id)
	        Vue.set(project.sections, j, payload)
	    },
	    deleteSection (state, payload) {
	        // プロジェクト詳細
	        const index = state.detailProject.sections.findIndex(section => section.id === payload)
	        if (index !== -1) state.detailProject.sections = state.detailProject.sections.filter((_, i) => i !== index)

	        // 全体の該当プロジェクト
	        const project = state.projects.find(project => project.id === state.detailProject.id)
	        const j = project.sections.findIndex(section => section.id === payload)
	        if (j !== -1) project.sections = project.sections.filter((_, i) => i !== j)
	    },
	    setArchivedProjects (state, payload) {
	        const archives = []
	        for (const project of payload) {
	            if (project.archived) archives.push(project)
	        }
	      	state.archivedProjects = archives
	    },
	    addArchivedProjects (state, payload) {
	        state.archivedProjects.push(payload)
	    },
	    deleteArchivedProjects (state, payload) {
	        const index = state.archivedProjects.findIndex(project => project.id === payload.id)
	        if (index !== -1) state.archivedProjects = state.archivedProjects.filter((_, i) => i !== index)
	    },
		addTask (state, payload) {
			// 違うプロジェクトだったら追加しない
			if (state.detailProject.id !== payload.target_project) return
			if (payload.target_section === 0) {
				// プロジェクトのタスクに追加
				state.detailProject.tasks.push(payload)

				// 全体の該当プロジェクト
				// const project = state.projects.find(project => project.id === payload.target_project)
				// project.sections.push(payload)
			} else {
				// セクションのタスクに追加
				console.log('セクションのタスクに追加')
				const section = state.detailProject.sections.find(section => section.id === payload.target_section)
				section.tasks.push(payload)
			}
		},
		deleteTask (state, payload) {
			// プロジェクト詳細
			if (payload.target_section === 0) {
				const index = state.detailProject.tasks.findIndex(task => task.id === payload.id)
				if (index !== -1) state.detailProject.tasks = state.detailProject.tasks.filter((_, i) => i !== index)
			} else {
				const section = state.detailProject.sections.find(section => section.id === payload.target_section)
				const index = section.tasks.findIndex(task => task.id === payload.id)
				if (index !== -1) section.tasks = section.tasks.filter((_, i) => i !== index)
			}

	        // 全体の該当プロジェクト
	        // const project = state.projects.find(project => project.id === state.detailProject.id)
	        // const j = project.tasks.findIndex(task => task.id === payload)
	        // if (j !== -1) project.tasks = project.tasks.filter((_, i) => i !== j)
	    },
		updateTask (state, payload) {
			console.log('updateTask')
			console.log(payload)
			if (payload.target_section === 0) {
				const index = state.detailProject.tasks.findIndex(task => task.id === payload.id)
				Vue.set(state.detailProject.tasks, index, payload)
			} else {
				const section = state.detailProject.sections.find(section => section.id === payload.target_section)
				const index = section.tasks.findIndex(task => task.id === payload.id)
				Vue.set(section.tasks, index, payload)
			}
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
					this.commit('setFavoriteProjects', res.data)
					this.commit('setArchivedProjects', res.data)
			})
			.catch(e => {
					console.log(e)
			})
		},
		// ラベル一覧取得
		getLabelsAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/label/',
				method: 'GET',
			})
			.then(res => {
				console.log('ラベル一覧', res)
				this.commit('setLabels', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
    	// 作成したプロジェクトを一覧に追加
		addProjectsAction (ctx, kwargs) {
			this.commit('addProject', kwargs)
    	},
		addLabelsAction (ctx, kwargs) {
			this.commit('addLabel', kwargs)
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
                this.commit('deleteArchivedProjects', kwargs)
            })
            .catch(e => {
                console.log(e)
            })
	    },
	    // お気に入りプロジェクト一覧取得
	    // getFavoriteProjectsAction (ctx, kwargs) {
	    //     Vue.prototype.$axios({
		// 		url: '/api/project/favorites/',
		// 		method: 'GET',
		// 	})
		// 	.then(res => {
		// 		console.log('お気に入りプロジェクト一覧', res)
		// 		this.commit('setFavoriteProjects', res.data)
		// 	})
		// 	.catch(e => {
		// 		console.log(e)
		// 	})
	    // },
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
	    },
		// タスク削除
	    deleteTaskAction (ctx, id) {
	        Vue.prototype.$axios({
	            url: `/api/task/${id}/`,
	            method: 'DELETE',
	        })
	        .then(res => {
	            console.log(res)
	            this.commit('deleteTask', res.data)
	        })
	        .catch(e => {
	            console.log(e)
	        })
	    },
		// タスク更新
		updateTaskAction (ctx, kwargs) {
			this.commit('updateTask', kwargs)
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
