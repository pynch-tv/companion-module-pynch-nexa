const axios = require('axios')

module.exports = function (self) {

	const actions = [];
/*
	for (var key in self.config) {
		if (self.config.hasOwnProperty(key)) {
			self.log("debug", `action Key: ${key} Value: ${self.config[key]}` )
		}
	}
*/
	var outputChoices = []
	if (Array.isArray(self.config.outputs))
		self.config.outputs.forEach(output => {
			outputChoices.push({ id: output.id, label: output.id})
		});
	else
		self.log("error", `self.config.outputs is not an array` );

	var clipChoices = []
	if (Array.isArray(self.config.clips))
		self.config.clips.forEach(clip => {
			clipChoices.push({ id: clip.id, label: clip.id})
		});
	else
		self.log("error", `self.config.clips is not an array` )

	var statusChoices = []
	statusChoices.push({ id: "play", label: "Play"})
	statusChoices.push({ id: "stop", label: "Stop"})
	statusChoices.push({ id: "pause", label: "Pause"});

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

			self.log("info", `Action Load: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` );
			self.log("info", `Action Load: clipId ${clipId}` )

			try {
				body = { "clip" : { "id": clipId } }
				var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
			}
			catch (err)
			{
				console.log(err)
			}
		},
	}

	actions['status'] = {
		name: 'Status',
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
			},
			{
				type: 'dropdown',
				label: 'status',
				id: 'status',
				choices: statusChoices,
			}
		],
		callback: async (event) => {
			var serviceUrl = self.config.serviceUrl
			var serverId = self.config.serverId

			var outputId = event.options.outputId
			var status = event.options.status
			var speed = event.options.speed

			self.log("info", `Action Status: ${serviceUrl}/servers/${serverId}/outputs/${outputId}` )
			self.log("info", `Action Status: Status ${status} Speed: ${speed}` )

			try {
				body = { "status" : status, "speed": speed }
				var response = await axios.patch(`${serviceUrl}/servers/${serverId}/outputs/${outputId}`, body)
			}
			catch (err)
			{
				console.log(err)
			}
		},
	}

	self.setActionDefinitions(actions)
}
