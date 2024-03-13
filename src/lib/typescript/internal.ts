export let afterPbInit = {
	_tasks: [() => null],
	_isPbInit: false,

	pbIsInit: function () {
		// @ts-ignore
		this._tasks.forEach(task => task())
		this._isPbInit = true
	},

	addTask: function (task: () => any) {
		if (this._isPbInit) {
			task()
		} else {
			this._tasks.push(task)
		}
	},
}
