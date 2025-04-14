# Employee Specifications

## Translate

- en: student
- id: mahasiswa

## Data Model and Form

- id
  - String
  - PK
  - default uuid
- nim
  - --nomor induk mahasiswa
  - String?
  - Required
- name
  - --nama mahasiswa
  - String?
  - required
- year
  - --tahun terdaftar menjadi mahasiswa
  - Int?
  - Required
- religion
  - --agama
  - Religion?
  - Optional
- gender
  - --jenis kelamin
  - Gender?
  - Required
- address
  - --alamat tempat tinggal
  - String?
  - Optional
- email
  - String?
  - Optional
- hp
  - String?
  - Optional
- photo
  - String?
  - Optional
- fatherName
  - String?
  - Optional
- motherName
  - String?
  - Optional
- guardianName
  - --Nama wali
  - String?
  - Optional
- guardianHp

  - String?
  - Optional

- majorId
  - Int?
  - FK dari Major
  - Required
- lecturerId
  - --dosen wali
  - Int?
  - FK dari Lecturer
- statusRegister
  - --status mahasiswa pada saat register
    - Baru
    - Transfer / Renim / RPL (Rekognisi Pembelajaran Lampau)

## Examples of Data:
