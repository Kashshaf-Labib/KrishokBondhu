// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { Buffer } from "buffer";

export async function POST(request: NextRequest) {
  try {
    const { prediction, imageBase64 } = await request.json();

    // Load Bangla font
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "kalpurush.ttf"
    );

    // Create PDF with custom font as default
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      font: fontPath,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Add content
    doc.fontSize(18).text("উদ্ভিদ রোগ সনাক্তকরণ রিপোর্ট", { align: "center" });
    doc.moveDown(2);

    // Disease information
    doc.fontSize(14).text("রোগের তথ্য");
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`- রোগের নাম: ${prediction.disease}`)
      .text(`- নির্ভুলতা: ${prediction.confidence}%`)
      .text(`- মাত্রা: ${prediction.severity}`);
    doc.moveDown(1);

    // Recommendations
    doc.fontSize(14).text("প্রস্তাবিত সমাধান");
    doc.moveDown(0.5);
    prediction.recommendations.forEach((rec: string, index: number) => {
      doc.fontSize(12).text(`- ${rec}`);
      if (index < prediction.recommendations.length - 1) doc.moveDown(0.5);
    });
    doc.moveDown(2);

    // Add image
    if (imageBase64) {
      const base64Data = imageBase64.split(",")[1] || imageBase64;
      const imageBuffer = Buffer.from(base64Data, "base64");
      doc.image(imageBuffer, { width: 300, align: "center" });
      doc.moveDown(1);
    }


    // Finalize PDF
    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="plant_disease_report.pdf"',
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
