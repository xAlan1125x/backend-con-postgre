export interface CrearProductoDto {
  nombre: string;
  precio: number;
  categoria_id: number;
  stock?: number;
}

export interface ActualizarProductoDto {
  nombre?: string;
  precio?: number;
  categoria_id?: number;
  stock?: number;
}