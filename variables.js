module.exports = function (self) {

	const variables = []; 

	variables.push({
		name: 'Server ID',
		variableId: 'serverId',
	});

	variables.push({
		name: 'Output ID',
		variableId: 'outputId',
	});

	variables.push({
		name: 'Input ID',
		variableId: 'inputId',
	});

	variables.push({
		name: 'Clip ID',
		variableId: 'clipId',
	});

	self.setVariableDefinitions(variables)
}
