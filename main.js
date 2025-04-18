const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config');
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const utils = require('./src/utils');

const axios = require('axios')
const ws = require('ws')

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
		})
	}

	async init(config) {
		this.config = config

		this.outputs = []
		this.inputs = []
		this.clips = []
		this.playlists = []
		this.ws = undefined

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
		if (this.config.serviceUrl && this.config.serverId)
		{
			this.updateStatus(InstanceStatus.Connecting)

			let serviceUrl = this.config.serviceUrl
			let serverId = this.config.serverId

			let self = this

			try {
				this.log('debug', `landingPage uri: ${serviceUrl}`);

				var response = await axios.get(`${serviceUrl}`)
				{
					var eventsUri = this.getUriFromLinkHeader(response, "events")
					this.log("debug", `uri to events ${eventsUri}`)
				};

				var response = await axios.get(eventsUri)
				{
					var subscribeUri = this.getUriFromEvents(response.data.events, "ws")
					this.log("debug", `uri to subscribe ${subscribeUri}`)

					this.ws = new ws(subscribeUri);
					this.log("debug", `webSocket ${this.ws}`)

					this.ws.onopen = function(e) {
					}
					  
					this.ws.onmessage = function(event) {
						var data = JSON.parse(event.data)
						var server = data.server

						if (Object.keys(data).length === 0)
							return // alive message

		//				self.log("debug", `[message] Data received from server: ${event.data}`)
					
						// We only care for event for this serverId
						if (server == self.config.serverId)
						{
							if (data.topic === undefined || data.action == undefined) 
							{
								self.log("error", `received message not valid. It does not contain a topic or action` )
								return
							}

							switch (data.topic.name)
							{
								case "output":
									{
										var id = data.topic.id

										self.checkVariables()
									//	self.checkFeedbacks()
								
										switch (data.action)
										{
											case "change":
												if (data.data.state)
												{
													switch (data.topic.name)
													{
														case "play":
														case "start":
															break;
														case "stop":
														case "stopped":
															break;
													}
												}
												break
										}
									}
									break;
								case "input":
									{
										var id = data.topic.id
										self.log("debug", `input message ${id}` )
						
										switch (data.action)
										{
											case "change":
												break
										}
									}
									break;
							}
						}

					}
					
					this.ws.onclose = function(event) {
						if (event.wasClean) {
							self.log("debug", `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
						} else {
							// e.g. server process killed or network down
							// event.code is usually 1006 in this case
							self.log("debug", '[close] Connection died')
						}
					}
					
					this.ws.onerror = function(error) {
						self.log("debug", `error = ${error.data}`)
					}
				} 
	
				var response = await axios.get(`${serviceUrl}/servers/${serverId}`)
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
					this.log("debug", `uri to outputs ${inputsUri}`)
				}
	
				this.outputs = []
				if (outputsUri)
				{
					response = await axios.get(`${outputsUri}?f=json&properties=id,name`)
					{
						this.outputs = response.data.outputs
		
						for (const link of this.outputs)
							this.log("info", `${serverId} Outputs ${link.id}`)
					}
				}

				this.inputs = []
				if (inputsUri)
				{
					response = await axios.get(`${inputsUri}?f=json&properties=id,name`)
					{
						this.inputs = response.data.inputs
		
						for (const link of this.inputs)
							this.log("info", `${serverId} Inputs ${link.id}`)
					}
				}

				this.clips = []
				if (clipsUri)
				{
					response = await axios.get(`${clipsUri}?f=json&properties=id,name`)
					{
						this.clips = response.data.clips
		
						for (const link of this.clips)
							this.log("info", `${serverId} Clips ${link.id}`)
					}
				}

				this.playlists = []
				if (playlistsUri)
				{
					response = await axios.get(`${playlistsUri}?f=json&properties=id,name`)
					{
						this.playlists = response.data.playlists
		
						for (const link of this.playlists)
							this.log("info", `${serverId} Playlists ${link.id}`)
					}
				}

				this.initActions()
				this.initFeedbacks()
				this.initVariables()
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
