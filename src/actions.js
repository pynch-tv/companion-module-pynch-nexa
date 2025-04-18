const axios = require('axios')
  
module.exports = {
	  
	initActions: function () {
		let self = this;
	
		const maxShuttle = 5000

		class AsyncLock {
			constructor () {
				this.disable = () => {}
				this.promise = Promise.resolve()
			}
			
			enable () {
				this.promise = new Promise(resolve => this.disable = resolve)
			}
		}
	
		const lock = new AsyncLock()

		const actions = [];
	/*
		for (var key in self.config) {
			if (self.config.hasOwnProperty(key)) {
				self.log("debug", `action Key: ${key} Value: ${self.config[key]}` )
			}
		}
	*/

		var outputStatusChoices = []
		outputStatusChoices.push({ id: "play", label: "Play"})
		outputStatusChoices.push({ id: "stop", label: "Stop"})
		outputStatusChoices.push({ id: "pause", label: "Pause"})

		var inputStatusChoices = []
		inputStatusChoices.push({ id: "record", label: "Record"})
		inputStatusChoices.push({ id: "stop", label: "Stop"})


		if (self.outputs)
		{
			var clipChoices = []
			self.clips.forEach(clip => {
				clipChoices.push({ id: clip.id, label: clip.id})
			});

			var outputChoices = []
			self.outputs.forEach(output => {
				outputChoices.push({ id: output.id, label: output.id})
			});

			actions['load'] = {
				name: 'Load',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
					{
						type: 'dropdown',
						label: 'Clip',
						id: 'clipId',
						choices: clipChoices,
					},
				],
				callback: async (event) => {

					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId

					var outputId = event.options.outputId
					var clipId = event.options.clipId

					self.log("info", `Action Load: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Load: clipId ${clipId}` )

					try {
						await lock.promise
						lock.enable()

						body = { "clip" : { "id": clipId } }
						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
						self.log("info", `Load response ${response.status}` )

					//	await new Promise(r => setTimeout(r, 2000));

						lock.disable()
					}
					catch (err)
					{
						console.log(err)
					}

					self.log("info", `Action Load done` )
				},
			}

			actions['play'] = {
				name: 'Play',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
					{
						type: 'number',
						label: 'Speed %',
						id: 'speed',
						default: 100,
						min: 0 - maxShuttle,
						max: maxShuttle,
						range: true,
					},
				],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId
		
					var outputId = event.options.outputId
					var status = "play"
					var speed = event.options.speed
		
					self.log("info", `Action Play: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Play: Status ${status} Speed: ${speed}` )
		
					try {
						await lock.promise
						lock.enable()

						body = { "status" : status, "speed": speed }
						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
						self.log("info", `Play response ${response.status}` )

						lock.disable()
					}
					catch (err)
					{
						self.log("error", err)
					}

					self.log("info", `Action Play done` )
				},
			},
		
			actions['stop'] = {
				name: 'Stop',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
				],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId
		
					var outputId = event.options.outputId
					var status = "stop"
		
					self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Status: Status ${status} ` )
		
					try {
						body = { "status" : status }
//						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
					}
					catch (err)
					{
						console.log(err)
					}
				},
			},

			actions['shuttle'] = {
				name: 'Shuttle',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
					{
						type: 'number',
						label: 'Speed %',
						id: 'speed',
						default: 100,
						min: -400,
						max: 400
					},
			],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId
		
					var outputId = event.options.outputId
					var status = "stop"
		
					self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Status: Status ${status} ` )
		
					try {
						body = { "status" : status }
//						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
					}
					catch (err)
					{
						console.log(err)
					}
				},
			},

			actions['jog'] = {
				name: 'Jog',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
					{
						type: 'number',
						label: 'TC',
						id: 'tc',
						default: "00:00:00:01"
					},
				],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId
		
					var outputId = event.options.outputId
					var status = "stop"
		
					self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Status: Status ${status} ` )
		
					try {
						body = { "status" : status }
//						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
					}
					catch (err)
					{
						console.log(err)
					}
				},
			},

			actions['goto'] = {
				name: 'Goto',
				options: [
					{
						type: 'dropdown',
						label: 'Output',
						id: 'outputId',
						choices: outputChoices,
					},
					{
						type: 'number',
						label: 'TC',
						id: 'tc',
						default: "00:00:00:01"
					},
				],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId
		
					var outputId = event.options.outputId
					var status = "stop"
		
					self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
					self.log("info", `Action Status: Status ${status} ` )
		
					try {
						body = { "status" : status }
//						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
					}
					catch (err)
					{
						console.log(err)
					}
				},
			}

		
		}

		if (self.inputs)
		{
			var inputChoices = []
			self.inputs.forEach(input => {
				inputChoices.push({ id: input.id, label: input.id})
			});

			actions['input'] = {
				name: 'Record',
				options: [
					{
						type: 'dropdown',
						label: 'Input',
						id: 'inputId',
						choices: inputChoices,
					},
				],
				callback: async (event) => {
					var serviceUrl = self.config.serviceUrl
					var serverId = self.config.serverId

					var inputId = event.options.inputId

					self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/inputs/${inputId}` )

					try {
						body = { "status" : "record" }
//						var response = await axios.patch(`${serviceUrl}/servers/${serverId}/inputs/${inputId}`, body)
					}
					catch (err)
					{
						console.log(err)
					}
				},
			}
		}

		self.setActionDefinitions(actions)
	}
}
