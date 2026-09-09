export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number | null;
}