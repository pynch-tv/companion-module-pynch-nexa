const websocket = require('ws')

async function initEvents (subscribeUri) 
{
    let self = this

    const ws = new websocket(subscribeUri);
    self.log("debug", `webSocket ${ws}`)

    ws.onopen = function(e) {
        self.log("debug", '[open]')
    }
        
    ws.onmessage = function(event) 
    {
        self.log("debug", `[message] ${event.data}`)

        var content = JSON.parse(event.data)
        var server = content.server

        if (Object.keys(content).length === 0)
            return // alive message

        // We only care for event for this serverId
        if (server == self.config.serverId)
        {
            const topic = content.topic
            const action = content.action
            const data = content.data

            if (topic === undefined || action == undefined) 
            {
                self.log("error", `received message not valid. It does not contain a topic or action` )
                return;
            }

            switch (topic.name)
            {
                case "clips":
                    switch (action)
                    {
                        case 'add':
                            for (const clip of data)
                            {
                                self.log("debug", `add ======> ${clip.id}` )
                         //       self.clips.push(clip.id)
                         // update actions and feedbacks??
                            }
                            break
                        case 'remove':
                            for (const clip of data)
                            {
                                self.log("debug", `remove ======> ${clip.id}` )
                                //       self.clips.push(clip.id)
                            }
                            // TODO: add to globals
                            break
                        }
                    break

                case "output":
                    switch (action)
                    {
                        case 'change':
                            switch (data.state)
                            {
                                case "play":
                                case "start":
                                    {
                                        self.log("debug", `${topic.id} play` )
                                        const output = self.outputs.find(output => output.id === topic.id)
                                        output.status = 'play'
                                        self.checkFeedbacks()
                                    }
                                    break
                                case "stop":
                                case "stopped":
                                    {
                                        self.log("debug", `${topic.id} stop` )
                                        const output = self.outputs.find(output => output.id === topic.id)
                                        output.status = 'stop'
                                        self.checkFeedbacks()
                                    }
                                    break
                                default:
                                    break
                            }
                            break
                    }
                    break

                case "input":
                    break
            }
        }
    }
    
    ws.onclose = function(event) {
        if (event.wasClean) {
            self.log("debug", `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            self.log("debug", '[close] Connection died')
        }
    }
    
    ws.onerror = function(error) {
        self.log("debug", `error = ${error.data}`)
    }
    
}

module.exports = { initEvents }