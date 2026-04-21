import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import PDFDocument from "pdfkit";
import streamifier from "streamifier";
import path from "path";
import fs from "fs";
import sharp from "sharp";

import { cloudinary } from "@/app/_backend/libs/cloudinary";
import { connectDB } from "@/app/_backend/libs/db";
import User from "@/app/_backend/models/user.model";
import UserMemory from "@/app/_backend/models/memory.model";

export const runtime = "nodejs";

const MAX_IMAGE_WIDTH = 900;
const MAX_IMAGE_HEIGHT = 600;
const JPEG_QUALITY = 75;
const MAX_IMAGES_PER_MEMORY = 2;

/* ================= THEME ================= */
const T = {
  bgLight:      "#f0f7f2",
  bgCard:       "#ffffff",
  bgPage:       "#fafaf9",
  darkDeep:     "#0a1410",
  darkMid:      "#132217",
  darkCard:     "#1f3824",
  textDark:     "#132217",
  textBody:     "#2f5237",
  textMuted:    "#3e6b47",
  textFaint:    "#5c5c4e",
  green:        "#55825E",
  greenLight:   "#7ec094",
  greenPale:    "#d9ede0",
  greenMid:     "#3e6b47",
  border:       "#b3dcbf",
  borderSubtle: "#d9ede0",
  stoneBorder:  "#d4d4c8",
  stoneMid:     "#e8e8e0",
  amber:        "#d97706",
  amberLight:   "#fcd34d",
  white:        "#ffffff",
};

/* ================= CLOUDINARY UPLOAD ================= */
const uploadPDF = (buffer: Buffer, publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
        format: "pdf",
        access_mode: "public",
        overwrite: true,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* ================= FETCH + COMPRESS IMAGE ================= */
const fetchAndCompressImage = async (url: string): Promise<Buffer | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const raw = Buffer.from(await res.arrayBuffer());

    return await sharp(raw)
      .resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toBuffer();
  } catch {
    return null;
  }
};

/* ================= HELPERS ================= */
function roundedRect(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, r: number, fillColor: string) {
  doc.save().roundedRect(x, y, w, h, r).fill(fillColor).restore();
}

function roundedRectStroke(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, r: number, strokeColor: string, lineWidth = 0.5) {
  doc.save().roundedRect(x, y, w, h, r).lineWidth(lineWidth).strokeColor(strokeColor).stroke().restore();
}

function hr(doc: PDFKit.PDFDocument, y: number, x1 = 50, x2?: number, color = T.border, width = 0.5) {
  const right = x2 ?? doc.page.width - 50;
  doc.save().moveTo(x1, y).lineTo(right, y).lineWidth(width).strokeColor(color).stroke().restore();
}

function diamondRow(doc: PDFKit.PDFDocument, cx: number, y: number, color = T.green) {
  const size = 3;
  const gap = 14;
  for (let i = -1; i <= 1; i++) {
    const x = cx + i * gap;
    doc.save().translate(x, y).rotate(45).rect(-size / 2, -size / 2, size, size).fill(color).restore();
  }
}

function ornamentBar(doc: PDFKit.PDFDocument, y: number) {
  const cx = doc.page.width / 2;
  hr(doc, y, cx - 80, cx - 20, T.green, 0.8);
  diamondRow(doc, cx, y, T.green);
  hr(doc, y, cx + 20, cx + 80, T.green, 0.8);
}

function addFooter(doc: PDFKit.PDFDocument, pageIndex: number, totalPages: number, logoBuffer: Buffer | null, font: string) {
  const pw = doc.page.width;
  const ph = doc.page.height;
  const footerY = ph - 38;

  hr(doc, footerY - 2, 50, pw - 50, T.borderSubtle, 0.4);

  doc.save().font(font).fontSize(8).fillColor(T.textFaint)
    .text("Enduring Roots", 50, footerY + 4, { width: 120, align: "left" }).restore();

  doc.save().font(font).fontSize(8).fillColor(T.textFaint)
    .text(`${pageIndex} / ${totalPages}`, 0, footerY + 4, { align: "center" }).restore();

  if (logoBuffer) {
    doc.image(logoBuffer, pw - 65, footerY - 2, { width: 20 });
  }
}

/* ================= COVER PAGE ================= */
async function drawCoverPage(doc: PDFKit.PDFDocument, userName: string, memoriesCount: number, logoBuffer: Buffer | null, font: string, fontItalic: string) {
  doc.addPage();
  const pw = doc.page.width;
  const ph = doc.page.height;

  doc.rect(0, 0, pw, ph).fill(T.bgLight);
  doc.rect(0, 0, pw, 8).fill(T.darkDeep);
  doc.rect(0, 8, pw, 3).fill(T.green);
  doc.rect(0, ph - 11, pw, 3).fill(T.green);
  doc.rect(0, ph - 8, pw, 8).fill(T.darkDeep);
  roundedRectStroke(doc, 30, 30, pw - 60, ph - 60, 6, T.border, 0.6);
  roundedRectStroke(doc, 36, 36, pw - 72, ph - 72, 4, T.greenLight, 0.3);

  const logoBoxW = 90;
  const logoBoxH = 90;
  const logoBoxX = pw / 2 - logoBoxW / 2;
  const logoBoxY = 80;

  roundedRect(doc, logoBoxX, logoBoxY, logoBoxW, logoBoxH, 8, T.darkMid);
  roundedRectStroke(doc, logoBoxX, logoBoxY, logoBoxW, logoBoxH, 8, T.green, 1.2);

  if (logoBuffer) {
    doc.image(logoBuffer, logoBoxX + 15, logoBoxY + 15, { width: 60, height: 60, fit: [60, 60] });
  } else {
    doc.font(font).fontSize(36).fillColor(T.green)
      .text("ER", logoBoxX, logoBoxY + 26, { width: logoBoxW, align: "center" });
  }

  doc.font(font).fontSize(9).fillColor(T.textMuted)
    .text("E N D U R I N G   R O O T S", 0, logoBoxY + logoBoxH + 16, {
      align: "center",
      characterSpacing: 2,
    });

  ornamentBar(doc, logoBoxY + logoBoxH + 44);

  doc.font(font).fontSize(46).fillColor(T.textDark)
    .text(`${userName}'s`, 60, logoBoxY + logoBoxH + 70, { width: pw - 120, align: "center" });

  doc.font(font).fontSize(34).fillColor(T.textBody)
    .text("Memory Album", 60, doc.y + 6, { width: pw - 120, align: "center" });

  ornamentBar(doc, doc.y + 22);

  const statsY = doc.y + 46;
  const pillW = 130;
  const pillH = 46;
  const gap = 18;
  const totalPillW = 2 * pillW + gap;
  const pillX1 = pw / 2 - totalPillW / 2;
  const pillX2 = pillX1 + pillW + gap;

  roundedRect(doc, pillX1, statsY, pillW, pillH, 6, T.greenPale);
  roundedRectStroke(doc, pillX1, statsY, pillW, pillH, 6, T.green, 0.8);
  doc.font(font).fontSize(22).fillColor(T.textDark)
    .text(String(memoriesCount), pillX1, statsY + 6, { width: pillW, align: "center" });
  doc.font(font).fontSize(8).fillColor(T.textMuted)
    .text("M E M O R I E S", pillX1, statsY + 32, { width: pillW, align: "center", characterSpacing: 1 });

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" });
  roundedRect(doc, pillX2, statsY, pillW, pillH, 6, T.greenPale);
  roundedRectStroke(doc, pillX2, statsY, pillW, pillH, 6, T.green, 0.8);
  doc.font(font).fontSize(13).fillColor(T.textDark)
    .text(dateStr, pillX2, statsY + 10, { width: pillW, align: "center" });
  doc.font(font).fontSize(8).fillColor(T.textMuted)
    .text("C R E A T E D", pillX2, statsY + 30, { width: pillW, align: "center", characterSpacing: 1 });

  const quoteY = ph - 120;
  ornamentBar(doc, quoteY - 10);
  doc.font(fontItalic).fontSize(13).fillColor(T.textBody)
    .text("\u201cThe stories we share become the roots that hold us together.\u201d", 80, quoteY + 8, {
      width: pw - 160,
      align: "center",
      lineGap: 4,
    });
}

/* ================= SECTION DIVIDER ================= */
function drawSectionDivider(doc: PDFKit.PDFDocument, stage: string, count: number, stageIndex: number, totalStages: number, font: string, fontItalic: string) {
  doc.addPage();
  const pw = doc.page.width;
  const ph = doc.page.height;

  doc.rect(0, 0, pw * 0.38, ph).fill(T.darkMid);
  doc.rect(pw * 0.38, 0, pw * 0.62, ph).fill(T.bgCard);
  doc.rect(pw * 0.38 - 3, 0, 6, ph).fill(T.green);
  doc.rect(pw * 0.38, 0, pw * 0.62, 5).fill(T.greenPale);
  doc.rect(pw * 0.38, ph - 5, pw * 0.62, 5).fill(T.greenPale);

  doc.font(font).fontSize(90).fillColor(T.green).fillOpacity(0.15)
    .text(String(stageIndex + 1).padStart(2, "0"), 0, ph / 2 - 80, {
      width: pw * 0.38,
      align: "center",
    });
  doc.fillOpacity(1);

  doc.font(font).fontSize(11).fillColor(T.greenLight)
    .text(`C H A P T E R  ${stageIndex + 1}  O F  ${totalStages}`, 0, ph / 2 + 20, {
      width: pw * 0.38,
      align: "center",
      characterSpacing: 2,
    });

  const rightX = pw * 0.38 + 40;
  const rightW = pw * 0.62 - 80;

  doc.font(font).fontSize(9).fillColor(T.textFaint)
    .text("L I F E   S T A G E", rightX, ph / 2 - 90, { width: rightW, characterSpacing: 2 });

  hr(doc, ph / 2 - 70, rightX, rightX + rightW, T.green, 1);

  doc.font(font).fontSize(36).fillColor(T.textDark)
    .text(stage, rightX, ph / 2 - 58, { width: rightW, lineGap: 6 });

  doc.font(fontItalic).fontSize(12).fillColor(T.textMuted)
    .text(`${count} ${count === 1 ? "memory" : "memories"} in this chapter`, rightX, doc.y + 10, { width: rightW });

  for (let i = 0; i < 3; i++) {
    doc.circle(rightX + i * 12, ph / 2 + 100, 2.5)
      .fillColor(i === 0 ? T.green : T.border)
      .fill();
  }
}

/* ================= MEMORY CARD (FIXED) ================= */
async function drawMemoryCard(doc: PDFKit.PDFDocument, mem: any, font: string, fontItalic: string): Promise<void> {
  const pw = doc.page.width;
  const margin = 50;
  const cardW = pw - margin * 2;

  let currentY = doc.y;

  doc.circle(margin, currentY + 8, 4).fillColor(T.green).fill();
  doc.font(font).fontSize(17).fillColor(T.textDark)
    .text(mem.title || "Untitled Memory", margin + 14, currentY, { width: cardW - 120 });

  if (mem.date) {
    const dateStr = new Date(mem.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const badgeW = 95;
    const badgeH = 18;
    const badgeX = pw - margin - badgeW;
    const badgeY = currentY;
    roundedRect(doc, badgeX, badgeY, badgeW, badgeH, 4, T.greenPale);
    doc.font(font).fontSize(8).fillColor(T.textBody)
      .text(dateStr, badgeX, badgeY + 5, { width: badgeW, align: "center" });
  }

  currentY += 24;
  doc.y = currentY;

  if (mem.lifeStage) {
    const tagW = Math.min(mem.lifeStage.length * 7 + 16, 160);
    roundedRect(doc, margin + 14, doc.y, tagW, 14, 3, T.bgLight);
    roundedRectStroke(doc, margin + 14, doc.y, tagW, 14, 3, T.border, 0.5);
    doc.font(font).fontSize(7.5).fillColor(T.textMuted)
      .text(mem.lifeStage.toUpperCase(), margin + 14, doc.y + 3, {
        width: tagW,
        align: "center",
        characterSpacing: 0.5,
      });
    doc.y += 20;
  }

  if (mem.description) {
    doc.font(fontItalic).fontSize(11).fillColor(T.textBody)
      .text(mem.description, margin + 14, doc.y + 4, {
        width: cardW - 14,
        align: "left",
        lineGap: 5,
      });
    doc.moveDown(0.6);
  } else {
    doc.y += 8;
  }

  const imageUrls = (mem.images || []).slice(0, MAX_IMAGES_PER_MEMORY).map((img: any) => img.url);
  const imageBuffers = await Promise.all(imageUrls.map(fetchAndCompressImage));
  const validImages = imageBuffers.filter((b): b is Buffer => b !== null);

  if (validImages.length > 0) {
    const imgCount = validImages.length;
    const gap = 14;
    const imgW = imgCount === 1 ? cardW - 14 : (cardW - 14 - gap) / 2;
    const imgH = imgCount === 1 ? 180 : 150;

    const neededHeight = imgH + (imgCount > 2 ? imgH + gap : 0);
    if (doc.y + neededHeight > doc.page.height - 80) {
      doc.addPage();
      doc.rect(0, 0, pw, doc.page.height).fill(T.bgPage);
      doc.y = 50;
    }

    const imgStartY = doc.y + 10;

    for (let i = 0; i < validImages.length; i++) {
      const col = imgCount === 1 ? 0 : i % 2;
      const x = margin + 14 + col * (imgW + gap);
      const y = imgStartY + (Math.floor(i / 2) * (imgH + gap));

      roundedRect(doc, x + 2, y + 2, imgW, imgH, 4, "#00000010");
      roundedRect(doc, x, y, imgW, imgH, 4, T.border);

      doc.save();
      doc.roundedRect(x + 2, y + 2, imgW - 4, imgH - 4, 3).clip();
      doc.image(validImages[i], x + 2, y + 2, {
        fit: [imgW - 4, imgH - 4],
        align: "center",
        valign: "center",
      });
      doc.restore();

      roundedRectStroke(doc, x + 2, y + 2, imgW - 4, imgH - 4, 3, T.green, 0.6);
    }

    const rows = Math.ceil(validImages.length / 2);
    doc.y = imgStartY + rows * (imgH + gap) + 16;
  }
}

/* ================= BUILD PDF ================= */
const buildPDF = async (userName: string, memories: any[]): Promise<Buffer> => {
  return new Promise<Buffer>(async (resolve, reject) => {
    try {
      const fontPath = path.join(process.cwd(), "app/fonts/Roboto_Condensed-Bold.ttf");
      const fontItalicPath = path.join(process.cwd(), "app/fonts/Roboto_Condensed-Italic.ttf");
      const logoPath = path.join(process.cwd(), "public/logo2.png");

      if (!fs.existsSync(fontPath)) return reject(new Error(`Font not found: ${fontPath}`));

      // ✅ FIX 1: Read font data as Buffer for registerFont, but pass file PATH string
      // to PDFDocumentOptions.font (which only accepts string, not Buffer)
      const fontData = fs.readFileSync(fontPath);
      const fontItalicData = fs.existsSync(fontItalicPath) ? fs.readFileSync(fontItalicPath) : fontData;

      let logoBuffer: Buffer | null = null;
      if (fs.existsSync(logoPath)) logoBuffer = fs.readFileSync(logoPath);

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
        compress: true,
        info: {
          Title: `${userName}'s Memory Album`,
          Author: userName,
          Creator: "Enduring Roots",
          Subject: "Personal Memory Album",
        },
        autoFirstPage: false,
        // ✅ FIX 1: Pass the font FILE PATH (string) instead of a Buffer.
        // PDFKit's `font` option in PDFDocumentOptions only accepts `string`.
        font: fontPath,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // registerFont still works fine with Buffer data
      doc.registerFont("custom", fontData);
      doc.registerFont("customItalic", fontItalicData);
      doc.font("custom");

      // Group by life stage
      const grouped: Record<string, any[]> = {};
      memories.forEach((m) => {
        const key = m.lifeStage || "Uncategorized";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
      });
      const stages = Object.keys(grouped);

      // Cover
      await drawCoverPage(doc, userName, memories.length, logoBuffer, "custom", "customItalic");

      // Stage sections
      for (let sIdx = 0; sIdx < stages.length; sIdx++) {
        const stage = stages[sIdx];
        const stageMemories = grouped[stage];

        drawSectionDivider(doc, stage, stageMemories.length, sIdx, stages.length, "custom", "customItalic");

        for (let mIdx = 0; mIdx < stageMemories.length; mIdx++) {
          const mem = stageMemories[mIdx];
          const isFirst = mIdx === 0;

          if (isFirst) {
            doc.addPage();
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(T.bgPage);
            doc.y = 50;
          } else if (doc.y > doc.page.height - 220) {
            doc.addPage();
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(T.bgPage);
            doc.y = 50;
          }

          await drawMemoryCard(doc, mem, "custom", "customItalic");

          if (mIdx < stageMemories.length - 1) {
            if (doc.y + 20 < doc.page.height - 80) {
              const divY = doc.y + 12;
              hr(doc, divY, 64, doc.page.width - 64, T.borderSubtle, 0.4);
              doc.y = divY + 20;
            }
          }
        }
      }

      // Closing page
      doc.addPage();
      const pw = doc.page.width;
      const ph = doc.page.height;

      doc.rect(0, 0, pw, ph).fill(T.bgLight);
      doc.rect(0, 0, pw, 8).fill(T.darkDeep);
      doc.rect(0, 8, pw, 3).fill(T.green);
      doc.rect(0, ph - 11, pw, 3).fill(T.green);
      doc.rect(0, ph - 8, pw, 8).fill(T.darkDeep);
      roundedRectStroke(doc, 30, 30, pw - 60, ph - 60, 6, T.border, 0.6);

      ornamentBar(doc, ph / 2 - 70);

      doc.font("custom").fontSize(28).fillColor(T.textDark)
        .text("The Story Continues…", 60, ph / 2 - 52, { width: pw - 120, align: "center" });

      doc.font("customItalic").fontSize(13).fillColor(T.textBody)
        .text(
          "Every memory you add is a gift to those who come after you.",
          80, ph / 2 - 10,
          { width: pw - 160, align: "center", lineGap: 4 }
        );

      ornamentBar(doc, ph / 2 + 36);

      doc.font("custom").fontSize(10).fillColor(T.textMuted)
        .text("E N D U R I N G   R O O T S", 0, ph / 2 + 60, { align: "center", characterSpacing: 3 });

      // Add footers to all pages
      const range = doc.bufferedPageRange();
      const total = range.count;
      for (let i = range.start; i < range.start + total; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, total, logoBuffer, "custom");
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/* ================= API ROUTE ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const memories = await UserMemory.find({ userId: decoded.id })
      .sort({ date: 1 })
      .lean();

    if (!memories.length) {
      return NextResponse.json({ success: false, message: "No memories found" }, { status: 404 });
    }

    const userName = (user as any).username || (user as any).email?.split("@")[0] || "User";

    const pdfBuffer: Buffer = await buildPDF(userName, memories);

    const MB = 1024 * 1024;
    const sizeMB = (pdfBuffer.length / MB).toFixed(2);
    console.log(`PDF size: ${sizeMB} MB`);

    const { searchParams } = new URL(req.url);
    const download = searchParams.get("download") === "true";

    if (download) {
      // ✅ FIX 2: Pass the Buffer directly to NextResponse — do NOT wrap in Uint8Array.
      // Next.js App Router's NextResponse accepts Node.js Buffer as BodyInit just fine.
   return new NextResponse(new Uint8Array(pdfBuffer), {
  status: 200,
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${userName}_memory_album.pdf"`,
    "Content-Length": pdfBuffer.byteLength.toString(),
  },
});
    }

    if (pdfBuffer.length > 10 * MB) {
      return NextResponse.json(
        {
          success: false,
          message: `PDF is ${sizeMB} MB — too large for Cloudinary. Use ?download=true for direct download.`,
        },
        { status: 413 }
      );
    }

    const safeName = userName.replace(/[^a-zA-Z0-9]/g, "_");
    const publicId = `memory_albums/${decoded.id}/${safeName}_${Date.now()}`;
    const uploaded = await uploadPDF(pdfBuffer, publicId);

    const albumUrl = uploaded.secure_url.replace("/raw/upload/", "/raw/upload/fl_inline/");

    return NextResponse.json({
      success: true,
      albumUrl,
      stats: {
        totalMemories: memories.length,
        totalPhotos: memories.reduce((n: number, m: any) => n + (m.images?.length || 0), 0),
        pdfSizeMB: sizeMB,
      },
    });
  } catch (err: any) {
    console.error("PDF ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}