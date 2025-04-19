const { combineRgb } = require('@companion-module/base')
const choices = require('./choices.js')

module.exports = {

	initFeedbacks: function (self) {

		var outputChoices = []
		self.outputs.forEach(output => {
			outputChoices.push({ id: output.id, label: output.id})
		});

		const feedbacks = [];

		feedbacks['outputState'] =
		{
			name: 'Output status',
			type: 'boolean',
			description: 'Set feedback based on output status',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'outputId',
					choices: choices.outputChoices,
					default: choices.outputChoices[0].id,
				},
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					choices: choices.outputStatusChoices,
					default: choices.outputStatusChoices[0].id,
				},
			],
			callback: ({options}) => {
				const output = choices.outputChoices.find(output => output.id === options.outputId)
		//		self.log("debug", `---=====---- ${options.status} ${output.status}` )
				return false;//options.status === output.status
			},
		}

		return feedbacks
	}
}