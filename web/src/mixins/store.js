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

const getExpiredTask = (state, taskId) => {
	return state.todaySchedule.expired_tasks.find(task => task.id === taskId)
}

const getTodaysTask = (state, taskId) => {
	return state.todaySchedule.today_tasks.find(task => task.id === taskId)
}

const getFutureTask = (state, taskId) => {
	let task
	for (const key in state.futureSchedule) {
		task = state.futureSchedule[key].find(task => task.id === taskId)
		if (task !== undefined) break
	}
	return task
}

export const globalStoreMixins = {
    methods: {
        addEachRouteSubTask,
        deleteEachRouteSubTask,
        updateEachRouteCompleteSubTask,
        updateEachRouteSubTask,
    }
}
