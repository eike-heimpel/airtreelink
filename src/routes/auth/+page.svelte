<form method="POST" action="?/login" class="space-y-4 p-6 rounded-lg shadow-md max-w-md mx-auto">
	<div class="form-control">
		<label class="label" for="email">
			<span class="label-text">Email</span>
		</label>
		<input
			name="email"
			type="email"
			placeholder="Enter your email"
			class="input input-bordered w-full"
		/>
	</div>
	<div class="form-control">
		<label class="label" for="password">
			<span class="label-text">Password</span>
		</label>
		<input
			name="password"
			type="password"
			placeholder="Enter your password"
			class="input input-bordered w-full"
		/>
	</div>
	<div class="flex justify-between">
		<button type="submit" class="btn btn-primary">Login</button>
		<button type="submit" formaction="?/signup" class="btn btn-accent">Sign up</button>
	</div>
</form>
