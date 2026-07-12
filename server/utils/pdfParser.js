const pdfParse = require("pdf-parse");

async function extractTextFromPdf(fileBuffer) {
  const data = await pdfParse(fileBuffer);
  return data.text.replace(/\s+/g, " ").trim();
}

module.exports = { extractTextFromPdf };
