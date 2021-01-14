import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedstate from 'vuex-persistedstate'
import { setTitle } from '@/mixins'
import {
	addEachRouteSubTask,
	deleteEachRouteSubTask,
	updateEachRouteCompleteSubTask,
	updateEachRouteSubTask,
	deleteEachRouteTaskData,
	updateEachRouteTask,
	updateEachRouteTaskLabel,
	deleteEachRouteTaskLabels,
	updateIsCompletedTaskStatus,
	updateCompleteTask,
	updateSortedTaskList
} from '@/store/utils'

import setting from './setting'

Vue.use(Vuex)

const initialState = {
	categories: [],
	labels: [],
	detailCategory: {},
	todaySchedule: [],
	futureSchedule: [],
	searchResult: [],
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
		updateTaskLabel (state, payload) {
			updateEachRouteTaskLabel(state, payload)
			// タスクのラベルを更新
			if (state.detailCategory.tasks === undefined) return
			const task = state.detailCategory.tasks.find(task => task.id === payload.id)

			if (task === undefined) return
			task.label = []
			for (const i in payload.label) {
				task.label.push(payload.label[i])
			}
		},
		updateLabel (state, payload) {
			console.log('updateLabel', payload)
			const index = state.labels.findIndex(label => label.id === payload.id)
			Vue.set(state.labels, index, payload)
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
		addTaskEachRoute (state, payload) {
			// TODO
		},
		deleteTask (state, payload) {
			// カテゴリー詳細
			deleteEachRouteTaskData(state, payload)
			const task = payload.task
			if (state.detailCategory.tasks !== undefined) {
				const index = state.detailCategory.tasks.findIndex(target => target.id === task.id)
				if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
			}
	    },
		updateCompleteStatus (state, payload) {
			updateCompleteTask(state, payload)
		},
		deleteTasks (state, payload) {
			deleteEachRouteTaskData(state, payload)
			const task = payload.task
			if (state.detailCategory.is_completed_task) return
			if (state.detailCategory.tasks !== undefined) {
				for (const i in task) {
					const index = state.detailCategory.tasks.findIndex(target => target.id === task[i].id)
					if (index !== -1) state.detailCategory.tasks = state.detailCategory.tasks.filter((_, i) => i !== index)
				}
			}
		},
		updateTask (state, payload) {
			updateEachRouteTask(state, payload)
			const task = payload.task
			const index = state.detailCategory.tasks.findIndex(target => target.id === task.id)
			Vue.set(state.detailCategory.tasks, index, task)
		},
		updateTaskEachRoute (state, payload) {
			updateEachRouteTask(state, payload)
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
			addEachRouteSubTask(state, payload)
			if (state.detailCategory.tasks === undefined) return

			const subtask = payload.subtask
			const task = state.detailCategory.tasks.find(task => task.id === subtask.target_task)
			if (task === undefined) return
			task.sub_tasks.push(subtask)
		},
		updateCompleteSubTasks (state, payload) {
			updateEachRouteCompleteSubTask(state, payload)
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			task.sub_tasks.splice(0, task.sub_tasks.length)
			task.sub_tasks.push(...payload.sub_tasks)
			task.complete_sub_tasks.splice(0, task.complete_sub_tasks.length)
			task.complete_sub_tasks.push(...payload.complete_sub_tasks)
		},
		updateSubTask (state, payload) {
			updateEachRouteSubTask(state, payload)
			const subtask = payload.subtask
			const task = state.detailCategory.tasks.find(task => task.id === subtask.target_task)
			if (task === undefined) return
			const index = task.sub_tasks.findIndex(sub => sub.id === subtask.id)
			Vue.set(task.sub_tasks, index, subtask)
			const i = task.complete_sub_tasks.findIndex(sub => sub.id === subtask.id)
			if (i !== -1) Vue.set(task.complete_sub_tasks, i, subtask)
		},
		deleteSubTask (state, payload) {
			deleteEachRouteSubTask(state, payload)
			if (state.detailCategory.tasks === undefined) return

			const subtask = payload.subtask
			const task = state.detailCategory.tasks.find(task => task.id === subtask.target_task)
			if (task === undefined) return
			const index = task.sub_tasks.findIndex(target => target.id === subtask.id)
			if (index !== -1) task.sub_tasks = task.sub_tasks.filter((_, i) => i !== index)
			const j = task.complete_sub_tasks.findIndex(target => target.id === subtask.id)
			if (j !== -1) task.complete_sub_tasks = task.complete_sub_tasks.filter((_, i) => i !== j)
		},
		deleteTaskLabels (state, payload) {
			deleteEachRouteTaskLabels(state, payload)
			if (state.detailCategory.tasks === undefined) return
			const task = state.detailCategory.tasks.find(task => task.id === payload.target_task)
			if (task === undefined) return
			for (const i in payload.delete_labels) {
				const index = task.label.findIndex(label => label.id === payload.delete_labels[i].id)
				if (index !== -1) task.label = task.label.filter((_, i) => i !== index)
			}
		},
		deleteLabel (state, payload) {
			console.log('deleteLabel', payload)
			const index = state.labels.findIndex(label => label.id === payload.id)
			if (index !== -1) state.labels = state.labels.filter((_, i) => i !== index)
		},
		// タスクを複数追加。TODO id順にする？？
		addTasks (state, payload) {
			const task = payload.task
			for (const i in task) {
				state.detailCategory.tasks.push(task[i])
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
			console.log('setTodaySchedule', state.todaySchedule)
		},
		setFutureSchedule (state, payload) {
			state.futureSchedule = payload
			console.log('setFutureSchedule', state.futureSchedule)
		},
		setSearchResult (state, payload) {
			state.searchResult = payload
			console.log('setSearchResult', state.searchResult)
		},
		setSearchResultTasks (state, payload) {
			state.searchResult.tasks = payload
			console.log('setSearchResult', state.searchResult)
		},
		updateIsCompletedTask (state, payload) {
			updateIsCompletedTaskStatus(state, payload)
		},
		updateSortedTasks (state, payload) {
			updateSortedTaskList(state, payload)
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
		addLabelAction (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/label/',
					method: 'POST',
					data: {
						name: kwargs.name
					}
				})
				.then(res => {
					console.log('ラベル作成成功', res)
					this.commit('addLabel', res.data)
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
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
	    deleteTaskAction (ctx, kwargs) {
	        Vue.prototype.$axios({
	            url: `/api/task/${kwargs.id}/`,
	            method: 'DELETE',
	        })
	        .then(res => {
	            console.log(res)
				const data = {
					task: res.data,
					route: kwargs.route
				}
	            this.commit('deleteTask', data)
	        })
	        .catch(e => {
	            console.log(e)
	        })
	    },
		deleteSubTaskAction (ctx, kwargs) {
	        Vue.prototype.$axios({
	            url: `/api/sub_task/${kwargs.id}/`,
	            method: 'DELETE',
				data: {}
	        })
	        .then(res => {
				const data = {
					subtask: res.data,
					route: kwargs.route,
				}
	            this.commit('deleteSubTask', data)
	        })
	        .catch(e => {
	            console.log(e)
	        })
	    },
		// タスク更新
		updateTaskAction (ctx, kwargs) {
			this.commit('updateTask', kwargs)
		},
		deleteTaskLabelsAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: '/api/label/deleteTaskLabels/',
				method: 'DELETE',
				data: {
					task_id: kwargs.task_id,
					delete_label_list: kwargs.delete_label_list
				}
			})
			.then(res => {
				console.log(res)
				const data = {
					...res.data,
					route: kwargs.route
				}
				this.commit('deleteTaskLabels', data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		deleteLabelAction (ctx, kwargs) {
			Vue.prototype.$axios({
				url: `/api/label/${kwargs.id}`,
				method: 'DELETE',
				data: {
					...kwargs
				}
			})
			.then(res => {
				console.log(res)
				this.commit('deleteLabel', kwargs)
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
				res.data.route = kwargs.route
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
				const data = {
					task: res.data,
					route: kwargs.route
				}
				this.commit('updateCompleteStatus', data)
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
				const data = {
					task: res.data,
					route: kwargs.route
				}
				this.commit('updateTask', data)
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
					const data = {
						task: res.data,
						route: kwargs.route
					}
					if (completed) {
						this.commit('deleteTasks', data)
						this.commit('addCompleteTasks', res.data)
					} else {
						this.commit('deleteCompleteTasks', res.data)
						this.commit('addTasks', data)
					}
					resolve(res)
				})
				.catch(e => {
					console.log(e)
					reject(e)
				})
			})
		},
		updateLabelAction (ctx, kwargs) {
			console.log('updateLabelAction', kwargs)
			Vue.prototype.$axios({
				url: `/api/label/${kwargs.id}/`,
				method: 'PUT',
				data: {
					...kwargs
				}
			})
			.then(res => {
				console.log('ラベル更新成功', res)
				this.commit('updateLabel', res.data)
			})
			.catch(e => {
				console.log(e)
			})
		},
		getTodaySchedule (ctx, kwargs) {
			return new Promise((resolve, reject) => {
				Vue.prototype.$axios({
					url: '/api/task/get_today_tasks/',
	        		method: 'GET',
				})
				.then(res => {
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
	                	...kwargs,
	                }
				})
				.then(res => {
					console.log('フィルター掛けた検索結果', res)
					this.commit('setSearchResultTasks', res.data)
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
