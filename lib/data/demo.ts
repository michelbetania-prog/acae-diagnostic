import { Business, Category, Product } from "@/lib/types";

export const demoCategories: Category[] = [
  { id: "cat-1", business_id: null, name: "Comida criolla", slug: "comida-criolla" },
  { id: "cat-2", business_id: null, name: "Café y brunch", slug: "cafe-brunch" },
  { id: "cat-3", business_id: null, name: "Repostería", slug: "reposteria" },
  { id: "cat-4", business_id: null, name: "Comida saludable", slug: "saludable" }
];

export const demoBusinesses: Business[] = [
  {
    id: "b1",
    slug: "atelier-criollo",
    name: "Atelier Criollo",
    logo_url: null,
    cover_url: null,
    description: "Cocina dominicana contemporánea con menú diario, combos corporativos y retiro coordinado.",
    zone: "Santo Domingo Este",
    address: "Av. Venezuela, Santo Domingo Este",
    whatsapp: "18095550101",
    is_open: true,
    is_active: true,
    category: "Comida criolla",
    hours: "Lun-Sáb 11:00 AM - 9:00 PM",
    rating: 4.8,
    review_count: 124,
    estimated_time: "25-35 min",
    delivery_available: true,
    pickup_available: true,
    featured: true
  },
  {
    id: "b2",
    slug: "manglar-cafe",
    name: "Manglar Café",
    logo_url: null,
    cover_url: null,
    description: "Café de especialidad, desayunos ligeros y bandejas para reuniones de equipos pequeños.",
    zone: "Santiago",
    address: "Los Jardines Metropolitanos, Santiago",
    whatsapp: "18095550202",
    is_open: false,
    is_active: true,
    category: "Café y brunch",
    hours: "Todos los días 7:30 AM - 6:00 PM",
    rating: 4.7,
    review_count: 89,
    estimated_time: "15-25 min",
    delivery_available: true,
    pickup_available: true
  },
  {
    id: "b3",
    slug: "casa-dulce-maria",
    name: "Casa Dulce María",
    logo_url: null,
    cover_url: null,
    description: "Postres artesanales, bizcochos por encargo y detalles dulces para celebraciones.",
    zone: "La Romana",
    address: "Centro, La Romana",
    whatsapp: "18095550303",
    is_open: true,
    is_active: true,
    category: "Repostería",
    hours: "Mar-Dom 9:00 AM - 6:00 PM",
    rating: 4.9,
    review_count: 203,
    estimated_time: "30-45 min",
    delivery_available: false,
    pickup_available: true,
    featured: true
  }
];

export const demoProducts: Product[] = [
  {
    id: "p1",
    business_id: "b1",
    category_id: "cat-1",
    name: "Bowl de la casa",
    description: "Arroz premium, pollo guisado, aguacate, ensalada fresca y toque de cilantro.",
    price: 340,
    image_url: null,
    is_active: true,
    is_featured: true,
    category: { name: "Favoritos" }
  },
  {
    id: "p2",
    business_id: "b1",
    category_id: "cat-1",
    name: "Mofongo ejecutivo",
    description: "Mofongo de cerdo con caldo artesanal y topping crujiente.",
    price: 460,
    image_url: null,
    is_active: true,
    category: { name: "Platos fuertes" }
  },
  {
    id: "p3",
    business_id: "b1",
    category_id: "cat-1",
    name: "Combo oficina",
    description: "Tres almuerzos del día, jugos naturales y empaque para llevar.",
    price: 990,
    image_url: null,
    is_active: true,
    is_featured: true,
    category: { name: "Promociones" }
  },
  {
    id: "p4",
    business_id: "b2",
    category_id: "cat-2",
    name: "Brunch manglar",
    description: "Tostada de masa madre, huevos, fruta fresca y café frío.",
    price: 385,
    image_url: null,
    is_active: true,
    is_featured: true,
    category: { name: "Brunch" }
  },
  {
    id: "p5",
    business_id: "b3",
    category_id: "cat-3",
    name: "Tres leches premium",
    description: "Porción individual con crema suave, canela y topping de temporada.",
    price: 210,
    image_url: null,
    is_active: true,
    is_featured: true,
    category: { name: "Postres" }
  }
];
