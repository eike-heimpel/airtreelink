<script>
	import { page } from '$app/stores';

	$: console.log($page);
</script>

<div class="flex min-h-screen bg-gray-100">
	<nav>
		<ul class="menu bg-base-200 w-56 rounded-box">
			<ul class="menu-list">
				<li class="rounded-lg {$page.url.pathname.endsWith('/account') ? 'bg-secondary' : ''}">
					<a href="/private/{$page.params.userId}/account"> Account Settings </a>
				</li>
				<li class="rounded-lg {$page.url.pathname.endsWith('/listings') ? 'bg-secondary' : ''}">
					<a href="/private/{$page.params.userId}/listings"> Listings </a>
				</li>
				<!-- Additional navigation items can be added here -->
			</ul>
		</ul>
	</nav>

	<div class="flex-1 p-8 text-gray-800">
		<slot></slot>
	</div>
</div>
