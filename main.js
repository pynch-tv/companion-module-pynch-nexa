const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const axios = require('axios')

class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		await this.configUpdated(config)
	}

	// When module gets deleted
	async destroy() {
		this.updateStatus(InstanceStatus.Disconnected, 'Disabled')
		this.log('debug', 'Destroyed')
	}

	async configUpdated(config) {
		this.config = config;
		await this.init_nexa()
	}

	async init_nexa()
	{
//		for (var key in this.config) {
//			if (this.config.hasOwnProperty(key)) {
//				this.log("debug", `init Key: ${key} Value: ${this.config[key]}` )
//			}
//		}

		if (this.config.serviceUrl && this.config.serverId)
		{
			this.updateStatus(InstanceStatus.Connecting)

			let serviceUrl = this.config.serviceUrl
			let serverId = this.config.serverId

			try {
				var response = await axios.get(`${serviceUrl}/events`)
				{
					var eventUri = this.getUriFromEvents(response.data.events, "ws");
					this.log("debug", `uri to event ${eventUri}`);
	
					var tt = new WebSocket(eventUri);
					this.log("debug", `webSocket ${tt}`);
	
					tt.onopen = () => {}
				}
	
				var response = await axios.get(`${serviceUrl}/servers/${serverId}`)
				{
					var clipsUri   = this.getUriFromLinkHeader(response, "clips")
					var outputsUri = this.getUriFromLinkHeader(response, "outputs")
	
					if (!clipsUri || !outputsUri) throw new Error("uri to clips or outputs not found in link response header")
	
					this.log("debug", `uri to clips ${clipsUri}`);
					this.log("debug", `uri to outputs ${outputsUri}`);
				}
	
				response = await axios.get(`${outputsUri}?f=json&properties=id,name`)
				{
					this.config.outputs = response.data.outputs
	
					for (const link of this.config.outputs)
						this.log("info", `${serverId} Outputs ${link.id}`)
				}
	
				response = await axios.get(`${clipsUri}?f=json&properties=id,name`)
				{
					this.config.clips = response.data.clips
	
					for (const link of this.config.clips)
						this.log("info", `${serverId} Clips ${link.id}`)
				}

				this.updateActions() // export actions

				this.updateStatus(InstanceStatus.Ok)
			}
			catch (err)
			{
				this.log("error", `${err}`)
	
				this.updateStatus(InstanceStatus.ConnectionFailure)
			}
	
		}
		else
			this.updateStatus(InstanceStatus.BadConfig)
	}

	// Return config fields for web config
	getConfigFields() {

		return [
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
				type: 'checkbox',
				id: 'usernamePassword',
				label: 'Nexa requires credentials',
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
				label: 'AudioVideo Server identifier',
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

	getUriFromEvents(events, rel)
	{
		for (const event of events) 
			if (event.rel === rel) 
				return event.href
		return ""
	}

	getUriFromLinkHeader(response, relation) {
		var links = response.headers.link.split(",").map(function (value) { return value.trim();})
		for (const link of links) {
			var elements = link.split(";").map(function (value) { return value.trim(); })
			var index = elements.indexOf(`rel="${relation}"`)
			if (index >= 0) {
				index = elements.findIndex((element) => element.startsWith('<'))
				if (index >= 0)
					return elements[index].slice(1,-1)
			}
		};
		return "";
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
