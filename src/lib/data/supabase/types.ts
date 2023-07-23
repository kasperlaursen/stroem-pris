export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      datahub_tokens: {
        Row: {
          created_at: string | null;
          data_token: string | null;
          data_token_expire_utc: string | null;
          deliver_meter_id: string | null;
          id: number;
          refresh_token: string | null;
          usage_meter_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          data_token?: string | null;
          data_token_expire_utc?: string | null;
          deliver_meter_id?: string | null;
          id?: number;
          refresh_token?: string | null;
          usage_meter_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          data_token?: string | null;
          data_token_expire_utc?: string | null;
          deliver_meter_id?: string | null;
          id?: number;
          refresh_token?: string | null;
          usage_meter_id?: string | null;
          user_id?: string;
        };
      };
      fees: {
        Row: {
          created_at: string | null;
          from: string | null;
          id: number;
          key: Database["public"]["Enums"]["energy_fees"];
          value: number;
        };
        Insert: {
          created_at?: string | null;
          from?: string | null;
          id?: number;
          key: Database["public"]["Enums"]["energy_fees"];
          value: number;
        };
        Update: {
          created_at?: string | null;
          from?: string | null;
          id?: number;
          key?: Database["public"]["Enums"]["energy_fees"];
          value?: number;
        };
      };
      meter_data: {
        Row: {
          created_at: string | null;
          hour_utc: string;
          id: number;
          measurement: number | null;
          meter_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          hour_utc: string;
          id?: number;
          measurement?: number | null;
          meter_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          hour_utc?: string;
          id?: number;
          measurement?: number | null;
          meter_id?: string;
          user_id?: string;
        };
      };
      net_companies: {
        Row: {
          created_at: string | null;
          id: number;
          identifier: string;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          identifier: string;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          identifier?: string;
          name?: string | null;
        };
      };
      nettarrif: {
        Row: {
          created_at: string | null;
          from_date: string;
          hour_of_day: number;
          id: number;
          net_company: string;
          price_dkk: number;
        };
        Insert: {
          created_at?: string | null;
          from_date: string;
          hour_of_day: number;
          id?: number;
          net_company: string;
          price_dkk: number;
        };
        Update: {
          created_at?: string | null;
          from_date?: string;
          hour_of_day?: number;
          id?: number;
          net_company?: string;
          price_dkk?: number;
        };
      };
      spot: {
        Row: {
          created_at: string | null;
          hour_utc: string;
          id: string;
          price_area: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk: number | null;
        };
        Insert: {
          created_at?: string | null;
          hour_utc: string;
          id?: string;
          price_area?: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk?: number | null;
        };
        Update: {
          created_at?: string | null;
          hour_utc?: string;
          id?: string;
          price_area?: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk?: number | null;
        };
      };
      spot_manual: {
        Row: {
          created_at: string | null;
          hour_utc: string;
          id: string;
          price_area: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk: number | null;
        };
        Insert: {
          created_at?: string | null;
          hour_utc: string;
          id?: string;
          price_area?: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk?: number | null;
        };
        Update: {
          created_at?: string | null;
          hour_utc?: string;
          id?: string;
          price_area?: Database["public"]["Enums"]["price_areas"] | null;
          price_dkk?: number | null;
        };
      };
      user_monthly_settings: {
        Row: {
          created_at: string | null;
          fixed_price: number | null;
          flex_fee: number | null;
          id: number;
          month: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          fixed_price?: number | null;
          flex_fee?: number | null;
          id?: number;
          month?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          fixed_price?: number | null;
          flex_fee?: number | null;
          id?: number;
          month?: string | null;
          user_id?: string;
        };
      };
      user_settings: {
        Row: {
          created_at: string | null;
          price_area: Database["public"]["Enums"]["price_areas"];
          show_fees: boolean | null;
          show_tariff: boolean | null;
          show_vat: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          price_area?: Database["public"]["Enums"]["price_areas"];
          show_fees?: boolean | null;
          show_tariff?: boolean | null;
          show_vat?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          price_area?: Database["public"]["Enums"]["price_areas"];
          show_fees?: boolean | null;
          show_tariff?: boolean | null;
          show_vat?: boolean | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      energy_fees:
        | "elafgift"
        | "transmissionstarif"
        | "systemtarif"
        | "balancetarif";
      price_areas: "DK1" | "DK2";
      pricearea: "DK1" | "DK2";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
