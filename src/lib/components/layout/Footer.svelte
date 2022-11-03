<script>
	import Link from '../base/Link.svelte';
</script>

<footer
	class="bg-white dark:bg-neutral-800 dark:text-slate-50 text-slate-600 dark:border-neutral-700 border-slate-200 p-4 flex justify-between border-t "
>
	<p>
		<b>Kilder:</b>
		<Link href="https://energinet.dk/El/Elmarkedet/Tariffer/Aktuelle-tariffer">
			Transmissionstarif & Systemtarif fra Energinet.dk
		</Link>
		<span class="px-4">●</span>
		<Link href="https://www.energidataservice.dk/tso-electricity/Elspotprices">
			Spot Priser fra Energidataservice.dk
		</Link>
		<span class="px-4">●</span>
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
