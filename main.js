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
		this.config = config

/*		for (var key in this.config) {
			if (this.config.hasOwnProperty(key)) {
				console.log("debug", `action key: ${key} ` )
			}
		}
*/

		this.updateStatus(InstanceStatus.Connecting)

		var serviceUrl = this.config.serviceUrl
		var serverId = this.config.serverId;

		this.log("info", `init serviceUrl: ${serviceUrl} serverId: ${serverId}`)

		try {
			var response = await axios.get(`${serviceUrl}/servers/${serverId}/outputs?f=json&properties=id,name`)
			this.config.outputs = response.data.outputs

			this.log("info", `Outputs count: ${response.data.outputs.length}`)

			response = await axios.get(`${serviceUrl}/servers/${serverId}/clips?f=json&properties=id,name`)
			this.config.clips = response.data.clips

			this.log("info", `Clips count: ${response.data.clips.length}`)
		}
		catch (err)
		{
			this.log("error", `${err}`);
		}

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		this.updateStatus(InstanceStatus.Ok);
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config;
	}

	// Return config fields for web config
	getConfigFields() {

		return [
			{
				type: 'static-text',
				id: 'aaa-filler',
				width: 12,
				label: 'Important:',
				value: 'For this module to work correctly, a Nexa server must be running on the network. Download the latest version from https://pynch-tv/nexa',
			},
			{
				type: 'bonjour-device',
				id: 'bonjourHost',
				label: 'IP and Port of the Nexa service',
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
				type: 'textinput',
				id: 'serviceUrl',
				width: 6,
				label: 'ServiceUrl path',
			},
			{
				type: 'static-text',
				id: 'filler3',
				width: 6,
				label: '',
			},
			{
				type: 'textinput',
				id: 'serverId',
				width: 6,
				label: 'Server',
			},
			{
				type: 'static-text',
				id: 'filler4',
				width: 6,
				label: '',
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
