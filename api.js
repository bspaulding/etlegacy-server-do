require('dotenv').config();
require('es6-promise').polyfill();
require('isomorphic-fetch');

const base = 'https://api.digitalocean.com/v2';
const headers = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${process.env.DO_TOKEN}`
};

exports.listSSHKeys = async function listSSHKeys() {
	const response = await fetch(`${base}/account/keys`, { headers });
	const json = await response.json();
	return json.ssh_keys;
}

exports.listDroplets = async function listDroplets() {
	const response = await fetch(`${base}/droplets`, { headers });
	const json = await response.json();
	return json.droplets;
}

exports.getDroplet = async function getDroplet(id) {
	const response = await fetch(`${base}/droplets/${id}`, { headers });
	const json = await response.json();
	return json.droplet;
}

exports.deleteDroplet = async function deleteDroplet(id) {
	const response = await fetch(`${base}/droplets/${id}`, {
		headers,
		method: 'DELETE'
	});
	return response.ok;
}

function ensureAll(xs) {
	if (xs.find(x => !x)) {
		throw 'Found falsy value';
	}
}

exports.createDroplet = async function createDroplet(name, region, size, image, options = {}) {
	ensureAll([name, region, size, image]);
	const response = await fetch(`${base}/droplets`, {
		headers,
		method: 'POST',
		body: JSON.stringify({
			name,
			region,
			size,
			image,
			...options
		})
	});
	const json = await response.json();
	return json.droplet;
}
