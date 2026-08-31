# Metodología TDD en Backend Express

## ¿Qué es TDD?

TDD (Test-Driven Development) es un ciclo de desarrollo:

1. **RED** 🔴 - Escribir test que falla
2. **GREEN** 🟢 - Escribir código mínimo para pasar el test
3. **REFACTOR** 🔵 - Mejorar el código manteniendo tests verdes

## Ejemplo: Implementación TDD

### 1️⃣ RED - Escribir Test que Falla

```typescript
// tests/categorias.test.ts
test("Debe buscar una categoría por slug", () => {
  const ctx = crearContexto();
  
  given("que existe una categoría con slug 'electronica'", () => {
    assert.ok(ctx.service);
  });
  
  when("se busca por slug 'electronica'", (context) => {
    context.resultado = context.service.obtenerPorSlug('electronica');
  }, ctx);
  
  then("debe retornar la categoría", () => {
    assert.equal(ctx.resultado.slug, 'electronica');
  });
});
```

**Resultado**: ❌ FALLA (el método no existe)

---

### 2️⃣ GREEN - Escribir Código Mínimo

```typescript
// src/categorias/categoria.service.ts
obtenerPorSlug(slug: string) {
  const categoria = this.repository.buscarPorSlug(slug);
  if (!categoria) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Categoría no encontrada");
  }
  return categoria;
}
```

```typescript
// src/categorias/categoria.repository.ts
buscarPorSlug(slug: string): Categoria | undefined {
  return db.prepare("SELECT * FROM categorias WHERE slug = ?").get(slug) as Categoria | undefined;
}
```

**Resultado**: ✅ PASA

---

### 3️⃣ REFACTOR - Mejorar sin Romper Tests

```typescript
// Mejora: Agregar logging y validaciones
obtenerPorSlug(slug: string) {
  console.log("[CATEGORIA SERVICE] obtenerPorSlug() - Buscando slug:", slug);
  
  if (!slug || slug.trim().length === 0) {
    throw new AppError(400, "INVALID_SLUG", "El slug no es válido");
  }
  
  const categoria = this.repository.buscarPorSlug(slug.toLowerCase());
  if (!categoria) {
    throw new AppError(404, "CATEGORY_NOT_FOUND", "Categoría no encontrada");
  }
  
  console.log("[CATEGORIA SERVICE] obtenerPorSlug() - Encontrada:", categoria.nombre);
  return categoria;
}
```

**Resultado**: ✅ SIGUE PASANDO

---

## 📋 Características Actuales del Proyecto

### ✅ Tienes BDD Completo

```typescript
// Gherkin format
Feature: Gestión de Categorías
  Scenario: Obtener categoría por ID
    Given: que existe una categoría con ID 1
    When: se busca una categoría por ID 1
    Then: debe retornar la categoría encontrada
```

### ✅ Tienes Estructura TDD

- Tests unitarios ✓
- Cobertura de casos positivos y negativos ✓
- Mocks para aislar unidades ✓
- Assertions claros ✓

### ❌ Te Falta Metodología TDD

- Los tests se escribieron DESPUÉS del código
- Ideal sería: Test → Código → Refactor

---

## 🚀 Cómo Implementar TDD Puro

### Paso 1: Crear Test Primero
```bash
# Escribes el test que FALLA
npm run test:categorias
# ❌ FAIL - método no existe
```

### Paso 2: Implementar Funcionalidad
```typescript
// Escribes solo lo necesario para pasar
```

### Paso 3: Ejecutar Tests
```bash
npm run test:categorias
# ✅ PASS
```

### Paso 4: Refactorizar
```typescript
// Mejoras el código sin romper tests
npm run test:categorias
# ✅ PASS - Sigue funcionando
```

---

## 📊 Ciclo TDD Visualizado

```
┌─────────────────────────────────────┐
│          CICLO TDD                  │
├─────────────────────────────────────┤
│  1. RED 🔴 - Test falla             │
│     - Escribir test de nueva feature│
│     - Ejecutar: npm test            │
│     - Resultado: ❌ FAIL            │
│                                     │
│  2. GREEN 🟢 - Test pasa            │
│     - Código mínimo para pasar      │
│     - Ejecutar: npm test            │
│     - Resultado: ✅ PASS            │
│                                     │
│  3. REFACTOR 🔵 - Mejorar           │
│     - Limpiar y optimizar código    │
│     - Ejecutar: npm test            │
│     - Resultado: ✅ PASS (mantiene) │
│                                     │
│  4. REPETIR                         │
│     - Nueva feature...              │
└─────────────────────────────────────┘
```

---

## 💡 Cuándo Usar BDD vs TDD

| Aspecto | BDD | TDD |
|---------|-----|-----|
| **¿Qué es?** | Patrón de tests | Metodología de desarrollo |
| **Enfoque** | Comportamiento (What) | Desarrollo guiado por tests |
| **Lenguaje** | Given-When-Then | Rojo-Verde-Azul |
| **Audiencia** | Stakeholders + Devs | Devs |
| **Se usan juntas?** | ✅ SÍ (como en este proyecto) | ✅ SÍ |

---

## 🎯 Tu Proyecto Actual

✅ **BDD**: Implementado completamente
- Formato Gherkin
- Scenarios descriptivos
- Lenguaje de negocio

✅ **Estructura TDD**: Implementada
- Tests unitarios
- Cobertura completa
- Mocks

⚠️ **Metodología TDD**: No seguida en desarrollo
- Tests escritos después del código
- Pero listos para TDD futuro

---

## 🚀 Próximos Pasos para TDD

Para usar TDD en futuras features:

1. **Escribe el test primero**
   ```bash
   npm run test:categorias
   # Falla: método buscarPorNombre no existe
   ```

2. **Implementa lo mínimo**
   ```typescript
   buscarPorNombre(nombre: string) {
     // Solo lo necesario
   }
   ```

3. **Refactoriza**
   ```typescript
   buscarPorNombre(nombre: string) {
     // Versión mejorada y optimizada
   }
   ```

¡Ya tienes la estructura lista para aplicar TDD! 🎉
