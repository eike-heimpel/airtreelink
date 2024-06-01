<script lang="ts">
	import { nanoid } from 'nanoid';

	let cards = [
		{
			content_fields: [
				{
					id: '1',
					type: 'text',
					content:
						'Quick guide to the house. Welcome to Matti in Todtnauberg! Ennerbachstraße 32, 79674 Todtnau'
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
						'Check-in: You can check in from 3 pm. If you want to arrive earlier, let us know in time and we will try to find a solution! Tip: Bring food for the first evening and morning, there is only a mini-supermarket on site.'
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
						'Access to the house: To enter the house, enter the six-digit code into the keypad on the lower entrance door (north side). When the door opens, you will find the keys on the dresser in the clay pot. You can use them to unlock the upper front door as well. You can find detailed instructions below.'
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
						'Check-out: You can check out independently until 11 am. When leaving, simply put the keys back on the dresser and pull the door shut behind you. Please remember to lock the upper entrance door before leaving. Please leave the house swept clean.'
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
					content: 'Wifi: Name: Matti Guest Password: enjoyyourstay!'
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
						'House rules: ● Please do not smoke in the house, please do not bring pets. ● No parties or events, please be considerate of the neighbours. ● Much of our furniture is very old and from our family. We have restored them and are happy if you take good care of them.'
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
						'How you can reach us: You can always reach us by phone, WhatsApp/text or Airbnb if you have any questions or need anything: Konrad: +49 176 20235572 Lotte: +49 152 06195527 Julius: +49 162 2743661'
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
					content: 'We love to see @hausmatti mentions in your Instagram posts and stories!'
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
						'Welcome to our house - your home for the next few days. We are very happy that you are our guest and hope that you have a great time. Below you will find a small "travel guide" from us: Important information about the house and the surrounding area, as well as tips on the best cafes, restaurants and leisure activities. We hope to be able to save you a little search work. If you have any further questions, please feel free to contact us. We will be happy to help you. To get you in the mood, you can watch a video of the house here: https://www.youtube.com/watch?v=8NL7mlApWEQ Best regards, Konrad, Lotte and Julius'
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
						'Arrival: You can reach the house by car or by public transport (via Freiburg or Lörrach). You can find connections under this link: https://bit.ly/3nvtudu Google Maps and other navigation systems find the way to the house reliably. We have marked the relevant turn offs from the center of Todtnauberg as pictures below. If you need help with the journey, please let us know.'
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
						'Shopping and other necessities: In Todtnauberg (Kurhausstraße 11) there is the "Bergladen Todtnauberg" with selected, mostly regional food. The assortment is changing. The store is open Wednesday and Friday from 16-18 clock, Saturday from 10-12 clock. Outside opening hours by appointment at short notice by phone +49 172 872 3971. In addition, there is a "pantry" in the store for self-service, which is open daily from 08-19 clock. You can also make advance orders by phone and Whatsapp. If you are interested, just call before your visit and ask what delicacies are available in the store during your visit. There is also Daniels Dorflädle (Kurhausstraße 7), there you will also find a small selection of groceries as well as fresh baked goods and cheese. It\'s best to call ahead and pre-order at +49 1525 7580014. Daniels Dorflädle is usually only open in the mornings and from 07:00 (Saturday 07:30, Sunday 08:00). In Todtnau, the nearest supermarket is about 10 minutes away by car. Here you will find 3 different supermarkets: Edeka, Penny and Netto. In Todtnau you will also find a bank, a post office and gas stations. Even closer is the gas station in Aftersteg. There are electric charging stations in Todtnau, and some are currently being built in Todtnauberg. From 2024 there will also be a charging possibility directly at our house.'
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
						'Emergency Numbers: Police: 110 Fire and rescue service: 112 Medical on-call service: 116117 Mountain rescue: +49 7671 1620 Power outage: +49 7623 921818'
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
						'House use and equipment: Bed linen and towels - Your beds are freshly made when you arrive. If you need supplies, you will find them in the wooden chest of drawers in the lower entrance area. If you need new towels, you will find them in the wooden chest of drawers in the bathroom. Soap, shampoo etc. - Should be enough in the bathrooms. If something is missing, please let us know and we will provide supplies. Washing and drying - Washing machine and dryer are in the basement room. Here are also detergents on the shelf and a clothes horse, all you can use. Please turn the machines back to "off" after use. Please contact us if you have any questions about the operation of the machines. Waste - We separate the waste and distinguish between organic, residual, paper and plastic waste. In the kitchen, the plastic waste goes into the large white trash can next to the coffee machine (yellow bag), the rest into the trash cans under the sink. If the trash cans get too full, there are all trash cans in the small hut. Stove - The stove in the kitchen works with induction. To switch it on and off, press and hold the -symbol. Please make sure that no liquid gets into the vent. If this happens, please remove the pot immediately, turn off the stove and remove the liquid from the vent. You can find a short tutorial for the stove on YouTube (German). Freezer - There is a small freezer in the basement. You can plug it in and use it. Please unplug it before you leave. Bar - We have a small house bar opposite the kitchen with basic equipment for gin and tonic and Aperol Spritz. Feel free to help yourselves! We run the bar on the "pay what you want" principle. So you can decide what price you think is fair for the drinks you consume. You can simply put the money in the small clay jug behind the bar. Sonos - There is a Sonos box on the cabinet in the living room. You can use it with Spotify & Co, you only need to be on the WLAN. Portafilter coffee maker - Here you can see a tutorial for the coffee maker (in German). Supplies - In the front basement area are kitchen utensils for refilling. Ski cellar - From the terrace you have access to our ski cellar. There you can store and dry your wet ski gear. We have an electric boot dryer. Please turn it off after use. If you need help, please contact us. Outdoor furniture - The outdoor furniture is in the shed. You can simply put it on the terrace and, at least in summer, leave it outside overnight. You can find seat cushions in the black chest in the shed. BBQ - There is an electric grill in the shed that you are welcome to use. Next to the entrance door on the terrace there is a socket. Paravent - In the basement, you\'ll find a room divider that you can use to create a little more privacy for the pull-out bed in the living room, if needed.'
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
						'Recommendations: Cafés - Café Bergfried: Café Bergfried makes very good coffee, homemade cakes and delicious sandwiches. In the summer there is also regional organic ice cream. Opening hours: Mon+Tues, Fri+Sat+Sun from 12-18. In winter the opening hours sometimes vary, check the website beforehand: https://www.bergfried-cafe.de/'
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
						"Recommendations: Restaurants - Haus Tannenberg: Haus Tannenberg in Todtnauberg serves delicious, classic dishes - much of which is regional and seasonal. There is also a burger menu and a good vegetarian/vegan offer. The menu varies from time to time, just check the website. It's about a 15-minute walk from the house. https://tannenberg-todtnauberg.de Der Waldfrieden: The Waldfrieden in Herrenschwand is a nature hotel with spa and restaurant. Since 2022, the restaurant has a green star from the Guide Michelin for particularly good regional and sustainable cuisine. Be sure to make a reservation for dinner and spa! http://www.derwaldfrieden.de Die Halde: The Halde is beautifully situated on a plateau of the Schauinsland with a view of the beautiful Black Forest. The cuisine emphasizes regional and high-quality products - you can taste that. The spa area is also beautiful and you can enjoy the tranquility of the Black Forest. Again, be sure to make a reservation! https://www.halde.com"
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
						"Nature: Todtnauer Waterfall - The Todtnau waterfall, located between Todtnauberg and Aftersteg, is Baden-Württemberg's highest natural waterfall with a drop height of 97 meters. It is only about 30 minutes away from the house. Hike from the house to the waterfall on komoot: https://bit.ly/40B3JHx Feldberg - Feldberg is the highest mountain in Baden-Württemberg with an altitude of 1493 meters. In winter you can ski here wonderfully, in summer you can make beautiful hikes and marvel at the sunrise and sunset. From the house it is about 2.5 hours walk to the Feldberg. Hike from the house to the Feldberg on komoot: https://bit.ly/3Mg4X6N Stübenwasen - The Stübenwasen in Todtnauberg is the sixth highest mountain in Baden-Württemberg. The summit is only about 45 minutes from the house and there are many beautiful hiking routes. In addition, the view is beautiful, in good weather you have a great view of the Alps. Hike from the house to Stübenwasen on komoot: https://bit.ly/40A3fBc"
				}
			],
			listing_id: 80,
			title: 'Nature',
			type: 'recommendation',
			icon: 'nature-people',
			description: null
		},
		{
			content_fields: [
				{
					id: '17',
					type: 'text',
					content:
						'Leisure Activities: Skiing - Todtnauberg - Directly in front of the house you will find the skiing area Todtnauberg with 16 kilometers of slopes. The Scheuermatt lift is directly accessible from the house, strap on your skis and go! There is no cash desk at the lift directly at the house. You can just tell the lift attendant that you still need a ticket, then he will let you go up and you can buy a ticket at one of the other lifts. Directly from the house also starts a cross-country skiing trail, and you can go ski touring. Under this link you will find all the latest information: https://bit.ly/41bZMZR Skiing - Feldberg - Feldberg is the largest ski resort in Baden-Württemberg with over 30 kilometers of slopes. You can reach the ski resort by car in about 15 minutes. If you are early, you have the chance to park directly at the valley station in Fahl. Otherwise, there is a large parking garage at the top of the Feldberg. Since the ski area can get quite crowded, it is recommended to be at the lifts as close to opening time as possible. The first hours are the best! Here you can find all the necessary information about the ski resort Feldberg: https://bit.ly/3GerdtJ Skiing - Other - Around Todtnauberg there are countless small ski areas, some with only one or two ski lifts. With a little luck, you can experience a great (deep) snow day there without having to queue once. Our insider tip: Menzenschwand. Here you can find an overview of all lifts: https://bit.ly/3JXHZhQ Hiking - From the house you can make great hikes in summer and winter. We have linked a few above. We recommend komoot for planning possible hiking routes. Cycling / Mountain biking - The Upper Black Forest is perfect for extended bike tours. A good place to start is the official site of the tourism association: https://bit.ly/3znhgXd You can find the best routes and trails on komoot. There is a downhill park in Todtnau: https://bit.ly/40RV4QH Watersports - About 30 minutes by car from Todtnauberg is the Schluchsee. In summer you can rent sailboats, SUPs and surfboards there. Of course, you can also swim wonderfully in the Schluchsee. Other outdoor activities - Climbing, ski touring, trail running: you can do it all on your doorstep. Here are tips: https://www.schwarzwald-outdoor.de Tourist Information Todtnauberg - There are also other offers in Todtnauberg, it is best to go to the Tourist Info and see what is available. Kurhausstraße 18, open Mon/Mi/Fri mornings.'
				}
			],
			listing_id: 80,
			title: 'Leisure Activities',
			type: 'recommendation',
			icon: 'bike',
			description: null
		},
		{
			content_fields: [
				{
					id: '18',
					type: 'text',
					content:
						'Tourist Information: Steinwasenpark - Steinwasenpark is a great destination especially for families with children. There are several toboggan runs, an adventure rope bridge, an integrated wild animal park and gastronomic offers. https://www.steinwasen-park.de/ Arrival by car: From Todtnauberg via Muggenbrunn in the direction of Freiburg, you pass the park after 15 minutes. Arrival by public transport: Bus No. 7215 from Todtnauberg, bus stop "Sternen" direction Kirchzarten, train station, to bus stop "St. Wilhelm, Steinwasen". It takes about 30 minutes from the house. Summer toboggan run Todtnau - The Hasenhorn toboggan run in Todtnau is a 2.9km long summer toboggan run. It is guided on rails, you can determine the speed yourself. From 3 years you can ride along, from 8 years alone. A ride up with the mountain railroad and down with the coaster costs 11 € for children up to and including 16, 13 € for adults. https://www.hasenhorn-rodelbahn.de/ How to get there: Drive to Todtnau and there just follow the signs, which are actually everywhere. Fundorena Feldberg - The Fundorena at Feldberg is a large indoor playground for young and old with a fun park, trampoline park, indoor high ropes course, bouldering area and MIND arena for puzzle lovers. If the weather is bad, a visit is definitely worth it! https://www.fundorena.de/de/ Outdoor swimming pool Todtnauberg - Berger Bad in Todtnauberg is the highest outdoor pool in Germany! Small but beautiful swimming pool with beach volleyball, table tennis and table football. In good weather you have a view of the Swiss Alps. There is also a kiosk with treats and drinks. From the house it is about a 10 minutes walk. http://www.schwimmbad-todtnauberg.de/ Tourist Information - At the Tourist-Information Todtnauberg you get all information about Todtnauberg and the Black Forest. Opening hours Mo, Wed, Fr from 09-12:00 o\'clock Kurhausstraße 18, 79674 Todtnau - Todtnauberg; Tel. 07652 12060 Website'
				}
			],
			listing_id: 80,
			title: 'Tourist Information',
			type: 'info',
			icon: 'city',
			description: null
		},
		{
			content_fields: [
				{
					id: '19',
					type: 'text',
					content:
						'Departure: Please leave the house swept clean. If something is broken: No problem, just let us know. Check-out: Please lock all doors, including the wooden padlocked doors at the main entrance and shed. Then you can put the key back into the clay pot from which you took the key when you arrived. You will leave the house through the same door with the electronic lock that you came in through when you arrived. Just pull it shut. Waste: You can leave the garbage in the garbage cans in the kitchen or put it in the big garbage cans in the shed. Please put glass waste in the cellar. Please pay attention to the waste separation. Bed linen and towels: You can leave your beds made up, the towels you can simply collect in the bathroom on the floor. We hope you can enjoy your stay in our house and have a great time in the Black Forest!'
				}
			],
			listing_id: 80,
			title: 'Departure',
			type: 'info',
			icon: 'car',
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
