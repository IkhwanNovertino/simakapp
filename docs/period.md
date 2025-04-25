# Period Specifications

## Translate

- en: period
- id: periode akademik

## Data Model and Form

- id
  - String
  - PK
  - uuid
- year
  - Integer?
  - required
- semesterType
  - String?
  - required
  - Contoh nilai
    - GANJIL
    - GENAP
- name
  - String?
  - required
  - Contoh nilai
    - 2023/2024 GANJIL
    - 2023/2024 GENAP
- isActive
  - -- Mengatur status aktif periode secara keseluruhan
  - Boolean?
  - default false
  - required
