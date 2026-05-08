import prisma from './src/lib/prisma.js';

async function updateTitles() {
  try {
    const exams = await prisma.exam.findMany({
      where: { category: 'CPNS' }
    });

    for (const exam of exams) {
      if (!exam.title.startsWith('CPNS - ')) {
        const newTitle = `CPNS - ${exam.title}`;
        await prisma.exam.update({
          where: { id: exam.id },
          data: { title: newTitle }
        });
        console.log(`Updated: ${exam.title} -> ${newTitle}`);
      }
    }
    console.log('✅ Update judul tryout CPNS selesai!');
  } catch (error) {
    console.error('Gagal update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTitles();
