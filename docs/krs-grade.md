# Krs Grade Specifications

## Translate

- en: Krs Grade
- id: Ketentuan Nilai Krs

## Data Model and Form

- id
  - String
  - PK
  - uuid
- krsDetailId
  - String?
  - FK
  - uuid
  - required
- assessmentDetailId
  - String?
  - FK
  - uuid
  - required
- percentage
  - Int?
  - required
- score
  - Decimal (2 digit dibelakang koma)?
  - required

## Bussiness Rules

