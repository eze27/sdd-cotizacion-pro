# Specification Quality Checklist: Página de inicio y dirección visual «Despacho»

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-10-20
**Last Revised**: 2026-10-21 (revisión 2 — dirección visual «Despacho»)
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

### Revisión 2 (2026-10-21)

- **Cerrado el 2026-10-22**: los 3 marcadores `[NEEDS CLARIFICATION]` se resolvieron con la persona dueña (ver Clarifications, sesión 2026-10-22): componente de confirmación genérico, retirar la acción de abrir de la fila y dejar la identidad en dos familias tipográficas. La spec ya no tiene marcadores y la puerta de `/speckit-plan` pasa.
- La spec describe la identidad visual por su intención y sus efectos observables. Los **valores exactos** de los tokens (códigos de color, tipografías, escalas, radios, sombras, duraciones, tramos de pantalla) se dejaron deliberadamente fuera de `spec.md` para no meter detalle de implementación: viven en `specs/pre-specs/direccion-visual-despacho.md` §4 y se transcriben a `contracts/design-system.md` en `/speckit-plan`.
- Dos criterios citan un comprobador de contraste (SC-014) y el tamaño del archivo PDF (SC-031). Se consideran verificables por una persona no técnica: ninguno exige leer código.
- SC-027 depende de recapturar los PDF de referencia **antes** de implementar: los `baseline-*.txt` existentes describen el PDF de la revisión 1.

### Revisión 1 (2026-10-20)

- Dos conflictos de la descripción se resolvieron con la persona dueña: estados (solo Vigente/Vencida, sin datos nuevos) e idioma (se mantiene español de México).
- FR-019 mencionaba PrimeNG porque la propia petición lo exigía como restricción. En la revisión 2 esa referencia desaparece.
