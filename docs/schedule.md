# Schedule Specifications

## Translate

- en: schedule
- id: jadwal

## Examples of Data:

## Data Model

- id
  - String?
  - PK
  - uuid
- classId
  - String?
  - FK
  - uuid
- timeId
  - String?
  - FK
  - uuid
- dayName
  - String?
  - required
  - ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"]
  <!-- PERLU DATA PERIODE -->
- periodId

## Bussiness Rules

<!-- - Jika Hari, ruangan, waktu sama, maka bentrok. -->

- Jika Hari, ruangan, waktu sama, prodi sama maka bentrok.
- Dosen tidak dapat mengajar di hari dan waktu yang sama, prodi sama.

- Dosen bisa mengajar 2 MK di satu waktu asal ruang sama.
- Dosen hanya bisa mengajar 1 kelas di satu waktu.
