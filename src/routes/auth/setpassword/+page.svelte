<script lang="ts">
  import type { ActionData } from "./$types";
  export let form: ActionData;
</script>

<h1>Password Reset</h1>
<p>Please set a new password for your account below!</p>

{#if form && form?.error}
  <p class="p-8">{form.error}</p>
{/if}

<form method="POST" action="?/setPassword">
  <input name="password" type="password" placeholder="New Password" />
  <button>Update Password</button>
</form>
