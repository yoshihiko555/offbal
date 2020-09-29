import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'
import { setTitle } from '@/mixins'
import setting from './setting'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
	    categorys: [],
		labels: [],
	    detailCategory: {},
	},
	getters: {
	    categorys: state => state.categorys,
		labels: state => state.labels,
		detailCategory: state => state.detailCategory,
	},
	mutations: {
		setCategorys (state, payload) {
            state.categorys = payload
		},
		setLabels (state, payload) {
            state.labels = payload
		},
		addLabel (state, payload) {
            state.labels.push(payload)
		},
		updateLabelToTask (state, payload) {
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.id)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.id)
			}
			task.label = []
			for (const i in payload.label) {
				task.label.push(payload.label[i])
			}
		},
		updateCategory (state, payload) {
	        // カテゴリー詳細の更新
	        state.detailCategory = payload

	        // カテゴリー一覧内のカテゴリーの更新
	        const index = state.categorys.findIndex(category => category.id === payload.id)
	        Vue.set(state.categorys, index, payload)
    	},
        updateCategoryIndex (state, payload) {
            state.categorys = payload
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
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.target_task)
			}
			task.sub_tasks.push(payload)
		},
		updateCompleteSubTasks (state, payload) {
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.target_task)
			}
			task.sub_tasks.splice(0, task.sub_tasks.length)
			task.sub_tasks.push(...payload.sub_tasks)
			task.complete_sub_tasks.splice(0, task.complete_sub_tasks.length)
			task.complete_sub_tasks.push(...payload.complete_sub_tasks)
		},
		updateSubTask (state, payload) {
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.target_task)
			}
			const index = task.sub_tasks.findIndex(sub => sub.id === payload.id)
			Vue.set(task.sub_tasks, index, payload)
			const i = task.complete_sub_tasks.findIndex(sub => sub.id === payload.id)
			if (i !== -1) Vue.set(task.complete_sub_tasks, i, payload)
		},
		deleteSubTask (state, payload) {
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.target_task)
			}
			const index = task.sub_tasks.findIndex(subtask => subtask.id === payload.id)
			if (index !== -1) task.sub_tasks = task.sub_tasks.filter((_, i) => i !== index)
			const j = task.complete_sub_tasks.findIndex(subtask => subtask.id === payload.id)
			if (j !== -1) task.complete_sub_tasks = task.complete_sub_tasks.filter((_, i) => i !== j)
		},
		deleteLabels (state, payload) {
			let task
			if (payload.target_section === 0) {
				task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			} else {
				const section = state.detailCategory.sections.find(section => section.id === payload.target_section)
				task = section.tasks.find(task => task.id === payload.target_task)
			}
			for (const i in payload.delete_labels) {
				const index = task.label.findIndex(label => label.id === payload.delete_labels[i].id)
				if (index !== -1) task.label = task.label.filter((_, i) => i !== index)
			}
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
					this.commit('setLabels', res.data.labels)
					this.commit('setting/setSetting', res.data.setting)
					resolve(res)
	        	})
	        	.catch(e => {
	        		console.log(e)
	        		reject(e)
	        	})
			})
		},
		addLabelsAction (ctx, kwargs) {
			this.commit('addLabel', kwargs)
		},
	    // カテゴリーの更新
	    updateCategoryAction (ctx, kwargs) {
	        this.commit('updateCategory', kwargs)
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
		deleteSubTaskAction (ctx, id) {
	        Vue.prototype.$axios({
	            url: `/api/sub_task/${id}/`,
	            method: 'DELETE',
	        })
	        .then(res => {
	            console.log(res)
	            this.commit('deleteSubTask', res.data)
	        })
	        .catch(e => {
	            console.log(e)
	        })
	    },
		// タスク更新
		updateTaskAction (ctx, kwargs) {
			this.commit('updateTask', kwargs)
		},
		deleteLabelAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/label/delete/',
				method: 'DELETE',
				data: {
					task_id: kwargs.task_id,
					delete_label_list: kwargs.delete_label_list
				}
			})
			.then(res => {
				console.log(res)
				this.commit('deleteLabels', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
	},
	modules: {
		setting,
	},
    plugins: [
        VuexPersistedstate({
            storage: window.localStorage
        })
    ]
})
