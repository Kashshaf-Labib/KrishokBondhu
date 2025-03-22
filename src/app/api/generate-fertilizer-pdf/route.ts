// src/app/api/generate-fertilizer-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { Buffer } from "buffer";

const soilTypes = [
  { id: 1, name: "বালুময়" },
  { id: 2, name: "দোআঁশ" },
  { id: 3, name: "কাদামাটি" },
  { id: 4, name: "পলি" },
];

const cropTypes = [
  { id: 1, name: "ধান" },
  { id: 2, name: "গম" },
  { id: 3, name: "ভুট্টা" },
  { id: 4, name: "তুলা" },
];

export async function POST(request: NextRequest) {
  try {
    const { formData, recommendation } = await request.json();
    
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "kalpurush.ttf"
    );

    const doc = new PDFDocument({
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      font: fontPath,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(18).text("সার সুপারিশ রিপোর্ট", { align: "center" });
    doc.moveDown(2);

    // District Info
    doc.fontSize(14).text(`জেলা: ${formData.district}`);
    doc.moveDown(1.5);

    // Parameters
    doc.fontSize(14).text("পরিবেশগত পরামিতিসমূহ:", { underline: true });
    doc.moveDown(0.5);
    
    const parameters = [
      { label: "নাইট্রোজেন (এন)", value: `${formData.N}%` },
      { label: "ফসফরাস (পি)", value: `${formData.P} ug/g` },
      { label: "পটাসিয়াম (কে)", value: `${formData.K} ug/g` },
      { label: "তাপমাত্রা", value: `${formData.temperature} degree C` },
      { label: "আর্দ্রতা", value: `${formData.humidity}%` },
      { label: "pH মান", value: formData.ph },
      { label: "বৃষ্টিপাত", value: `${formData.rainfall} মিমি` },
      { 
        label: "মাটির ধরন", 
        value: soilTypes.find(s => s.id === parseInt(formData.soil_type))?.name || "Unknown" 
      },
      { 
        label: "ফসলের ধরন", 
        value: cropTypes.find(c => c.id === parseInt(formData.crop_type))?.name || "Unknown" 
      },
    ];

    parameters.forEach((param) => {
      doc.fontSize(12)
        .text(param.label, { continued: true })
        .text(`: ${param.value}`, { align: "right" });
      doc.moveDown(0.5);
    });

    // Recommendation
    doc.moveDown(1);
    doc.fontSize(14).text("সুপারিশকৃত সার:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(recommendation);
    doc.moveDown(2);

    // Footer
    const currentDate = new Date().toLocaleDateString();
    doc.fontSize(10)
      .text(`রিপোর্ট তৈরির তারিখ: ${currentDate}`, { align: "center" });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="fertilizer_recommendation.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}