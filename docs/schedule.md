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

## Bussiness Rules

- Jika Hari, ruangan, waktu sama, maka bentrok.
- Dosen tidak dapat mengajar di hari dan waktu yang sama.
- 
