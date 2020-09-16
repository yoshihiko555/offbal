import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'
import { setTitle } from '@/mixins'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
	    categorys: [],
	    favoriteCategorys: [],
		labels: [],
	    detailCategory: {},
	    archivedCategorys: [],
	},
	getters: {
	    categorys: state => state.categorys,
	    favoriteCategorys: state => state.favoriteCategorys,
		labels: state => state.labels,
		detailCategory: state => state.detailCategory,
		archivedCategorys: state => state.archivedCategorys,
	},
	mutations: {
		setCategorys (state, payload) {
            state.categorys = payload
		},
		setLabels (state, payload) {
            state.labels = payload
		},
		addCategory (state, payload) {
            state.categorys.push(payload)
		},
		addLabel (state, payload) {
            state.labels.push(payload)
		},
		updateCategory (state, payload) {
	        // カテゴリー詳細の更新
	        state.detailCategory = payload

	        // カテゴリー一覧内のカテゴリーの更新
	        const index = state.categorys.findIndex(category => category.id === payload.id)
	        Vue.set(state.categorys, index, payload)
    	},
		deleteCategory (state, payload) {
	        const index = state.categorys.findIndex(category => category.id === payload.id)
	        state.categorys = state.categorys.filter((_, i) => i !== index)
        },
        updateCategoryIndex (state, payload) {
            state.categorys = payload
        },
  		setFavoriteCategorys (state, payload) {
	        const favopro = []
	        for (const category of payload) {
	            if (category.favorite) favopro.push(category)
	        }
	      	state.favoriteCategorys = favopro
  		},
	  	addFavoriteCategorys (state, payload) {
			state.favoriteCategorys.push(payload)
	  	},
		deleteFavoriteCategorys (state, payload) {
	        const index = state.favoriteCategorys.findIndex(category => category.id === payload.id)
	        if (index !== -1) state.favoriteCategorys = state.favoriteCategorys.filter((_, i) => i !== index)
    	},
	    setDetailCategory (state, payload) {
	        state.detailCategory = payload
	    },
	    addSection (state, payload) {
	        // カテゴリー詳細
	        state.detailCategory.sections.push(payload)

	        // 全体の該当カテゴリー
	        const category = state.categorys.find(category => category.id === payload.target_category)
	        category.sections.push(payload)
	    },
	    updateSection (state, payload) {
	        // カテゴリー詳細
	        const index = state.detailCategory.sections.findIndex(section => section.id === payload.id)
	        Vue.set(state.detailCategory.sections, index, payload)

	        // 全体の該当カテゴリー
	        const category = state.categorys.find(category => category.id === payload.target_category)
	        const j = category.sections.findIndex(section => section.id === payload.id)
	        Vue.set(category.sections, j, payload)
	    },
	    deleteSection (state, payload) {
	        // カテゴリー詳細
	        const index = state.detailCategory.sections.findIndex(section => section.id === payload)
	        if (index !== -1) state.detailCategory.sections = state.detailCategory.sections.filter((_, i) => i !== index)

	        // 全体の該当カテゴリー
	        const category = state.categorys.find(category => category.id === state.detailCategory.id)
	        const j = category.sections.findIndex(section => section.id === payload)
	        if (j !== -1) category.sections = category.sections.filter((_, i) => i !== j)
	    },
	    setArchivedCategorys (state, payload) {
	        const archives = []
	        for (const category of payload) {
	            if (category.archived) archives.push(category)
	        }
	      	state.archivedCategorys = archives
	    },
	    addArchivedCategorys (state, payload) {
	        state.archivedCategorys.push(payload)
	    },
	    deleteArchivedCategorys (state, payload) {
	        const index = state.archivedCategorys.findIndex(category => category.id === payload.id)
	        if (index !== -1) state.archivedCategorys = state.archivedCategorys.filter((_, i) => i !== index)
	    },
		addTask (state, payload) {
			// 違うカテゴリーだったら追加しない
			if (state.detailCategory.id !== payload.target_category) return
			if (payload.target_section === 0) {
				// カテゴリーのタスクに追加
				state.detailCategory.tasks.push(payload)
			} else {
				// セクションのタスクに追加
				console.log('セクションのタスクに追加')
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				section.tasks.push(payload)
			}
		},
		deleteTask (state, payload) {
			// カテゴリー詳細
			console.log(payload)
			if (payload.target_section === 0) {
				const index = state.detailCategory.tasks.findIndex(task => task.id === payload.id)
				if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				const index = section.tasks.findIndex(task => task.id === payload.id)
				if (index !== -1) section.tasks = section.tasks.filter((_, i) => i !== index)
			}
	    },
		deleteTasks (state, payload) {
			for (const i in payload) {
				if (payload[i].target_section === 0) {
					const index = state.detailCategory.tasks.findIndex(task => task.id === payload[i].id)
					if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
				} else {
					const section = state.detailCategory.sections.find(section => section.id === payload[i].target_section)
					const index = section.tasks.findIndex(task => task.id === payload[i].id)
					if (index !== -1) section.tasks = section.tasks.filter((_, i) => i !== index)
				}
			}
		},
		updateTask (state, payload) {
			if (payload.target_section === 0) {
				const index = state.detailCategory.tasks.findIndex(task => task.id === payload.id)
				Vue.set(state.detailCategory.tasks, index, payload)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				const index = section.tasks.findIndex(task => task.id === payload.id)
				Vue.set(section.tasks, index, payload)
			}
		},
		addCompleteTask (state, payload) {
			state.detailCategory.complete_tasks.push(payload)
		},
		addCompleteTasks (state, payload) {
			for (const i in payload) {
				state.detailCategory.complete_tasks.push(payload[i])
			}
		},
		addSubTask (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			task.sub_tasks.push(payload)
		},
		addCompleteSubTasks (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			task.complete_sub_tasks = payload.sub_task_list
		},
		changeComment (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.id)
			task.comment = payload.comment
		}
	},
	actions: {
		// アプリ画面初期描画時の処理
		appInitAction (ctx, kwargs) {
			return new Promise((resolve, reject) => {
	        	Vue.prototype.$axios({
	        		url: '/api/appinit/',
	        		method: 'GET',
	        	})
	        	.then(res => {
	        		console.log('アプリ初期描画', res)
					this.commit('setCategorys', res.data.categorys)
					this.commit('setFavoriteCategorys', res.data.categorys)
					this.commit('setArchivedCategorys', res.data.categorys)
					this.commit('setLabels', res.data.labels)
					resolve(res)
	        	})
	        	.catch(e => {
	        		console.log(e)
	        		reject(e)
	        	})
			})
		},
    	// 作成したカテゴリーを一覧に追加
		addCategorysAction (ctx, kwargs) {
			this.commit('addCategory', kwargs)
    	},
		addLabelsAction (ctx, kwargs) {
			this.commit('addLabel', kwargs)
		},
	    // カテゴリーの更新
	    updateCategoryAction (ctx, kwargs) {
	        this.commit('updateCategory', kwargs)
	    },
	    // カテゴリーの削除
        deleteCategoryAction (ctx, kwargs) {
            Vue.prototype.$axios({
                url: `/api/category/${kwargs.id}/`,
                method: 'DELETE',
            })
            .then(res => {
                console.log(res)
                this.commit('deleteCategory', kwargs)
                this.commit('deleteArchivedCategorys', kwargs)
            })
            .catch(e => {
                console.log(e)
            })
	    },
	    // お気に入りカテゴリーを追加
		addFavoriteCategorysAction (ctx, kwargs) {
			this.commit('addFavoriteCategorys', kwargs)
    	},
	    // お気に入りカテゴリーを削除
	    deleteFavoriteCategorysAction (ctx, kwargs) {
	        this.commit('deleteFavoriteCategorys', kwargs)
	    },
    	// カテゴリー詳細取得
	    getDetailCategoryAction (ctx, id) {
	        Vue.prototype.$axios({
	            url: `/api/category/${id}/`,
	            method: 'GET'
	        })
	        .then(res => {
	            console.log('カテゴリー詳細', res)
	            // Ttile設定
	            setTitle(res.data.name)
	            this.commit('setDetailCategory', res.data)
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
