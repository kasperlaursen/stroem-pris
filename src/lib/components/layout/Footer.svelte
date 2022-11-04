<script>
	import Link from '../base/Link.svelte';
</script>

<footer
	class="bg-white dark:bg-neutral-900 dark:border-neutral-700 border-slate-200 p-4 gap-4 flex justify-between border-t flex-wrap"
>
	<p class="flex gap-2 flex-wrap">
		Kilder:
		<Link href="https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer">
			Transmissionstarif & Systemtarif fra Energinet.dk
		</Link> |
		<Link href="https://www.energidataservice.dk/tso-electricity/Elspotprices">
			Spot Priser fra Energidataservice.dk
		</Link> |
		<Link href="https://skat.dk/data.aspx?oid=2234584">ElAfgift</Link>
	</p>
	<p>
		Created by <Link
			class="text-sky-600"
			target="_blank"
			rel="noreferrer"
			href="https://www.linkedin.com/in/habber/"
		>
			Kasper Laursen
		</Link>
	</p>
</footer>
