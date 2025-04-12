const axios = require('axios')

module.exports = function (self) {

	const actions = [];

	var outputChoices = []
	self.config.outputs.forEach(output => {
		outputChoices.push({ id: output.id, label: output.id})
	});

	var clipChoices = []
	self.config.clips.forEach(clip => {
		clipChoices.push({ id: clip.id, label: clip.id})
	});

	var statusChoices = []
	statusChoices.push({ id: "play", label: "Play"})
	statusChoices.push({ id: "stop", label: "Stop"})
	statusChoices.push({ id: "pause", label: "Pause"})
	statusChoices.push({ id: "rewind", label: "Rewind"})

	actions['output'] = {
		name: 'Status',
		options: [
			{
				type: 'dropdown',
				label: 'Output',
				id: 'outputId',
				choices: outputChoices,
			},
/*			{
				type: 'dropdown',
				label: 'Clip',
				id: 'clipId',
				choices: clipChoices,
			},
*/			{
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
		callback: async ({ options }) => {

			var host = self.config.bonjourHost || self.config.host

			// options.speed

			body = { "status" : options.status, "speed": options.speed }
			var response = await axios.patch(`http://${host}/v1/servers/${self.config.serverId}/outputs/${options.outputId}`, body)
		},
	}

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
		callback: async ({ options }) => {

			var host = self.config.bonjourHost || self.config.host

			// options.speed

			body = { "clip" : { "id": options.clipId } }
			var response = await axios.patch(`http://${host}/v1/servers/${self.config.serverId}/outputs/${options.outputId}`, body)
		},
	}

	self.setActionDefinitions(actions)
}
