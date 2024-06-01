<script lang="ts">
	import { nanoid } from 'nanoid';

	let cards = [
		{
			content_fields: [
				{
					id: '1',
					type: 'text',
					content:
						'<p>Quick guide to the house.</p><p>Welcome to Matti in Todtnauberg!</p><p>Ennerbachstraße 32, 79674 Todtnau</p>'
				}
			],
			listing_id: 80,
			title: 'Welcome',
			type: 'home',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '2',
					type: 'text',
					content:
						'<p><strong>Check-in:</strong> You can check in from 3 pm. If you want to arrive earlier, let us know in time and we will try to find a solution! Tip: Bring food for the first evening and morning, there is only a mini-supermarket on site.</p>'
				}
			],
			listing_id: 80,
			title: 'Check-in',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '3',
					type: 'text',
					content:
						'<p><strong>Access to the house:</strong> To enter the house, enter the six-digit code into the keypad on the lower entrance door (north side). When the door opens, you will find the keys on the dresser in the clay pot. You can use them to unlock the upper front door as well. You can find detailed instructions below.</p>'
				}
			],
			listing_id: 80,
			title: 'Access to the house',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '4',
					type: 'text',
					content:
						'<p><strong>Check-out:</strong> You can check out independently until 11 am. When leaving, simply put the keys back on the dresser and pull the door shut behind you. Please remember to lock the upper entrance door before leaving. Please leave the house swept clean.</p>'
				}
			],
			listing_id: 80,
			title: 'Check-out',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '5',
					type: 'text',
					content: '<p><strong>Wifi:</strong> Name: Matti Guest Password: enjoyyourstay!</p>'
				}
			],
			listing_id: 80,
			title: 'Wifi',
			type: 'info',
			icon: 'wifi',
			description: null
		},
		{
			content_fields: [
				{
					id: '6',
					type: 'text',
					content:
						'<p><strong>House rules:</strong></p><ul><li>Please do not smoke in the house, please do not bring pets.</li><li>No parties or events, please be considerate of the neighbours.</li><li>Much of our furniture is very old and from our family. We have restored them and are happy if you take good care of them.</li></ul>'
				}
			],
			listing_id: 80,
			title: 'House rules',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '7',
					type: 'text',
					content:
						'<p><strong>How you can reach us:</strong> You can always reach us by phone, WhatsApp/text or Airbnb if you have any questions or need anything:</p><p>Konrad: +49 176 20235572</p><p>Lotte: +49 152 06195527</p><p>Julius: +49 162 2743661</p>'
				}
			],
			listing_id: 80,
			title: 'Contact',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '8',
					type: 'text',
					content: '<p>We love to see @hausmatti mentions in your Instagram posts and stories!</p>'
				}
			],
			listing_id: 80,
			title: 'Social Media',
			type: 'recommendation',
			icon: 'wifi',
			description: null
		},
		{
			content_fields: [
				{
					id: '9',
					type: 'text',
					content:
						'<p>Welcome to our house - your home for the next few days. We are very happy that you are our guest and hope that you have a great time. Below you will find a small "travel guide" from us: Important information about the house and the surrounding area, as well as tips on the best cafes, restaurants and leisure activities. We hope to be able to save you a little search work. If you have any further questions, please feel free to contact us. We will be happy to help you.</p><p>To get you in the mood, you can watch a video of the house here: <a href=\'https://www.youtube.com/watch?v=8NL7mlApWEQ\'>https://www.youtube.com/watch?v=8NL7mlApWEQ</a></p><p>Best regards, Konrad, Lotte and Julius</p>'
				}
			],
			listing_id: 80,
			title: 'Welcome Message',
			type: 'home',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '10',
					type: 'text',
					content:
						"<p><strong>Arrival:</strong> You can reach the house by car or by public transport (via Freiburg or Lörrach). You can find connections under this link: <a href='https://bit.ly/3nvtudu'>https://bit.ly/3nvtudu</a> Google Maps and other navigation systems find the way to the house reliably. We have marked the relevant turn offs from the center of Todtnauberg as pictures below. If you need help with the journey, please let us know.</p>"
				}
			],
			listing_id: 80,
			title: 'Arrival',
			type: 'info',
			icon: 'car',
			description: null
		},
		{
			content_fields: [
				{
					id: '11',
					type: 'text',
					content:
						'<p><strong>Shopping and other necessities:</strong> In Todtnauberg (Kurhausstraße 11) there is the "Bergladen Todtnauberg" with selected, mostly regional food. The assortment is changing. The store is open Wednesday and Friday from 16-18 clock, Saturday from 10-12 clock. Outside opening hours by appointment at short notice by phone +49 172 872 3971. In addition, there is a "pantry" in the store for self-service, which is open daily from 08-19 clock. You can also make advance orders by phone and Whatsapp. If you are interested, just call before your visit and ask what delicacies are available in the store during your visit. There is also Daniels Dorflädle (Kurhausstraße 7), there you will also find a small selection of groceries as well as fresh baked goods and cheese. It\'s best to call ahead and pre-order at +49 1525 7580014. Daniels Dorflädle is usually only open in the mornings and from 07:00 (Saturday 07:30, Sunday 08:00). In Todtnau, the nearest supermarket is about 10 minutes away by car. Here you will find 3 different supermarkets: Edeka, Penny and Netto. In Todtnau you will also find a bank, a post office and gas stations. Even closer is the gas station in Aftersteg. There are electric charging stations in Todtnau, and some are currently being built in Todtnauberg. From 2024 there will also be a charging possibility directly at our house.</p>'
				}
			],
			listing_id: 80,
			title: 'Shopping and Necessities',
			type: 'info',
			icon: 'shopping',
			description: null
		},
		{
			content_fields: [
				{
					id: '12',
					type: 'text',
					content:
						'<p><strong>Emergency Numbers:</strong></p><ul><li>Police: 110</li><li>Fire and rescue service: 112</li><li>Medical on-call service: 116117</li><li>Mountain rescue: +49 7671 1620</li><li>Power outage: +49 7623 921818</li></ul>'
				}
			],
			listing_id: 80,
			title: 'Emergency Numbers',
			type: 'info',
			icon: 'map-marker',
			description: null
		},
		{
			content_fields: [
				{
					id: '13',
					type: 'text',
					content:
						'<p><strong>House use and equipment:</strong></p><p>Bed linen and towels - Your beds are freshly made when you arrive. If you need supplies, you will find them in the wooden chest of drawers in the lower entrance area. If you need new towels, you will find them in the wooden chest of drawers in the bathroom.</p><p>Soap, shampoo etc. - Should be enough in the bathrooms. If something is missing, please let us know and we will provide supplies.</p><p>Washing and drying - Washing machine and dryer are in the basement room. Here are also detergents on the shelf and a clothes horse, all you can use. Please turn the machines back to "off" after use. Please contact us if you have any questions about the operation of the machines.</p><p>Waste - We separate the waste and distinguish between organic, residual, paper and plastic waste. In the kitchen, the plastic waste goes into the large white trash can next to the coffee machine (yellow bag), the rest into the trash cans under the sink. If the trash cans get too full, there are all trash cans in the small hut.</p><p>Stove - The stove in the kitchen works with induction. To switch it on and off, press and hold the -symbol. Please make sure that no liquid gets into the vent. If this happens, please remove the pot immediately, turn off the stove and remove the liquid from the vent. You can find a short tutorial for the stove on YouTube (German).</p><p>Freezer - There is a small freezer in the basement. You can plug it in and use it. Please unplug it before you leave.</p><p>Bar - We have a small house bar opposite the kitchen with basic equipment for gin and tonic and Aperol Spritz. Feel free to help yourselves! We run the bar on the "pay what you want" principle. So you can decide what price you think is fair for the drinks you consume. You can simply put the money in the small clay jug behind the bar.</p><p>Sonos - There is a Sonos box on the cabinet in the living room. You can use it with Spotify & Co, you only need to be on the WLAN.</p><p>Portafilter coffee maker - Here you can see a tutorial for the coffee maker (in German).</p><p>Supplies - In the front basement area are kitchen utensils for refilling.</p><p>Ski cellar - From the terrace you have access to our ski cellar. There you can store and dry your wet ski gear. We have an electric boot dryer. Please turn it off after use. If you need help, please contact us.</p><p>Outdoor furniture - The outdoor furniture is in the shed. You can simply put it on the terrace and, at least in summer, leave it outside overnight. You can find seat cushions in the black chest in the shed.</p><p>BBQ - There is an electric grill in the shed that you are welcome to use. Next to the entrance door on the terrace there is a socket.</p><p>Paravent - In the basement, you\'ll find a room divider that you can use to create a little more privacy for the pull-out bed in the living room, if needed.</p>'
				}
			],
			listing_id: 80,
			title: 'House Use and Equipment',
			type: 'info',
			icon: 'home-outline',
			description: null
		},
		{
			content_fields: [
				{
					id: '14',
					type: 'text',
					content:
						"<p><strong>Recommendations: Cafés</strong></p><p>Café Bergfried: Café Bergfried makes very good coffee, homemade cakes and delicious sandwiches. In the summer there is also regional organic ice cream. Opening hours: Mon+Tues, Fri+Sat+Sun from 12-18. In winter the opening hours sometimes vary, check the website beforehand: <a href='https://www.bergfried-cafe.de/'>https://www.bergfried-cafe.de/</a></p>"
				}
			],
			listing_id: 80,
			title: 'Cafés',
			type: 'recommendation',
			icon: 'restaurant',
			description: null
		},
		{
			content_fields: [
				{
					id: '15',
					type: 'text',
					content:
						"<p><strong>Recommendations: Restaurants</strong></p><p>Haus Tannenberg: Haus Tannenberg in Todtnauberg serves delicious, classic dishes - much of which is regional and seasonal. There is also a burger menu and a good vegetarian/vegan offer. The menu varies from time to time, just check the website. It's about a 15-minute walk from the house. <a href='https://tannenberg-todtnauberg.de'>https://tannenberg-todtnauberg.de</a></p><p>Der Waldfrieden: The Waldfrieden in Herrenschwand is a nature hotel with spa and restaurant. Since 2022, the restaurant has a green star from the Guide Michelin for particularly good regional and sustainable cuisine. Be sure to make a reservation for dinner and spa! <a href='http://www.derwaldfrieden.de'>http://www.derwaldfrieden.de</a></p><p>Die Halde: The Halde is beautifully situated on a plateau of the Schauinsland with a view of the beautiful Black Forest. The cuisine emphasizes regional and high-quality products - you can taste that. The spa area is also beautiful and you can enjoy the tranquility of the Black Forest. Again, be sure to make a reservation! <a href='https://www.halde.com'>https://www.halde.com</a></p>"
				}
			],
			listing_id: 80,
			title: 'Restaurants',
			type: 'recommendation',
			icon: 'restaurant',
			description: null
		},
		{
			content_fields: [
				{
					id: '16',
					type: 'text',
					content:
						"<p><strong>Nature:</strong></p><p>Todtnauer Waterfall - The Todtnau waterfall, located between Todtnauberg and Aftersteg, is Baden-Württemberg's highest natural waterfall with a drop height of 97 meters. It is only about 30 minutes away from the house. Hike from the house to the waterfall on komoot: <a href='https://bit.ly/40B3JHx'>https://bit.ly/40B3JHx</a></p><p>Feldberg - Feldberg is the highest mountain in Baden-Württemberg with an altitude of 1493 meters. In winter you can ski here wonderfully, in summer you can make beautiful hikes and marvel at the sunrise and sunset. From the house it is about 2.5 hours walk to the Feldberg. Hike from the house to the Feldberg on komoot: <a href='https://bit.ly/3Mg4X6N'>https://bit.ly/3Mg4X6N</a></p><p>Stübenwasen - The Stübenwasen in Todtnauberg is the sixth highest mountain in Baden-Württemberg. The summit is only about 45 minutes from the house and there are many beautiful hiking routes. In addition, the view is beautiful, in good weather you have a great view of the Alps. Hike from the house to Stübenwasen on komoot: <a href='https://bit.ly/40A3fBc'>https://bit.ly/40A3fBc</a></p>"
				}
			],
			listing_id: 80,
			title: 'Nature',
			type: 'recommendation',
			icon: 'nature-people',
			description: null
		}
	];

	async function sendCards() {
		console.log('sending');
		for (const card of cards) {
			const response = await fetch('/api/listing/card', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ card: card })
			});

			if (!response.ok) {
				const { message } = await response.json();
				console.error('Error sending cards:', message);
				return;
			}

			console.log('Cards sent successfully');
		}
	}
</script>

<button class="btn" on:click={sendCards}>Send Cards</button>
