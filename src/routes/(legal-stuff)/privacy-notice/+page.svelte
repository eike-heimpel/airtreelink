<script>
	export let companyName = '[Your Company Name]';
	export let companyEmail = '[Your Company Email]';
	export let companyAddress = '[Your Company Address]';
	export let dataProtectionOfficer;
	export let dpoEmail;
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
		<br />{companyName}
		<br />{companyAddress}
		<br />Email: {companyEmail}
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
	<!-- Removed unnecessary closing </p> tags -->
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
	To exercise these rights, please contact us at {companyEmail}.
	<p class="mt-4">
		<strong>Changes to This Privacy Notice</strong> <br />
		We may update this privacy notice from time to time to reflect changes in our practices or legal
		requirements. We encourage you to review this page periodically for the latest information on our
		privacy practices.
	</p>
	<p class="mt-4">
		<strong>Contact</strong> <br />
		If you have any questions or concerns about this privacy notice, please contact us at:
		<br />{companyName}
		<br />{companyAddress}
		<br />Email: {companyEmail}
	</p>

	<h2 class="text-xl font-semibold mt-8 mb-2">German Version</h2>
	<p class="mt-4">
		<strong>Einführung</strong> <br />
		Vielen Dank für Ihren Besuch auf unserer Website. Der Schutz Ihrer persönlichen Daten ist uns sehr
		wichtig. Diese Datenschutzerklärung erklärt, welche Daten wir erheben, wie wir sie verwenden und
		welche Rechte Sie bezüglich Ihrer Daten haben.
	</p>
	<p class="mt-4">
		<strong>Datenschutzbeauftragter</strong> <br />
		Der Verantwortliche für die Datenverarbeitung auf dieser Website ist:
		<br />{companyName}
		<br />{companyAddress}
		<br />E-Mail: {companyEmail}
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
	Um diese Rechte auszuüben, kontaktieren Sie uns bitte unter {companyEmail}.
	<p class="mt-4">
		<strong>Änderungen dieser Datenschutzerklärung</strong> <br />
		Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen in unseren Praktiken
		oder rechtlichen Anforderungen zu berücksichtigen. Wir empfehlen Ihnen, diese Seite regelmäßig auf
		die neuesten Informationen zu unseren Datenschutzpraktiken zu überprüfen.
	</p>
	<p class="mt-4">
		<strong>Kontakt</strong> <br />
		Wenn Sie Fragen oder Bedenken zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter:
		<br />{companyName}
		<br />{companyAddress}
		<br />E-Mail: {companyEmail}
	</p>
</div>
