<script>
	import { goto } from '$app/navigation';
</script>

<div class="container mx-auto my-10 p-5 shadow-md rounded-lg">
	<h1 class="text-2xl font-bold mb-4">Cookie Policy / Cookie-Richtlinie</h1>

	<h2 class="text-xl font-semibold mb-2">English Version</h2>
	<p class="mt-4">
		You might have noticed we don't have a cookie consent banner. That's because we genuinely care
		about your privacy and have set up our website so we don't need one. Where we do collect data,
		we do so anonymously and in full compliance with GDPR. Some basic web features, like embedded
		YouTube videos, make it impossible to completely remove trackers, but you will see individual
		consent notices before interacting with external services that might not comply with our <a
			href="/privacy-notice"
			class="text-blue-500 hover:underline"
			on:click|preventDefault={() => goto('/privacy-notice')}>privacy standards</a
		>.
	</p>

	<p class="mt-4">
		<strong>What Are Cookies?</strong> <br />
		Cookies are small text files that are placed on your device to help the website provide a better
		user experience. In general, cookies are used to retain user preferences, store information for things
		like shopping carts, and provide anonymized tracking data to third-party applications.
	</p>

	<p class="mt-4">
		<strong>Types of Cookies We Use</strong> <br />
		We use the following types of cookies:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>
			<strong>Essential Cookies:</strong> These are necessary for the website to function and cannot
			be disabled. They are usually only set in response to actions made by you, such as setting your
			privacy preferences, logging in, or filling in forms.
		</li>
		<li>
			<strong>Analytics Cookies:</strong> We use Vercel Web Analytics, which does not use cookies or
			track personal data. It collects anonymized data about website usage to help us improve our services.
		</li>
		<li>
			<strong>Third-Party Cookies:</strong> We embed YouTube videos on our website, which may set third-party
			cookies from Google. However, these videos are gated behind a consent form, and you must explicitly
			consent before any tracking cookies are placed.
		</li>
	</ul>

	<p class="mt-4">
		<strong>Managing Cookies</strong> <br />
		Most web browsers allow you to control cookies through their settings. You can choose to disable
		or delete cookies as desired. However, please note that disabling certain cookies may affect the
		functionality of the website.
	</p>

	<p class="mt-4">
		For more information, please refer to our <a
			href="/privacy-notice"
			class="text-blue-500 hover:underline"
			on:click|preventDefault={() => goto('/privacy-notice')}>Privacy Notice</a
		>.
	</p>

	<h2 class="text-xl font-semibold mt-8 mb-2">Deutsche Version</h2>
	<p class="mt-4">
		Sie haben vielleicht bemerkt, dass wir keine Cookie-Zustimmungsbannerauf unserer Website haben.
		Das liegt daran, dass wir Ihre Privatsphäre wirklich ernst nehmen und unsere Website so
		eingerichtet haben, dass wir keine benötigen. Wenn wir Daten sammeln, tun wir dies anonym und in
		vollständiger Übereinstimmung mit der DSGVO. Einige grundlegende Web-Funktionen, wie
		eingebettete YouTube-Videos, machen es unmöglich, Tracker vollständig zu entfernen, aber Sie
		werden individuelle Zustimmungshinweise sehen, bevor Sie mit externen Diensten interagieren, die
		möglicherweise nicht unseren <a
			href="/privacy-notice"
			class="text-blue-500 hover:underline"
			on:click|preventDefault={() => goto('/privacy-notice')}>Datenschutzstandards</a
		> entsprechen.
	</p>

	<p class="mt-4">
		<strong>Was sind Cookies?</strong> <br />
		Cookies sind kleine Textdateien, die auf Ihrem Gerät platziert werden, um die Website eine bessere
		Benutzererfahrung zu bieten. Im Allgemeinen werden Cookies verwendet, um Benutzereinstellungen zu
		speichern, Informationen für Dinge wie Einkaufswagen zu speichern und anonymisierte Tracking-Daten
		für Drittanwendungen bereitzustellen.
	</p>

	<p class="mt-4">
		<strong>Arten von Cookies, die wir verwenden</strong> <br />
		Wir verwenden folgende Arten von Cookies:
	</p>
	<ul class="list-disc list-inside mt-2">
		<li>
			<strong>Essenzielle Cookies:</strong> Diese sind für die Funktion der Website erforderlich und
			können nicht deaktiviert werden. Sie werden in der Regel nur als Reaktion auf von Ihnen durchgeführte
			Aktionen gesetzt, wie das Festlegen Ihrer Datenschutzeinstellungen, das Anmelden oder das Ausfüllen
			von Formularen.
		</li>
		<li>
			<strong>Analyse-Cookies:</strong> Wir verwenden Vercel Web Analytics, das keine Cookies verwendet
			oder personenbezogene Daten verfolgt. Es sammelt anonymisierte Daten über die Website-Nutzung,
			um uns bei der Verbesserung unserer Dienste zu unterstützen.
		</li>
		<li>
			<strong>Cookies von Drittanbietern:</strong> Wir betten YouTube-Videos auf unserer Website ein,
			die möglicherweise Cookies von Google setzen. Diese Videos sind jedoch hinter einer Zustimmungsformular
			geschützt, und Sie müssen ausdrücklich zustimmen, bevor Tracking-Cookies platziert werden.
		</li>
	</ul>

	<p class="mt-4">
		<strong>Verwalten von Cookies</strong> <br />
		Die meisten Webbrowser erlauben Ihnen, Cookies über ihre Einstellungen zu kontrollieren. Sie können
		Cookies nach Wunsch deaktivieren oder löschen. Bitte beachten Sie jedoch, dass die Deaktivierung
		bestimmter Cookies die Funktionalität der Website beeinträchtigen kann.
	</p>

	<p class="mt-4">
		Für weitere Informationen lesen Sie bitte unsere <a
			href="/privacy-notice"
			class="text-blue-500 hover:underline"
			on:click|preventDefault={() => goto('/privacy-notice')}>Datenschutzhinweise</a
		>.
	</p>
</div>
