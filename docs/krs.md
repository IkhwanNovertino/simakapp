# KRS Specifications

## Translate

- en: krs
- id: krs

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- periodId
  - String?
  - FK
  - uuid
  - required
- reregisterId
  - String?
  - FK
  - uuid
  - required
- studentId
  - String?
  - FK
  - uuid
  - required
- isStatusForm
  - StudyPlanStatus?
  - default (DRAFT)
- ipk
  - Float ? 2 angka dibelakang koma
- maxSks
- lecturerId
  - String?
  - FK
  - uuid
  - required

```
enum StudyPlanStatus {
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'NEED_REVISION'
}
```

## Bussiness Rules

- Admin dapat membuatkan KRS untuk mahasiswa secara umum yang mengisi KRS adalah mahasiswa.

<!-- UNTUK DIHAPUS -->

### Alur pembuatkan data KRS di sistem

```
NOTE : Menghapus periodId karena sudah ada di reregisterId
```

- Ketika Admin membuat data reregisterDetail, data KRS juga langsung dibuat.
- Permaslahan : 1. Apakah mahasiswa yang mengajukan cuti juga harus memiliki data KRS di semester saat cuti ? 2. Apakah mahasiswa yang nonaktif, juga harus memiliki data KRS di semester saat nonaktif ?

