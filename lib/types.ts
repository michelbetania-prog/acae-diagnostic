export type Role = "admin" | "comercio";

export type Business = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  cover_url?: string | null;
  description: string | null;
  zone: string;
  address?: string | null;
  whatsapp: string;
  is_open: boolean;
  is_active: boolean;
  category: string;
  hours: string | null;
  rating?: number;
  review_count?: number;
  estimated_time?: string;
  delivery_available?: boolean;
  pickup_available?: boolean;
  featured?: boolean;
};

export type Product = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  is_featured?: boolean;
  category?: { name: string } | null;
};

export type Category = {
  id: string;
  business_id: string | null;
  name: string;
  slug: string;
};
