import { SVGProps } from "react";

type IconName =
  | "store"
  | "message"
  | "chart"
  | "catalog"
  | "clock"
  | "qr"
  | "location"
  | "star"
  | "bag"
  | "truck"
  | "spark"
  | "users"
  | "settings"
  | "plus"
  | "external";

const paths: Record<IconName, string> = {
  store: "M4 10h16l-1.5-5h-13L4 10Zm1 0v9h14v-9M8 19v-5h8v5",
  message: "M5 6h14v9H8l-3 3V6Z",
  chart: "M4 19V5m0 14h16M8 15l3-4 3 2 5-7",
  catalog: "M6 5h12v14H6V5Zm3 4h6M9 13h6",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v5l3 2",
  qr: "M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h2v2h-2v-2Zm4 0h1v5h-5v-1h4v-4Z",
  location: "M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  star: "m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0",
  truck: "M4 7h10v8H4V7Zm10 3h3l3 3v2h-6v-5ZM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  spark: "M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z",
  users: "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3 3 0 1 0 0-6M3 21a5 5 0 0 1 10 0M14 20a4 4 0 0 1 7-2.6",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4h-2M6 12H4m13.7-5.7-1.4 1.4M7.7 16.3l-1.4 1.4m0-11.4 1.4 1.4m8.6 8.6 1.4 1.4",
  plus: "M12 5v14M5 12h14",
  external: "M8 8h8v8M16 8 7 17"
};

export function Icon({ name, className, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
