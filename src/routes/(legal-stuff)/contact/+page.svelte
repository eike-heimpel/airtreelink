<script>
	import { customerSupportEmail } from '$lib/stores/business_info';
</script>

<div class="container mx-auto my-10 p-5 shadow-md rounded-lg">
	<h1 class="text-2xl font-bold mb-4">Contact Us</h1>

	<p class="mt-4">
		If you have any questions, concerns, or feedback, please feel free to contact us at:
	</p>
	<p class="mt-4">
		<strong>Email:</strong> <br />
		<a href="mailto:{customerSupportEmail}" class="text-blue-500 hover:underline"
			>{customerSupportEmail}</a
		>
	</p>
</div>
