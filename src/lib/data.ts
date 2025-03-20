export let role = "admin";

export const teachersData = [
  {
    id: 1,
    teacherId: "1234567890",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Math", "Geometry"],
    address: "Dosen",
  },
  {
    id: 2,
    teacherId: "1234567890",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    subjects: ["Physics", "Chemistry"],
    address: "Dosen Wali",
  },
];

export const permissionDaata = [
  {
    id: 1,
    name: "create user",
    description: "modul untuk membuat data user"
  },
  {
    id: 2,
    name: "read user",
    description: "modul untuk menampilkan data user"
  },
  {
    id: 3,
    name: "update user",
    description: "modul untuk mengubah data user"
  },
  {
    id: 4,
    name: "update lecturer",
    description: "modul untuk mengubah data dosen"
  },
]