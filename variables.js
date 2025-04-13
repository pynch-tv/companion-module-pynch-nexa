module.exports = function (self) {

	const variables = []; 

	variables.push({
		name: 'Status',
		variableId: 'statusId',
	});
	
	variables.push({
		name: 'Play Speed',
		variableId: 'speed',
	});

	self.setVariableDefinitions(variables)
}
