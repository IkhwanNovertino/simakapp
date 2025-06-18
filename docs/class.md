# Class Specifications

## Translate

- en: class
- id: kelas

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- name
  - string?
  - required
  - contoh : "46", "31"
- periodId
  - String
  - FK
  - uuid
- majorId
  - Integer
  - FK
- lecturerId
  - String
  - FK
  - uuid
- courseId
  - String
  - FK
  - uuid
- dayName
  - String?
  - required
  - ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"]
- roomId
  - Integer
  - FK
- semester
  - int
  - terisi otomatis ketika memilih mata kuliah 
  - 1 s/d 8

## Bussiness Rules

- Satu mata kuliah bisa diajarkan oleh 2 dosen dengan kelas yang berbeda
- Jika prodi = SI, semester = 1, dan mata kuliah = BELUM ADA, maka name class sama 11
- Jika prodi = SI, semester = 1, dan mata kuliah = SUDAH ADA, maka name class sama 12
- Jika prodi = TI, semester = 1, dan mata kuliah = BELUM ADA, maka name class sama 16
- Jika prodi = TI, semester = 1, dan mata kuliah = SUDAH ADA, maka name class sama 17
- 
