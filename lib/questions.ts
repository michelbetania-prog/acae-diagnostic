export type Dimension = "atraccion" | "conversion" | "autoridad" | "escalabilidad";

export type Question = {
  id: number;
  dimension: Dimension;
  text: string;
};

export const questions: Question[] = [
  { id: 1, dimension: "atraccion", text: "¿Tu negocio genera nuevos prospectos cada semana?" },
  { id: 2, dimension: "atraccion", text: "¿Tienes un sistema claro para atraer clientes potenciales?" },
  { id: 3, dimension: "atraccion", text: "¿Tu marca tiene visibilidad constante en tu mercado?" },
  { id: 4, dimension: "conversion", text: "¿Tienes un proceso de ventas definido?" },
  {
    id: 5,
    dimension: "conversion",
    text: "¿Tus prospectos entienden tu valor antes de hablar contigo?"
  },
  { id: 6, dimension: "conversion", text: "¿Mides tu tasa de conversión?" },
  { id: 7, dimension: "autoridad", text: "¿Tu marca te posiciona como experto en tu sector?" },
  {
    id: 8,
    dimension: "autoridad",
    text: "¿Los clientes confían en tu negocio antes de la primera reunión?"
  },
  { id: 9, dimension: "autoridad", text: "¿Publicas contenido de valor de forma consistente?" },
  {
    id: 10,
    dimension: "escalabilidad",
    text: "¿Tu negocio puede crecer sin depender totalmente de ti?"
  },
  {
    id: 11,
    dimension: "escalabilidad",
    text: "¿Tienes sistemas o automatización en tus operaciones?"
  },
  {
    id: 12,
    dimension: "escalabilidad",
    text: "¿Tu negocio podría manejar el doble de clientes hoy?"
  }
];
