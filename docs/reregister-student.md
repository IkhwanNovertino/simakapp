# ReregisterStudent Specifications

## Translate

- en: reregister student
- id: heregister mahasiswa

## Data Model and Form

- @@id ([reregisterId, studentId])
- reregisterId
  - String?
  - Required
  - uuid
- studentId
  - String?
  - Required
  - uuid
- semester
  - Int?
  - Required
  - Otomatis
  - --pertama kali terdaftar bernilai semester 1
  - -- rumus menemtukan semester otomatis berdasarkan tahun register dan tahun periode dan semester periode
- paymentReceiptFile
  - String?
  - image/jpeg, image/jpg, image/png
  - folder penyimpanan baru, ./payment
  - Required
- nominal
  - Decimal?
  - Required
- paymentStatus
  - PaymentStatus?
  - default(BELUM_LUNAS)
  - Required
  - --diproses oleh finance, seletah selesai kemudian diproses oleh operator
- semesterStatus
  - SemesterStatus?
  - Required
  - default(NONAKTIF)
  - --diproses oleh operator
- campusType
  - CampusType?
  - Required
