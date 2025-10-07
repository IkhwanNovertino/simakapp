import { GeneratePdfProps } from "@/lib/datatype";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 40,
    paddingHorizontal: 32,
    fontSize: "10pt",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  bottomLine: {
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  sectionTextHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 1,
    marginLeft: "16px"
  },
  body: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  textHeading1: {
    fontSize: "11pt",
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 8,
  },
  classTableRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
    gap: "4px"
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  tableCellTh: {
    margin: "auto",
    fontSize: "10pt",
    fontWeight: "bold",
    paddingVertical: "1px",
  },
  tableCellTd: {
    margin: "auto",
    fontSize: "9pt",
    paddingVertical: "1px",
  },
  footer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 1,
  }

})


const TranscriptPdf = ({ data }: GeneratePdfProps) => {
  return (
    <Document>
      <Page size={"LEGAL"} style={styles.page} wrap={false}>
        <View style={styles.body}>
          <Text style={styles.textHeading1}>TRANSKIP NILAI SEMENTARA</Text>
          <View style={[styles.classTableRow, { marginTop: "8px" }]}>
            <Text style={{ width: "10%", fontWeight: "bold", }}>NAMA</Text>
            <Text style={{ width: "50%", marginRight: 2, fontWeight: "bold", }}>: MUHAMMAD IKHWAN</Text>
            <Text style={{ width: "10%", fontWeight: "bold", }}>NIM</Text>
            <Text style={{ width: "27%", fontWeight: "bold", }}>: 310118012620</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTh}>No</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTh}>Kode</Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTh}>Mata Kuliah</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTh]}>SKS</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={[styles.tableCellTh]}>NILAI</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTh]}>BOBOT</Text>
              </View>
            </View>
            {data?.courseTaken.map((course: any, index: number) => (
              <View style={styles.tableRow} key={course.id}>
                <View style={[styles.tableCol, { width: "5%" }]}>
                  <Text style={styles.tableCellTd}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "12%" }]}>
                  <Text style={styles.tableCellTd}>{course?.course?.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "56%" }]}>
                  <Text style={[styles.tableCellTd, { marginLeft: 1, textAlign: "left" }]}>{course?.course?.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: "7%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.course?.sks}</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.weight}</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.gradeLetter}</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text style={[styles.tableCellTd]}>{(Number(course?.course?.sks) * Number(course?.weight))}</Text>
                </View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}>{"Jumlah SKS yang sudah diambil"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalSKSTranscript}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalBobotTranscript}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"IPK"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.ipkTranscript}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}>{1}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}>{"SB-ISPS2-002"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd, { marginLeft: 1, textAlign: "left" }]}>{"Implementasi Perangkat Lunak (Deployment, Testing, Adoption) (PSI)"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{3}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}>{ }</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}>{ }</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}>{ }</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}>{"Jumlah SKS yang belum diambil"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{140}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"TOTAL SKS"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{144}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"JUDUL SKRIPSI"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "27%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.contentFooter}>
            <Text>Banjarmasin/Banjarbaru, {data?.date}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TranscriptPdf;