# Lecturer Specifications

## Translate

- en: lecturer
- id: dosen

## Data Model and Form

- id String PK uuid
  - id unik primary key
- name
  - --nama dosen
  - String?
  - Required
- npk
  - --nomor pokok karyawan
  - String?
  - Required
- nidn
  - --nomor induk dosen nasional
  - String?
  - Required
- degree
  - DegreeStatus?
  - Optional
- frontTitle
  - --gelar depan
  - String?
  - Optional
- backTitle
  - --gelar belakang
  - String?
  - Optional
- year
  - --tahun masuk menjadi dosen
  - Int?
- religion
  - --agama
  - Religion?
  - Optional
- gender
  - --Jenis kelamin
  - Gender?
  - Required
- address
  - --alamat
  - String?
  - Optional
- email
  - --email personal
  - String?
  - Optional
- hp
  - String?
  - Optional
- photo
  - String?
  - Optional
- majorId
  - Int?
  - Required
- userId
  - String?
  - Optional

## Examples of Data:
