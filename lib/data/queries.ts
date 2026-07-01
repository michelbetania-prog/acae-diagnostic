import { Business, Category } from "@/lib/types";
import { demoBusinesses, demoCategories, demoProducts } from "@/lib/data/demo";

// This MVP ships with demo data so it can run immediately. The Supabase SQL and
// env vars are included; swap these query functions to Supabase calls when keys
// and dependencies are available in the target deployment.
export async function getPublicBusinesses(filters?: { zone?: string; category?: string; open?: string }) {
  return filterBusinesses(demoBusinesses, filters);
}
function filterBusinesses(items: Business[], filters?: { zone?: string; category?: string; open?: string }) {
  return items.filter((b) => (!filters?.zone || b.zone === filters.zone) && (!filters?.category || b.category === filters.category) && (filters?.open !== "true" || b.is_open));
}
export async function getBusinessBySlug(slug: string) {
  return demoBusinesses.find((b) => b.slug === slug) ?? null;
}
export async function getProductsForBusiness(businessId: string, activeOnly = true) {
  return demoProducts.filter((p) => p.business_id === businessId && (!activeOnly || p.is_active));
}
export async function getCategories(): Promise<Category[]> { return demoCategories; }
