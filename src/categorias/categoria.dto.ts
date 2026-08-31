export interface CrearCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export interface ActualizarCategoriaDto {
  nombre?: string;
  descripcion?: string;
}