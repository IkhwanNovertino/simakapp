import { GeneratePdfProps } from "@/lib/datatype";
import { Period, Reregister, ReregisterDetail, Student } from "@prisma/client";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 40,
    fontSize: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomLine: {
    borderBottomStyle: "solid",
    borderBottomWidth: .8,
    borderBottomColor: "gray",
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "red",
    borderRadius: 100,
    justifySelf: "center",
    marginTop: 6,
  },
  sectionTextHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 1,
  },
  textHeader: {
    fontSize: 12,
    fontWeight: "bold",
    justifyContent: "center",
  },
  textAddress: {
    fontSize: 12,
    justifyContent: "center",
  },
  body: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  textHeading1: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 18,
  },
  tableHeading: {
    fontSize: 12,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  table: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  tableRow: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "center",
  },
  columnField: {
    width: "17%",
    flexWrap: "wrap",
  },
  columnComma: {
    width: "2%",
  },
  columnData: {
    width: "81%",
    borderBottomStyle: "dotted",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    display: "flex",
    flexWrap: "wrap",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 1,
  }

})


const ReregisterPdf = ({ data, img }: GeneratePdfProps) => {
  const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
  return (
    <Document>
      <Page size={"LETTER"} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image src={imgLogo} />
          </View>
          <View style={styles.sectionTextHeader}>
            <Text style={styles.textHeader}>SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER</Text>
            <Text style={styles.textHeader}>(STMIK) BANJARBARU</Text>
            <Text style={styles.textHeader}>IJIN MENDIKNAS RI NO. 15 / D / O / 2003</Text>
            <View style={styles.sectionTextHeader}>
              <Text style={styles.textAddress}>Jl. A. Yani Km. 33,3 Loktabat, Banjarbaru Telp. 0511-4782881</Text>
              <Text style={styles.textAddress}>Jl. Sultan Adam No. 12, Banjarmasin Telp. 0511-3306839</Text>
              <Text style={styles.textAddress}>www.stmik-banjarbaru.ac.id</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomLine}></View>
        <View style={styles.body}>
          <Text style={styles.textHeading1}>FORMULIR REGISTRASI MAHASISWA</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA MAHASISWA</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Lengkap</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>MUHAMMAD IKHWAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIM</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>310118012620</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Tempat/Tanggal Lahir</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>MEDAN, 21/11/2020</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Alamat Sekarang</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>JL. CEMPAKA SARI III NO.22, RT.048, RW.003, KEL. BASIRIH, KEC. BANJARMASIN BARAT, KOTA BANJARMASIN, KALIMANTAN SELATAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Alamat Asal</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>JL. CEMPAKA SARI III NO.22, RT.048, RW.003, KEL. BASIRIH, KEC. BANJARMASIN BARAT, KOTA BANJARMASIN, KALIMANTAN SELATAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>No. HP</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>081108234509</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Program Studi</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>SISTEM INFORMASI</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Semester</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>GANJIL</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Tahun Akademik</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>2023/2024</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Kampus</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>BANJARBARU</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA ORANG TUA</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Orang Tua/Wali</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>MUHAMMAD IKHWAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIK Orang Tua/Wali</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>6371035009890009</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Alamat Lengkap</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>JL. CEMPAKA SARI III NO.22, RT.048, RW.003, KEL. BASIRIH, KEC. BANJARMASIN BARAT, KOTA BANJARMASIN, KALIMANTAN SELATAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>No. Telp/HP</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>089908779866</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Pekerjaan</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>PNS</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA IBU KANDUNG</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Ibu Kandung</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>MUHAMMAD IKHWAN</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIK Ibu Kandung</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>6371035009890009</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Banjarbaru, 05 Aug 2023</Text>
          <Text>Mahasiswa</Text>
          <Text style={{ marginTop: 12, fontWeight: "bold" }}>MUHAMMAD IKHWAN</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ReregisterPdf;