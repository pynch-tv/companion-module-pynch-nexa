const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const bonjour = require('bonjour')()

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.log('debug', 'init')

//		bonjour.find({ type: 'http' }, function (service) {
//					console.log('debug', 'Found an OpenGate server:'+ service) // TODO: add Collection buttons
//					var serviceRootUrl = `${service.txt.protocol}://${service.addresses[0]}:${service.port}${service.txt.rootpath}/`
//					//servers.push(serviceRootUrl)
//				})

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'bonjour-device',
				id: 'bonjourHost',
				label: 'LandingPage URL of the Nexa service',
				width: 6,
			},	
			{
				type: 'textinput',
				id: 'host',
				label: 'Nexa URL',
				width: 6,
				regex: Regex.URL,
				isVisible: (options) => !options['bonjourHost'],
			},
			{
				type: 'static-text',
				id: 'host-filler',
				width: 6,
				label: '',
				value: '',
				isVisible: (options) => !!options['bonjourHost'],
			},
			{
				type: 'dropdown',
				id: 'serverId',
				label: 'Server',
				width: 6,
				choices: [{ id: '1', label: 'aaaaa'}, { id: '2', label: 'bbbbb'}],
			},
			{
				type: 'static-text',
				id: 'server-filler',
				width: 6,
				label: '',
				value: '',
			},
			{
				type: 'dropdown',
				id: 'outputId',
				label: 'Output',
				width: 6,
				choices: [{ id: 'PGM1', label: 'PGM1'}, { id: 'PGM2', label: 'PGM2'}, { id: 'PGM3', label: 'PGM3'}],
			},
			{
				type: 'static-text',
				id: 'output-filler',
				width: 6,
				label: '',
				value: '',
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
