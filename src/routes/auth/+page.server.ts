import type { InternalResponse } from "$lib/types/InternalResponse";
import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
  const session = await getSession();
  if (session) {
    throw redirect(303, "/");
  }
};

const InvalidCredentialsResponse: InternalResponse<null> = {
  success: false,
  error: {
    code: 400,
    message: "De indtastede login oplysninger var ikke korrekte. Prøv igen.",
  },
};

export const actions: Actions = {
  signin: async ({ request, locals: { supabase } }) => {
    const supabaseClient = supabase;
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return InvalidCredentialsResponse;
    }

    const { error: signinError } = await supabaseClient.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (signinError) {
      if (signinError.status === 400) {
        return InvalidCredentialsResponse;
      }
      throw error(500, {
        message: "Der er sket en server fejl. Prøv venligst igen.",
      });
    }

    throw redirect(303, "/");
  },
  signout: async ({ locals: { supabase } }) => {
    const supabaseClient = supabase;
    await supabaseClient.auth.signOut();
    throw redirect(303, "/");
  },
};
