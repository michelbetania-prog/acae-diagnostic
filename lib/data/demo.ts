import { Business, Category, Product } from "@/lib/types";
export const demoCategories: Category[] = [
 { id:"cat-1", business_id:null, name:"Pica pollo", slug:"pica-pollo" },
 { id:"cat-2", business_id:null, name:"Comida criolla", slug:"comida-criolla" },
 { id:"cat-3", business_id:null, name:"Postres", slug:"postres" }
];
export const demoBusinesses: Business[] = [
 { id:"b1", slug:"la-esquina-criolla", name:"La Esquina Criolla", logo_url:null, description:"Platos dominicanos frescos para retirar o pedir por WhatsApp.", zone:"Santo Domingo Este", whatsapp:"18095550101", is_open:true, is_active:true, category:"Comida criolla", hours:"Lun-Sáb 11:00 AM - 9:00 PM" },
 { id:"b2", slug:"pollo-el-manguito", name:"Pollo El Manguito", logo_url:null, description:"Pica pollo, combos familiares y yaniqueques.", zone:"Santiago", whatsapp:"18095550202", is_open:false, is_active:true, category:"Pica pollo", hours:"Todos los días 12:00 PM - 10:00 PM" },
 { id:"b3", slug:"dulce-maria", name:"Dulce María", logo_url:null, description:"Postres caseros y bizcochos por encargo.", zone:"La Romana", whatsapp:"18095550303", is_open:true, is_active:true, category:"Postres", hours:"Mar-Dom 9:00 AM - 6:00 PM" }
];
export const demoProducts: Product[] = [
 { id:"p1", business_id:"b1", category_id:"cat-2", name:"La Bandera", description:"Arroz, habichuelas, pollo guisado y ensalada.", price:295, image_url:null, is_active:true, category:{ name:"Comida criolla" } },
 { id:"p2", business_id:"b1", category_id:"cat-2", name:"Mofongo de cerdo", description:"Mofongo con chicharrón y caldo.", price:420, image_url:null, is_active:true, category:{ name:"Comida criolla" } },
 { id:"p3", business_id:"b2", category_id:"cat-1", name:"Combo pica pollo", description:"3 piezas, tostónes y refresco.", price:350, image_url:null, is_active:true, category:{ name:"Pica pollo" } },
 { id:"p4", business_id:"b3", category_id:"cat-3", name:"Tres leches", description:"Porción individual con topping de cereza.", price:180, image_url:null, is_active:true, category:{ name:"Postres" } }
];
