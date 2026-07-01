export type Role = "admin" | "comercio";
export type Business = { id:string; slug:string; name:string; logo_url:string|null; description:string|null; zone:string; whatsapp:string; is_open:boolean; is_active:boolean; category:string; hours:string|null; };
export type Product = { id:string; business_id:string; category_id:string|null; name:string; description:string|null; price:number; image_url:string|null; is_active:boolean; category?: { name:string } | null };
export type Category = { id:string; business_id:string|null; name:string; slug:string };
