const { listSSHKeys, createDroplet, getDroplet } = require('./api');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

async function sleep(t) {
	return new Promise(resolve => setTimeout(resolve, t));
}

async function startETLServer(host) {
	await ssh.connect({
		host,
		username: 'root',
		privateKey: '/Users/bspaulding/.ssh/id_rsa'
	});
	const res = await ssh.execCommand(
		'docker run -d -p 27960:27960/udp schreckgestalt/etlegacy'
	);
	console.log('STDOUT:\n', res.stdout);
	console.log('STDERR:\n', res.stderr);
	return;
}

const dropletName = 'etlegacy-server';
async function main() {
	console.log('Creating Droplet:');
	const keys = await listSSHKeys();
	const droplet = await createDroplet(
		dropletName,
		'sfo1',
		'512mb',
		'docker-16-04',
		{
			ssh_keys: keys.map(k => k.id)
		}
	);
	const wait = 10;
	while (droplet.status === 'new') {
		console.log(`droplet is new, waiting ${wait}s...`);
		await sleep(wait * 1000);
		const { networks, status } = await getDroplet(droplet.id);
		droplet.status = status;
		droplet.networks = networks;
	}

	const ip = droplet.networks.v4[0].ip_address;
	console.log('Starting etlegacy server on droplet...');
	await startETLServer(ip);
	console.log(`Finished, IP Address: ${ip}`);
	return;
}

main();
