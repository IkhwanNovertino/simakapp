# Major Specifications

## Translate

- en: course
- id: mata kuliah

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- code
  - --kode mata kuliah
  - String?
  - Required
- name
  - --nama mata kuliah
  - String?
  - Required
- sks
  - --jumlah sks mata kuliah
  - Int?
  - Required
- majorId
  - --Prodi mata kuliah
  - String?
  - FK dari Major
  - Required
- isPKL
  - boolean?
  - default false
- isSkripsi
  - boolean?
  - default false
