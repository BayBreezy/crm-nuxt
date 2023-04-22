import ExcelJS from "exceljs";

export default defineEventHandler(async (e) => {
  const user = e.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  // get all contacts for the logged in user
  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
  });
  // create a new workbook
  const workbook = new ExcelJS.Workbook();
  // create a new worksheet
  const worksheet = workbook.addWorksheet("Contacts");
  // add column headers
  worksheet.columns = [
    { header: "First Name", key: "firstName", width: 20 },
    { header: "Last Name", key: "lastName", width: 20 },
    { header: "Email", key: "email", width: 20 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Position", key: "position", width: 20 },
    { header: "Department", key: "department", width: 20 },
    { header: "Address", key: "address", width: 50 },
    { header: "Created", key: "createdAt", width: 20 },
  ];
  // add rows
  worksheet.addRows(contacts);
  // create a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  // convert to base64 string
  const base64 = Buffer.from(buffer).toString("base64");
  // return the string
  return base64;
});
