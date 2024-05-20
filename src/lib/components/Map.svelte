<script>
	import { onMount } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import 'leaflet/dist/leaflet.css';

	let map;
	let mapContainer;
	let L;

	// Example marker data
	const markers = [
		{
			lat: 52.4306013, // latitude
			lng: 13.5322527, // longitude
			name: 'Kaufland Berlin-Adlershof',
			googleMapsUrl: 'https://maps.google.com/?q=Kaufland+Berlin-Adlershof'
		}
	];

	function initMap() {
		map = L.map(mapContainer).setView([52.4306013, 13.5322527], 13);

		L.tileLayer(
			`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}`,
			{
				attribution:
					'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 18,
				id: 'mapbox/light-v10',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN
			}
		).addTo(map);

		const customIcon = L.icon({
			iconUrl: '/logo.webp', // Your custom icon URL
			iconSize: [45, 45], // size of the icon
			iconAnchor: [22, 45], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
		});

		markers.forEach((marker) => {
			const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon })
				.addTo(map)
				.bindPopup(
					'<b>' +
						marker.name +
						'</b><br><a href="' +
						marker.googleMapsUrl +
						'" target="_blank">View on Google Maps</a>'
				);

			// Only open the popup when the marker is clicked
			leafletMarker.on('click', function () {
				this.openPopup();
			});
		});
	}

	onMount(async () => {
		L = await import('leaflet');
		initMap();
	});
</script>

<div id="map" bind:this={mapContainer} style="height: 450px; width: 600px;"></div>

<style>
	#map {
		width: 100%;
		height: 500px;
	}
</style>
