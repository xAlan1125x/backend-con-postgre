export interface CrearProductoDto {
  nombre: string;
  precio: number;
  categoria_id: number;
}

export interface ActualizarProductoDto {
  nombre?: string;
  precio?: number;
  categoria_id?: number;
}