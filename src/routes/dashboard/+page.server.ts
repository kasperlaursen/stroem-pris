import type { Actions } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, invalid, redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export const actions: Actions = {
	updateSettings: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			// the user is not signed in
			throw error(403, { message: 'Unauthorized' });
		}
		// we are save, let the user create the post
		const formData = await request.formData();
		const moms: boolean = formData.get('moms') === 'moms';
		const elafgift: boolean = formData.get('elafgift') === 'elafgift';
		const tariffer: boolean = formData.get('tariffer') === 'tariffer';

		const { error: setSettingsError } = await supabaseClient.from('user_settings').upsert({
			user_id: session.user.id,
			show_vat: moms,
			show_fees: elafgift,
			show_tariff: tariffer
		});

		if (setSettingsError) {
			console.log(setSettingsError);
			return invalid(500, {
				supabaseErrorMessage: setSettingsError.message
			});
		}
		return;
	},
	updateMonthlySettings: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			// the user is not signed in
			throw error(403, { message: 'Unauthorized' });
		}
		// we are save, let the user create the post
		const formData = await request.formData();
		const fixedPrice = formData.get('fixedPrice');
		const feePrice = formData.get('feePrice');
		const month = formData.get('month') ? Number(formData.get('month')) : DateTime.now().month;
		const year = formData.get('year') ? Number(formData.get('year')) : DateTime.now().year;

		console.log({ fixedPrice, feePrice, month, year, formMonth: formData.get('month') });

		const data: { user_id: string; month: string; fixed_price?: number; flex_fee?: number } = {
			user_id: session.user.id,
			month: DateTime.fromObject({ month, year }).toISODate()
		};

		if (fixedPrice) {
			data.fixed_price = Number(fixedPrice);
		}

		if (feePrice) {
			data.flex_fee = Number(feePrice);
		}

		const { data: settings, error: getSettingsError } = await supabaseClient
			.from('user_monthly_settings')
			.select('user_id, month');

		if (getSettingsError) {
			console.log(getSettingsError);
		}

		let setSettingsError;
		if (settings?.find(({ user_id, month }) => data.user_id === user_id && month === data.month)) {
			const { error } = await supabaseClient
				.from('user_monthly_settings')
				.update(data)
				.eq('user_id', session.user.id)
				.eq('month', data.month);
			setSettingsError = error;
		} else {
			const { error } = await supabaseClient.from('user_monthly_settings').insert(data);
			setSettingsError = error;
		}

		if (setSettingsError) {
			console.log(setSettingsError);
			return invalid(500, {
				supabaseErrorMessage: setSettingsError.message
			});
		}
		return;
	}
};
