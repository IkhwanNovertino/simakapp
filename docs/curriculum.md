# Curriculum Specifications

## Translate

- en: Curriculum
- id: Kurikulum

## Data Model and Form

- id
  - String
  - PK
  - uuid
- name
  - String?
  - required
  - contoh: kurikulum merdeka SI 2025
- majodId
  - String
  - FK
  - uuid
- startDate
  - Date?
  - required
- endDate
  - Date?
  - required
- isActive
  - -- Mengatur status aktif curriculum
    - hanya boleh satu kurikulum aktif per prodi
  - Boolean?
  - default false
  - required
