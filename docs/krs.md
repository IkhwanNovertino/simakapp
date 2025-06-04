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
