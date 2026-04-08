import Resume from '../models/Resume.model.js';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const parseResumePDF = async (pdfBuffer) => {
  const data = new Uint8Array(pdfBuffer);
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  let extractedText = '';
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    extractedText += `${pageText}\n`;
  }

  return extractedText.trim();
};

export const saveResume = async (userId, fileName, extractedText) => {
  const existing = await Resume.findOne({ userId });
  if (existing) {
    existing.fileName = fileName;
    existing.extractedText = extractedText;
    return existing.save();
  }

  const resume = new Resume({ userId, fileName, extractedText });
  return resume.save();
};

export const getUserResume = async (userId) => {
  return Resume.findOne({ userId });
};
