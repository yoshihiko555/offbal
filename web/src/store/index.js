import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'
import { setTitle } from '@/mixins'
import setting from './setting'

Vue.use(Vuex)

const initialState = {
	categories: [],
	labels: [],
	detailCategory: {},
}

export default new Vuex.Store({
	strict: true,
	state: { ...{}, ...initialState },
	getters: {
	    categories: state => state.categories,
		labels: state => state.labels,
		detailCategory: state => state.detailCategory,
		todaySchedule: state => state.todaySchedule,
		futureSchedule: state => state.futureSchedule,
		searchResult: state => state.searchResult,
	},
	mutations: {
		setCategories (state, payload) {
            state.categories = payload
		},
		setLabels (state, payload) {
            state.labels = payload
		},
		addLabel (state, payload) {
            state.labels.push(payload)
		},
		updateLabelToTask (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.id)

			if (task === undefined) return
			task.label = []
			for (const i in payload.label) {
				task.label.push(payload.label[i])
			}
		},
		updateCategory (state, payload) {
	        // カテゴリー詳細の更新
	        state.detailCategory = payload

	        // カテゴリー一覧内のカテゴリーの更新
	        const index = state.categories.findIndex(category => category.id === payload.id)
	        Vue.set(state.categories, index, payload)
    	},
        updateCategoryIndex (state, payload) {
            state.categories = payload
        },
	    setDetailCategory (state, payload) {
	        state.detailCategory = payload
	    },
		addTask (state, payload) {
			// 違うカテゴリーだったら追加しない
			if (state.detailCategory.id !== payload.target_category) return
			state.detailCategory.tasks.push(payload)
		},
		deleteTask (state, payload) {
			// カテゴリー詳細
			const index = state.detailCategory.tasks.findIndex(task => task.id === payload.id)
			if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
	    },
		deleteTasks (state, payload) {
			for (const i in payload) {
				const index = state.detailCategory.tasks.findIndex(task => task.id === payload[i].id)
				if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
			}
		},
		updateTask (state, payload) {
			const index = state.detailCategory.tasks.findIndex(task => task.id === payload.id)
			Vue.set(state.detailCategory.tasks, index, payload)
		},
		updateTasks (state, payload) {
			state.detailCategory.tasks.splice(0, state.detailCategory.tasks.length)
			for (const j in payload) {
				state.detailCategory.tasks.push(payload[j])
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
			if (task === undefined) return
			task.sub_tasks.push(payload)
		},
		updateCompleteSubTasks (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			task.sub_tasks.splice(0, task.sub_tasks.length)
			task.sub_tasks.push(...payload.sub_tasks)
			task.complete_sub_tasks.splice(0, task.complete_sub_tasks.length)
			task.complete_sub_tasks.push(...payload.complete_sub_tasks)
		},
		updateSubTask (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			const index = task.sub_tasks.findIndex(sub => sub.id === payload.id)
			Vue.set(task.sub_tasks, index, payload)
			const i = task.complete_sub_tasks.findIndex(sub => sub.id === payload.id)
			if (i !== -1) Vue.set(task.complete_sub_tasks, i, payload)
		},
		deleteSubTask (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			const index = task.sub_tasks.findIndex(subtask => subtask.id === payload.id)
			if (index !== -1) task.sub_tasks = task.sub_tasks.filter((_, i) => i !== index)
			const j = task.complete_sub_tasks.findIndex(subtask => subtask.id === payload.id)
			if (j !== -1) task.complete_sub_tasks = task.complete_sub_tasks.filter((_, i) => i !== j)
		},
		deleteLabels (state, payload) {
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			for (const i in payload.delete_labels) {
				const index = task.label.findIndex(label => label.id === payload.delete_labels[i].id)
				if (index !== -1) task.label = task.label.filter((_, i) => i !== index)
			}
		},
		// タスクを複数追加。TODO id順にする？？
		addTasks (state, payload) {
			for (const i in payload) {
				state.detailCategory.tasks.push(payload[i])
			}
		},
		deleteCompleteTasks (state, payload) {
			for (const i in payload) {
				const index = state.detailCategory.complete_tasks.findIndex(task => task.id === payload[i].id)
				if (index !== -1) state.detailCategory.complete_tasks = state.detailCategory.complete_tasks.filter((_, i) => i !== index)
			}
		},
		destroySession (state) {
			for (const key in state) {
				if (Object.prototype.hasOwnProperty.call(initialState, key)) {
					state[key] = initialState[key]
				}
			}
			this.commit('setting/destorySession')
		},
		setTodaySchedule (state, payload) {
			state.todaySchedule = payload
			console.log(payload)
		},
		setFutureSchedule (state, payload) {
			state.futureSchedule = payload
		},
		setSearchResult (state, payload) {
			state.searchResult = payload
		},
		updateTodaySchedule (state, payload) {
		},
		updateFutureSchedule (state, payload) {
		},
		updateSearchResult (state, payload) {
		},
		deleteTodaySchedule (state, payload) {
		},
		deleteFutureSchedule (state, payload) {
		},
		deleteSearchResult (state, payload) {
		},
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
					this.commit('setCategories', res.data.categories)
					this.commit('setLabels', res.data.labels)
					this.commit('setting/setSetting', res.data.setting)
					resolve(res)
	        	})
	        	.catch(e => {
	        		console.log('初期データ取得失敗:', e.response)
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
	    getDetailCategoryAction (ctx, name) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
		            url: `/api/category/${name}/`,
		            method: 'GET'
		        })
		        .then(res => {
		            console.log('カテゴリー詳細', res)
		            // Ttile設定
		            setTitle(res.data.name)
		            this.commit('setDetailCategory', res.data)
					resolve(res)
		        })
		        .catch(e => {
		            console.log(e)
					reject(e)
		        })
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
		updateCompleteSubTasksAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/sub_task/complete/',
				method: 'PUT',
				data: {
					task_id: kwargs.task_id,
					compelete_sub_task_list: kwargs.compelete_sub_task_list
				}
			})
			.then(res => {
				console.log(res)
				this.commit('updateCompleteSubTasks', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		// タスク単体の完了状態を更新
		updateCompleteTaskAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/task/complete/',
				method: 'PUT',
				data: {
					complete_task: kwargs.complete_task,
				}
			})
			.then(res => {
				console.log(res)
				this.commit('deleteTask', res.data)
				this.commit('addCompleteTask', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		updateTaskDetailAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/task/change_task_detail/',
				method: 'PUT',
				data: {
					task_id: kwargs.task_id,
					[kwargs.key]: kwargs.value
				}
			})
			.then(res => {
				console.log(res)
				this.commit('updateTask', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		// 複数タスクの完了状態更新
		updateCompleteTasksAction (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				const CompleteTaskList = kwargs.complete_task_list
				const completed = kwargs.completed
				Vue.prototype.$axios({
					url: '/api/task/complete/',
					method: 'PUT',
					data: {
						complete_task_list: CompleteTaskList,
						completed: completed,
					}
				})
				.then(res => {
					console.log(res)
					if (completed) {
						this.commit('deleteTasks', res.data)
						this.commit('addCompleteTasks', res.data)
					} else {
						this.commit('deleteCompleteTasks', res.data)
						this.commit('addTasks', res.data)
					}
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		},
		getTodaySchedule (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/task/get_today_tasks/',
	        		method: 'GET',
				})
				.then(res => {
					console.log('今日のタスク', res)
					this.commit('setTodaySchedule', res.data)
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		},
		getFutureSchedule (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/task/get_future_tasks',
	        		method: 'GET',
				})
				.then(res => {
					console.log('来週までのタスク', res)
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		},
		getSearchResultAction (ctx, searchText) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/search',
					method: 'GET',
					params: {
						searchText: searchText
					}
				})
				.then(res => {
					console.log('検索結果', res)
					this.commit('setSearchResult', res.data)
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		},
		getFilteredSearchResult (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/task/get_filter_task_list/',
					method: 'GET',
					params: {
	                	...kwargs
	                }
				})
				.then(res => {
					console.log('フィルター掛けた検索結果', res)
					this.commit('setSearchResult', res.data)
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		}
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
