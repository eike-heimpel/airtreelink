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
			lat: 52.4306013,
			lng: 13.5322527,
			name: 'Kaufland Berlin-Adlershof'
		},
		{
			lat: 52.52,
			lng: 13.405,
			name: 'Berlin City Center'
		}
	];

	function initMap() {
		map = L.map(mapContainer, {
			attributionControl: false
		}).setView([52.4306013, 13.5322527], 13);

		L.tileLayer(
			`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}`,
			{
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
						'</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=' +
						marker.lat +
						',' +
						marker.lng +
						'" target="_blank">Get Directions</a>'
				);

			// Only open the popup when the marker is clicked
			leafletMarker.on('click', function () {
				this.openPopup();
			});

			// Attach the marker to the marker data for highlighting
			marker.leafletMarker = leafletMarker;
		});

		// Add custom attribution control with Mapbox logo
		L.control
			.attribution({
				prefix: false
			})
			.addAttribution(
				'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' +
					'© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
					'© <a href="https://leafletjs.com">Leaflet</a>'
			)
			.addTo(map);

		// Add Mapbox logo
		const logo = L.control({ position: 'bottomleft' });
		logo.onAdd = function () {
			const div = L.DomUtil.create('div', 'mapbox-logo');
			div.innerHTML =
				'<a href="https://www.mapbox.com/about/maps/" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mapbox_logo_2019.svg/512px-Mapbox_logo_2019.svg.png" alt="Mapbox Logo" style="height:30px;"></a>';
			return div;
		};
		logo.addTo(map);
	}

	function highlightMarker(index) {
		const marker = markers[index];
		marker.leafletMarker.openPopup();
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
