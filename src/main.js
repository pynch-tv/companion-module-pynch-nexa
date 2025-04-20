const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')

const config = require('./config');
const actions = require('./actions')
const feedbacks = require('./feedbacks')
const variables = require('./variables')
const presets = require('./presets')
const choices = require('./choices')

const utils = require('./utils');
const events = require('./serverEvents')

const axios = require('axios')

class ModuleInstance extends InstanceBase {

	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...variables,
			...actions,
			...presets,
			...feedbacks,
			...utils,
			...events,
		})
	}

	async init(config) {
		this.config = config

		this.initVariables()

		await this.configUpdated(config)
	}

	// When module gets deleted 
	async destroy() {
		this.updateStatus(InstanceStatus.Disconnected, 'Disabled')
		this.log('debug', 'Destroyed')
	}

	async configUpdated(config) {
		this.config = config
		await this.init_nexa()
	}

	async init_nexa()
	{
		this.outputs = []
		this.inputs = []
		this.clips = []
		this.playlists = []

		if (this.config.serviceUrl && this.config.serverId)
		{
			this.updateStatus(InstanceStatus.Connecting)

			let serviceUrl = this.config.serviceUrl
			let serverId = this.config.serverId

			try {
				this.log('debug', `landingPage uri: ${serviceUrl}`);

				var request = `${serviceUrl}`
				this.log("debug", `Request ${request}`)
				var response = await axios.get(`${serviceUrl}`)
				{
					var eventsUri = this.getUriFromLinkHeader(response, "events")
					this.log("debug", `uri to events ${eventsUri}`)
				};

				request = eventsUri
				this.log("debug", `Request ${request}`)
				var response = await axios.get(eventsUri)
				{
					var subscribeUri = this.getUriFromEvents(response.data.events, "ws")
					this.log("debug", `uri to subscribe ${subscribeUri}`)

					this.initEvents(subscribeUri)
				} 
	
				request = `${serviceUrl}/servers/${serverId}`
				this.log("debug", `Request ${request}`)
				var response = await axios.get(request)
				{
					this.setVariableValues({
						'id': response.data.id,
						'name': response.data.name,
						'title': response.data.title,
						'description': response.data.description,
						'manufacturer': response.data.manufacturer,
						'model': response.data.model,
						'softwareVersion': response.data.softwareVersion,
						'hardwareVersion': response.data.hardwareVersion,
						'serial': response.data.serial,
						'host': response.data.host,
						'protocol': response.data.protocol,
						'uptime': response.data.uptime,
						'clipCount': response.data.clipCount,
						'playlistCount': response.data.playlistCount,
						'outputCount': response.data.outputCount,
						'inputCount': response.data.inputCount,
					})

					var clipsUri   = this.getUriFromLinkHeader(response, "clips")
					var playlistsUri   = this.getUriFromLinkHeader(response, "playlists")
					var outputsUri = this.getUriFromLinkHeader(response, "outputs")
					var inputsUri = this.getUriFromLinkHeader(response, "inputs")
	
					this.log("debug", `uri to clips ${clipsUri}`)
					this.log("debug", `uri to playlists ${playlistsUri}`)
					this.log("debug", `uri to outputs ${outputsUri}`)
					this.log("debug", `uri to inputs ${inputsUri}`)
				}
	
				if (outputsUri)
				{
					request = `${outputsUri}?f=json&properties=id,name`
					this.log("debug", `Request ${request}`)
					response = await axios.get(request)
					this.outputs = response.data.outputs
	
					// Add status field per output
					for (const output of this.outputs)
						output.status = ''

					for (const output of this.outputs)
						choices.outputChoices.push({ id: output.id, label: output.id })
					
					for (const output of this.outputs)
						this.log("info", `${serverId} Outputs ${output.id}`)

					if (this.outputs.length == 0)
						this.log("info", `${serverId} No Outputs`)
				}

				if (inputsUri) 
				{
					request = `${inputsUri}?f=json&properties=id,name`
					this.log("debug", `Request ${request}`)
					response = await axios.get(request)
					this.inputs = response.data.inputs
	
					for (const input of this.inputs)
						input.status = ''

					for (const input of this.inputs)
						choices.inputChoices.push({ id: input.id, label: input.id})

					for (const input of this.inputs)
						this.log("info", `${serverId} Inputs ${input.id}`)

	//				if (this.inputs.length == 0 || this.inputs == undefined)
						this.log("info", `${serverId} No Inputs`)
				}

				if (clipsUri)
				{
					request = `${clipsUri}?f=json&properties=id,name`
					this.log("debug", `Request ${request}`)
					response = await axios.get(request)
					this.clips = response.data.clips

					for (const clip of this.clips)
						choices.clipChoices.push({ id: clip.id, label: clip.id})

					for (const clip of this.clips)
						this.log("info", `${serverId} Clips ${clip.id}`)

					if (this.clips.length == 0)
						this.log("info", `${serverId} No Clips`)
				}

				if (playlistsUri)
				{
					request = `${playlistsUri}?f=json&properties=id,name`
					this.log("debug", `Request ${request}`)
					response = await axios.get(request)
					this.playlists = response.data.playlists

					this.log("warning", `${this.playlists.length}`)

					for (const playlist of this.playlists)
						choices.playlistChoices.push({ id: playlist.id, label: playlist.id})

					for (const playlist of this.playlists)
						this.log("info", `${serverId} Playlists ${playlist.id}`)

					if (this.playlists.length == 0)
						this.log("info", `${serverId} No Playlists`)
				}

				this.setActionDefinitions(this.initActions(this))
				this.setFeedbackDefinitions(this.initFeedbacks(this))
				this.initPresets()

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

}

runEntrypoint(ModuleInstance, UpgradeScripts)
