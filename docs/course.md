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
- assesmentType:
  - REGULAR
  - Komponen nilai:
    - Presensi: 10%
    - Tugas Mandiri: 20%
    - Tugas Kelompok: 10%
    - UTS: 25%
    - UAS: 35%
  - CASE METHOD
  - Komponen nilai:
    - Presensi: 10%
    - Tugas Mandiri: 35%
    - Tugas Kelompok: 15%
    - UTS: 20%
    - UAS: 20%
