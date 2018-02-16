const { listDroplets, deleteDroplet } = require('./api');

const dropletName = 'etlegacy-server';
async function main() {
	const droplets = await listDroplets();
	console.log('Droplets:\n---------');
	droplets.forEach(d => console.log(d.name, d.networks.v4[0].ip_address));

	const droplet = droplets.find(d => d.name === dropletName);
	if (droplet) {
		console.log('Deleting Droplet:');
		const deleted = await deleteDroplet(droplet.id);
		console.log('...' + deleted);
	} else {
		console.log('Droplet not created.');
	}
}

main();

