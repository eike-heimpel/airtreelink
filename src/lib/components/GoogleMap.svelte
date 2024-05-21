<script>
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	let map;
	let mapContainer;
	let activeMarker = null;

	// Example place data
	const places = [
		{
			name: 'Googleplex',
			lat: 37.422,
			lng: -122.084
		},
		{
			name: 'Apple Park',
			lat: 37.334,
			lng: -122.009
		}
	];

	function initMap() {
		map = new google.maps.Map(mapContainer, {
			center: { lat: 37.422, lng: -122.084 },
			zoom: 12,
			styles: [
				{
					featureType: 'poi',
					elementType: 'labels',
					stylers: [{ visibility: 'off' }]
				}
			]
		});

		places.forEach((place, index) => {
			const marker = new google.maps.Marker({
				map: map,
				position: { lat: place.lat, lng: place.lng },
				title: place.name,
				label: (index + 1).toString()
			});

			const infoWindow = new google.maps.InfoWindow({
				content: `
                    <div>
                        <strong>${place.name}</strong>
                        <br>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}" target="_blank">View on Google Maps</a>
                    </div>
                `
			});

			marker.addListener('click', () => {
				if (activeMarker) {
					activeMarker.setAnimation(null);
				}
				activeMarker = marker;
				marker.setAnimation(google.maps.Animation.BOUNCE);
				infoWindow.open(map, marker);
			});

			place.marker = marker;
		});

		// Adjust map bounds to fit all markers
		const bounds = new google.maps.LatLngBounds();
		places.forEach((place) => {
			bounds.extend(new google.maps.LatLng(place.lat, place.lng));
		});
		map.fitBounds(bounds);
	}

	function highlightMarker(index) {
		const place = places[index];
		google.maps.event.trigger(place.marker, 'click');
	}

	function getDirections(lat, lng) {
		window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}`;
		script.async = true;
		script.defer = true;
		script.onload = initMap;
		document.head.appendChild(script);
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
	{#each places as place, index}
		<div
			class="card bg-accent shadow-md p-4 cursor-pointer"
			on:click={() => highlightMarker(index)}
		>
			<div class="card-body">
				<h2 class="card-title">{index + 1}. {place.name}</h2>
				<p>{place.lat}, {place.lng}</p>
				<button
					on:click={() => getDirections(place.lat, place.lng)}
					class="mt-2 text-blue-500 underline">Get Directions</button
				>
			</div>
		</div>
	{/each}
</div>

<div id="map" bind:this={mapContainer} class="h-[500px] w-full"></div>

<style>
</style>
