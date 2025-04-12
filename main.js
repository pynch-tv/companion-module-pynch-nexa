const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')
const UpdateActions = require('./src/actions')
const UpdateFeedbacks = require('./src/feedbacks')
const UpdateVariableDefinitions = require('./src/variables')
const axios = require('axios')

class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.log("info", "Initializing module with config:", config);
		this.config = config || {}

		this.updateStatus(InstanceStatus.Connecting)

		var self = this

		var host = self.config.bonjourHost || self.config.host
		var serverId = self.config.serverId

		var response = await axios.get(`http://${host}/v1/servers/${serverId}/outputs?f=json&properties=id,name`)
		self.config.outputs = response.data.outputs

		response = await axios.get(`http://${host}/v1/servers/${serverId}/clips?f=json&properties=id,name`)
		self.config.clips = response.data.clips

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		self.updateStatus(InstanceStatus.Ok);
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.log("info", "Config updated:", config);
		this.config = config || {};
		this.log("info", "Config updated:", config.bonjourHost);
	}

	// Return config fields for web config
	getConfigFields() {

		return [
			{
				type: 'static-text',
				id: 'aaa-filler',
				width: 12,
				label: 'Important:',
				value: 'For this module to work correctly, a Nexa server must be running on the network. Download the latest version https://github.com/pynch-tv/Nexa.',
			},
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
				type: 'checkbox',
				id: 'usernamePassword',
				label: 'Require Username Password',
				width: 6,
				default: false,
			},
			{
				type: 'static-text',
				id: 'require-filler',
				width: 6,
				label: '',
				value: '',
			},
			{
				type: 'textinput',
				id: 'username',
				width: 6,
				label: 'Username',
				value: '',
				isVisible: (options) => options['usernamePassword'],
			},
			{
				type: 'textinput',
				id: 'password',
				width: 6,
				label: 'Password',
				value: '',
				isVisible: (options) => options['usernamePassword'],
			},
			{
				type: 'textinput',
				id: 'serverId',
				width: 6,
				label: 'Server',
			}	
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
