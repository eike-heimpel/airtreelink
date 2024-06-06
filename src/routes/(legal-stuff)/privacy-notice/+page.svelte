<script>
	import {
		name,
		privacyEmail,
		address,
		dataProtectionOfficer,
		dpoEmail
	} from '$lib/stores/business_info';
</script>

<div class="container mx-auto my-10 p-5 shadow-md rounded-lg">
	<h1 class="text-2xl font-bold mb-4">Privacy Notice / Datenschutzerklärung</h1>

	<h2 class="text-xl font-semibold mb-2">English Version</h2>
	<p class="mt-4">
		<strong>Introduction</strong> <br />
		Thank you for visiting our website. Protecting your personal data is very important to us. This privacy
		notice explains what data we collect, how we use it, and your rights regarding your data.
	</p>
	<p class="mt-4">
		<strong>Data Controller</strong> <br />
		The data controller for this website is:
		<br />{name}, operating the website GuestLink.
		<br />{address}
		<br />Email: {privacyEmail}
	</p>
	{#if dataProtectionOfficer}
		<p class="mt-4">
			<strong>Data Protection Officer</strong> <br />
			If you have any questions about this privacy notice or our data protection practices, please contact
			our Data Protection Officer:
			<br />{dataProtectionOfficer}
			<br />Email: {dpoEmail}
		</p>
	{/if}
	<p class="mt-4">
		<strong>Data Collection and Usage</strong> <br />
		We collect personal data only to the extent necessary to provide our services. The data we collect
		includes:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>Contact information (such as name and email address)</li>
		<li>Usage data (such as IP address, browser type, and access times)</li>
	</ul>

	This data is collected to operate our service, improve user experience, and ensure security.
	<p class="mt-4">
		<strong>Use of Service Workers and Caching</strong> <br />
		We use service workers to cache certain assets, such as map tiles, locally on your device. This helps
		to improve load times and provide offline capabilities. No personal data is stored in the cache.
	</p>
	<p class="mt-4">
		<strong>Data Sharing</strong> <br />
		We do not share your personal data with third parties, except as required by law or to protect our
		rights.
	</p>
	<p class="mt-4">
		<strong>Data Storage</strong> <br />
		Your data is stored securely in Supabase, a service we use for our database needs. The data is stored
		in the US-East region. We have ensured that Supabase provides an adequate level of data protection.
	</p>
	<p class="mt-4">
		<strong>Anonymous Web Analytics</strong> <br />
		We use Vercel Web Analytics to gather aggregated and anonymized data about the usage of our website.
		This data includes information such as page views, browser type, and geographic location, but does
		not contain any personal information or identifiers. Vercel Web Analytics helps us improve our website
		by understanding user interactions and optimizing the user experience.
	</p>
	<p class="mt-4">
		<strong>Cookies</strong> <br />
		Please refer to our <a class="link" href="/cookie-policy">Cookie Policy</a> for more information.
	</p>
	<p class="mt-4">
		<strong>Your Rights</strong> <br />
		Under the GDPR, you have the following rights regarding your personal data:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>The right to access your data</li>
		<li>The right to correct your data</li>
		<li>The right to delete your data</li>
		<li>The right to restrict or object to processing</li>
		<li>The right to data portability</li>
	</ul>
	To exercise these rights, please contact us at {privacyEmail}.
	<p class="mt-4">
		<strong>Changes to This Privacy Notice</strong> <br />
		We may update this privacy notice from time to time to reflect changes in our practices or legal
		requirements. We encourage you to review this page periodically for the latest information on our
		privacy practices.
	</p>
	<p class="mt-4">
		<strong>Contact</strong> <br />
		If you have any questions or concerns about this privacy notice, please contact us at:

		<br />
		<a href="mailto:{privacyEmail}" class="text-blue-500 hover:underline">{privacyEmail}</a>
	</p>

	<h2 class="text-xl font-semibold mt-8 mb-2">German Version</h2>
	<p class="mt-4">
		<strong>Einführung</strong> <br />
		Vielen Dank für Ihren Besuch auf unserer Website. Der Schutz Ihrer persönlichen Daten ist uns sehr
		wichtig. Diese Datenschutzerklärung erklärt, welche Daten wir erheben, wie wir sie verwenden und
		welche Rechte Sie bezüglich Ihrer Daten haben.
	</p>
	<p class="mt-4">
		<strong>Verantwortlicher für die Datenverarbeitung</strong> <br />
		Der Verantwortliche für die Datenverarbeitung auf dieser Website ist:
		<br />{name}, Betreiber der Website GuestLink.
		<br />{address}
		<br />E-Mail: {privacyEmail}
	</p>
	{#if dataProtectionOfficer}
		<p class="mt-4">
			<strong>Datenschutzbeauftragter</strong> <br />
			Wenn Sie Fragen zu dieser Datenschutzerklärung oder unseren Datenschutzpraktiken haben, kontaktieren
			Sie bitte unseren Datenschutzbeauftragten:
			<br />{dataProtectionOfficer}
			<br />E-Mail: {dpoEmail}
		</p>
	{/if}
	<p class="mt-4">
		<strong>Datenerhebung und -nutzung</strong> <br />
		Wir erheben personenbezogene Daten nur im notwendigen Umfang, um unsere Dienstleistungen bereitzustellen.
		Die erhobenen Daten umfassen:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>Kontaktdaten (wie Name und E-Mail-Adresse)</li>
		<li>Nutzungsdaten (wie IP-Adresse, Browsertyp und Zugriffszeiten)</li>
	</ul>
	Diese Daten werden gesammelt, um unseren Service zu betreiben, die Benutzererfahrung zu verbessern
	und die Sicherheit zu gewährleisten.
	<p class="mt-4">
		<strong>Verwendung von Service-Arbeitern und Caching</strong> <br />
		Wir verwenden Service-Arbeiter, um bestimmte Ressourcen wie Kartentiles lokal auf Ihrem Gerät zu
		speichern. Dies trägt dazu bei, die Ladezeiten zu verkürzen und Offline-Funktionen bereitzustellen.
		Es werden keine personenbezogenen Daten im Cache gespeichert.
	</p>
	<p class="mt-4">
		<strong>Weitergabe von Daten</strong> <br />
		Wir geben Ihre personenbezogenen Daten nicht an Dritte weiter, außer wenn dies gesetzlich vorgeschrieben
		ist oder zum Schutz unserer Rechte erforderlich ist.
	</p>
	<p class="mt-4">
		<strong>Datenspeicherung</strong> <br />
		Ihre Daten werden sicher in Supabase gespeichert, einem Dienst, den wir für unsere Datenbankanforderungen
		nutzen. Die Daten werden in der Region US-East gespeichert. Wir haben sichergestellt, dass Supabase
		ein angemessenes Datenschutzniveau bietet.
	</p>
	<p class="mt-4">
		<strong>Anonyme Webanalytik</strong> <br />
		Wir verwenden Vercel Web Analytics, um aggregierte und anonymisierte Daten über die Nutzung unserer
		Website zu sammeln. Diese Daten umfassen Informationen wie Seitenaufrufe, Browsertyp und geografische
		Lage, enthalten jedoch keine persönlichen Informationen oder Identifikatoren. Vercel Web Analytics
		hilft uns, unsere Website zu verbessern, indem wir die Interaktionen der Benutzer verstehen und die
		Benutzererfahrung optimieren.
	</p>
	<p class="mt-4">
		<strong>Cookies</strong> <br />
		Hier gehts zur <a class="link" href="/cookie-policy">Cookie-Policy</a>.
	</p>

	<p class="mt-4">
		<strong>Ihre Rechte</strong> <br />
		Unter der DSGVO haben Sie folgende Rechte bezüglich Ihrer personenbezogenen Daten:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>Das Recht auf Zugang zu Ihren Daten</li>
		<li>Das Recht auf Berichtigung Ihrer Daten</li>
		<li>Das Recht auf Löschung Ihrer Daten</li>
		<li>Das Recht auf Einschränkung oder Widerspruch gegen die Verarbeitung</li>
		<li>Das Recht auf Datenübertragbarkeit</li>
	</ul>
	Um diese Rechte auszuüben, kontaktieren Sie uns bitte unter {privacyEmail}.
	<p class="mt-4">
		<strong>Änderungen dieser Datenschutzerklärung</strong> <br />
		Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen in unseren Praktiken
		oder rechtlichen Anforderungen zu berücksichtigen. Wir empfehlen Ihnen, diese Seite regelmäßig auf
		die neuesten Informationen zu unseren Datenschutzpraktiken zu überprüfen.
	</p>
	<p class="mt-4">
		<strong>Kontakt</strong> <br />
		Wenn Sie Fragen oder Bedenken zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter:
		<br /><a href="mailto:{privacyEmail}" class="text-blue-500 hover:underline">{privacyEmail}</a>
	</p>
</div>
