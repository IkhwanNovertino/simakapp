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
- prevId
  - String?
  - uuid
  - FK
  - relasi ke dirinya sendiri
  - optional
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
- courseType
  - string?
  - enum [wajib, pilihan]
  - default(wajib)
  - required
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

<!-- id = 123
name = machine learing
-code = SB-ITI-010
prevId = null

id = 1234
name = data science
code = SB-ITI-102
prevId = 123 -->

<!--
Contoh table courseCompetence
- id Int autoIncrement
- name String?

const data = prisma.krs.findMany({});
const courseTypePilihan = data.courseType;
== id = 1

SC
prisma.course.findMany({
  where: {
  OR: [
  {courseType: {1}}
  ]
  }
})
 -->
