import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateData = [
  {
    "Pertanyaan": "Berapakah 2 + 2?",
    "Mata Pelajaran": "Matematika",
    "Kesulitan": "EASY",
    "Pilihan A": "3",
    "Pilihan B": "4",
    "Pilihan C": "5",
    "Pilihan D": "6",
    "Pilihan E": "7",
    "Jawaban Benar": "B",
    "Penjelasan": "2 + 2 = 4"
  }
];

const worksheet = XLSX.utils.json_to_sheet(templateData);

// Set column widths
const wscols = [
  {wch: 40}, // Pertanyaan
  {wch: 15}, // Mata Pelajaran
  {wch: 10}, // Kesulitan
  {wch: 15}, // Pilihan A
  {wch: 15}, // Pilihan B
  {wch: 15}, // Pilihan C
  {wch: 15}, // Pilihan D
  {wch: 15}, // Pilihan E
  {wch: 15}, // Jawaban Benar
  {wch: 40}  // Penjelasan
];
worksheet['!cols'] = wscols;

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Template Soal");

const outPath = path.join(__dirname, '../frontend/public/Template_Soal_GasLulus.xlsx');
XLSX.writeFile(workbook, outPath);

console.log('Template generated at:', outPath);
