import Vue from 'vue'

export const addEachRouteSubTask = (state, payload) => {
	const subtask = payload.subtask
	const route = payload.route
	switch (route) {
		case 'SearchResult': {
			const task = getSearchResultTask(state, subtask.target_task)
			task.sub_tasks.push(subtask)
			break
		}
		case 'TodaySchedule': {
			const eTask = getExpiredTask(state, subtask.target_task)
			if (eTask !== undefined) eTask.sub_tasks.push(subtask)
			const tTask = getTodaysTask(state, subtask.target_task)
			if (tTask !== undefined) tTask.sub_tasks.push(subtask)
			break
		}
		case 'FutureSchedule': {
			const fTask = getFutureTask(state, subtask.target_task)
			fTask.sub_tasks.push(subtask)
			break
		}
		default:
	}
}

export const deleteEachRouteSubTask = (state, payload) => {
	const subtask = payload.subtask
	const route = payload.route
	switch (route) {
		case 'SearchResult': {
			const task = getSearchResultTask(state, subtask.target_task)
			if (task === undefined) return
			const index = task.sub_tasks.findIndex(target => target.id === subtask.id)
			if (index !== -1) task.sub_tasks = task.sub_tasks.filter((_, i) => i !== index)
			const j = task.complete_sub_tasks.findIndex(target => target.id === subtask.id)
			if (j !== -1) task.complete_sub_tasks = task.complete_sub_tasks.filter((_, i) => i !== j)
			break
		}
		case 'TodaySchedule': {
			const eTask = getExpiredTask(state, subtask.target_task)
			if (eTask !== undefined) {
				const eIndex = eTask.sub_tasks.findIndex(target => target.id === subtask.id)
				if (eIndex !== -1) eTask.sub_tasks = eTask.sub_tasks.filter((_, i) => i !== eIndex)
				const j = eTask.complete_sub_tasks.findIndex(target => target.id === subtask.id)
				if (j !== -1) eTask.complete_sub_tasks = eTask.complete_sub_tasks.filter((_, i) => i !== j)
			}

			const tTask = getTodaysTask(state, subtask.target_task)
			if (tTask !== undefined) {
				const tIndex = tTask.sub_tasks.findIndex(target => target.id === subtask.id)
				if (tIndex !== -1) tTask.sub_tasks = tTask.sub_tasks.filter((_, i) => i !== tIndex)
				const j = tTask.complete_sub_tasks.findIndex(target => target.id === subtask.id)
				if (j !== -1) tTask.complete_sub_tasks = tTask.complete_sub_tasks.filter((_, i) => i !== j)
			}
			break
		}
		case 'FutureSchedule': {
			const fTask = getFutureTask(state, subtask.target_task)
			if (fTask === undefined) return
			const index = fTask.sub_tasks.findIndex(target => target.id === subtask.id)
			if (index !== -1) fTask.sub_tasks = fTask.sub_tasks.filter((_, i) => i !== index)
			const j = fTask.complete_sub_tasks.findIndex(target => target.id === subtask.id)
			if (j !== -1) fTask.complete_sub_tasks = fTask.complete_sub_tasks.filter((_, i) => i !== j)
			break
		}
		default:
	}
}

export const updateEachRouteCompleteSubTask = (state, payload) => {
	const route = payload.route
	switch (route) {
		case 'SearchResult': {
			const task = getSearchResultTask(state, payload.target_task)
			updateCompleteSubTaskData(task, payload)
			break
		}
		case 'TodaySchedule': {
			const eTask = getExpiredTask(state, payload.target_task)
			const tTask = getTodaysTask(state, payload.target_task)
			updateCompleteSubTaskData(eTask, payload)
			updateCompleteSubTaskData(tTask, payload)
			break
		}
		case 'FutureSchedule': {
			const fTask = getFutureTask(state, payload.target_task)
			updateCompleteSubTaskData(fTask, payload)
			break
		}
		default:
	}
}

export const updateEachRouteSubTask = (state, payload) => {
	const subtask = payload.subtask
	const route = payload.route
	switch (route) {
		case 'SearchResult': {
			const task = getSearchResultTask(state, subtask.target_task)
            updateSubTaskData(task, subtask)
			break
		}
		case 'TodaySchedule': {
			const eTask = getExpiredTask(state, subtask.target_task)
			const tTask = getTodaysTask(state, subtask.target_task)
            updateSubTaskData(eTask, subtask)
            updateSubTaskData(tTask, subtask)
			break
		}
		case 'FutureSchedule': {
			const fTask = getFutureTask(state, subtask.target_task)
            updateSubTaskData(fTask, subtask)
			break
		}
		default:
	}
}

export const deleteEachRouteTaskData = (state, payload) => {
	const task = payload.task
	const route = payload.route
	if (Array.isArray(task)) {
		deleteEachRouteTasks(state, task, route)
	} else {
		deleteEachRouteTask(state, task, route)
	}
}

export const deleteEachRouteTask = (state, task, route) => {
	switch (route) {
		case 'SearchResult': {
			const index = getSearchResultTaskIndex(state, task.id)
			if (index !== -1) state.searchResult = state.searchResult.filter((_, i) => i !== index)
			break
		}
		case 'TodaySchedule': {
			const eIndex = getExpiredTaskIndex(state, task.id)
			const tIndex = getTodaysTaskIndex(state, task.id)
			if (eIndex !== -1) state.todaySchedule.expired_tasks = state.todaySchedule.expired_tasks.filter((_, i) => i !== eIndex)
			if (tIndex !== -1) state.todaySchedule.today_tasks = state.todaySchedule.today_tasks.filter((_, i) => i !== tIndex)
			break
		}
		case 'FutureSchedule': {
			const res = getFutureTaskIndex(state, task.id)
			if (!Object.keys(res).length === false) {
				const index = res.index
				const key = res.key
				state.futureSchedule[key] = state.futureSchedule[key].filter((_, i) => i !== index)
				if (state.futureSchedule[key].length === 0) delete state.futureSchedule[key]
			}
			break
		}
		default:
	}
}

export const deleteEachRouteTasks = (state, tasks, route) => {
	for (const i in tasks) {
		deleteEachRouteTask(state, tasks[i], route)
	}
}

export const updateEachRouteTask = (state, payload) => {
	const task = payload.task
	const route = payload.route
	switch (route) {
		case 'SearchResult': {
			const index = getSearchResultTaskIndex(state, task.id)
			Vue.set(state.searchResult, index, task)
			break
		}
		case 'TodaySchedule': {
			const eIndex = getExpiredTaskIndex(state, task.id)
			const tIndex = getTodaysTaskIndex(state, task.id)
			if (eIndex !== -1) Vue.set(state.todaySchedule.expired_tasks, eIndex, task)
			if (tIndex !== -1) Vue.set(state.todaySchedule.today_tasks, tIndex, task)
			break
		}
		case 'FutureSchedule': {
			const res = getFutureTaskIndex(state, task.id)
			if (!Object.keys(res).length === false) {
				const index = res.index
				const key = res.key
				Vue.set(state.futureSchedule[key], index, task)
			}
			break
		}
		default:
	}
}

const updateSubTaskData = (task, subtask) => {
    if (task === undefined) return

    const index = task.sub_tasks.findIndex(sub => sub.id === subtask.id)
    Vue.set(task.sub_tasks, index, subtask)
    const i = task.complete_sub_tasks.findIndex(sub => sub.id === subtask.id)
    if (i !== -1) Vue.set(task.complete_sub_tasks, i, subtask)
}

const updateCompleteSubTaskData = (task, payload) => {
	if (task === undefined) return

	task.sub_tasks.splice(0, task.sub_tasks.length)
	task.sub_tasks.push(...payload.sub_tasks)
	task.complete_sub_tasks.splice(0, task.complete_sub_tasks.length)
	task.complete_sub_tasks.push(...payload.complete_sub_tasks)
}

const getSearchResultTask = (state, taskId) => {
	return state.searchResult.find(task => task.id === taskId)
}

const getSearchResultTaskIndex = (state, taskId) => {
	return state.searchResult.findIndex(task => task.id === taskId)
}

const getExpiredTask = (state, taskId) => {
	return state.todaySchedule.expired_tasks.find(task => task.id === taskId)
}

const getExpiredTaskIndex = (state, taskId) => {
	return state.todaySchedule.expired_tasks.findIndex(task => task.id === taskId)
}

const getTodaysTask = (state, taskId) => {
	return state.todaySchedule.today_tasks.find(task => task.id === taskId)
}

const getTodaysTaskIndex = (state, taskId) => {
	return state.todaySchedule.today_tasks.findIndex(task => task.id === taskId)
}

const getFutureTask = (state, taskId) => {
	let task
	for (const key in state.futureSchedule) {
		task = state.futureSchedule[key].find(task => task.id === taskId)
		if (task !== undefined) break
	}
	return task
}

const getFutureTaskIndex = (state, taskId) => {
	const res = {}
	for (const key in state.futureSchedule) {
		const index = state.futureSchedule[key].findIndex(task => task.id === taskId)
		if (index !== undefined && index !== -1) {
			res.index = index
			res.key = key
		}
	}
	return res
}
