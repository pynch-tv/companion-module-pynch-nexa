module.exports = function (self) {

	const actions = [];

	const serverChoices = [{ id: '1', label: 'aaaaa'}, { id: '2', label: 'bbbbb'}];
	const outputChoices = [{ id: 'PGM1', label: 'PGM1'}, { id: 'PGM2', label: 'PGM2'}, { id: 'PGM3', label: 'PGM3'}];

	const maxShuttle = 5000;

	actions['play'] = {
		name: 'Play',
		options: [
			{
				type: 'dropdown',
				label: 'Server',
				id: 'serverId',
				default: 1,
				choices: [
					...serverChoices,
				],
			},
			{
				type: 'dropdown',
				label: 'Output',
				id: 'outputId',
				default: 1,
				choices: [
					...outputChoices,
				],
			},
			{
				type: 'number',
				label: 'Speed %',
				id: 'speed',
				default: 100,
			},

		],
		callback: async ({ options }) => {
		},
	}


	self.setActionDefinitions(actions)
}
