const { combineRgb } = require('@companion-module/base')
const choices = require('./choices.js')

module.exports = {
	initPresets: async function () {
		let self = this;
		let presets = []

		const foregroundColor = combineRgb(255, 255, 255) // White
		const foregroundColorBlack = combineRgb(0, 0, 0) // Black
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorGreen = combineRgb(0, 255, 0) // Green
		const backgroundColorOrange = combineRgb(255, 102, 0) // Orange

		presets[`loadPlay`] = {
			type: 'button', // This must be 'button' for now
			category: 'Load and Play', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `My button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Load & Play`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'load',
							options: {
								outputId : choices.outputChoices[0].id,
								clipId : choices.clipChoices[0].id,
							},
						},
						{
							// add an action on down press
							actionId: 'play',
							options: {
								outputId : choices.outputChoices[0].id,
								speed: 100
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'outputState',
					options: {
						outputId : choices.outputChoices[0].id,
						status: 'play',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], 
		}

		presets[`load`] = {
			type: 'button', // This must be 'button' for now
			category: 'Load', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `My button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Load`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'load',
							options: {
								outputId : choices.outputChoices[0].id,
								clipId : choices.clipChoices[0].id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'outputState',
					options: {
						outputId : choices.outputChoices[0].id,
						status: 'play',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], 
		}

		presets[`play`] = {
			type: 'button', // This must be 'button' for now
			category: 'Play', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
			name: `My button`, // A name for the preset. Shown to the user when they hover over it
			style: {
				// This is the minimal set of style properties you must define
				text: `Play`, // You can use variables from your module here
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							// add an action on down press
							actionId: 'play',
							options: {
								outputId : choices.outputChoices[0].id,
								speed: 100
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'outputState',
					options: {
						outputId : choices.outputChoices[0].id,
						status: 'play',
					},
					style: {
						// The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
				},
			], 
		}

		self.setPresetDefinitions(presets);
	}
}	