"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    // clear existing data
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.eventCategory.deleteMany();
    // categories sesuai kebutuhan
    const categoryNames = ["Bootcamp", "Kuliah Umum", "Seminar", "Umum", "Workshop"];
    const categories = categoryNames.map((name) => prisma.eventCategory.create({ data: { name } }));
    const savedCategories = await Promise.all(categories);
    const events = [];
    const totalEvents = 20;
    const baseDate = new Date();
    for (let i = 0; i < totalEvents; i++) {
        const category = savedCategories[faker_1.faker.number.int({ min: 0, max: savedCategories.length - 1 })];
        // bikin tanggal acak per bulan (digeser +i bulan dari sekarang)
        const eventMonth = new Date(baseDate);
        eventMonth.setMonth(baseDate.getMonth() + i); // tiap event beda bulan
        // ambil random tanggal dalam bulan itu
        const startOfMonth = new Date(eventMonth.getFullYear(), eventMonth.getMonth(), 1);
        const endOfMonth = new Date(eventMonth.getFullYear(), eventMonth.getMonth() + 1, 0);
        const eventDate = faker_1.faker.date.between({ from: startOfMonth, to: endOfMonth });
        const event = await prisma.event.create({
            data: {
                name: faker_1.faker.company.name(),
                description: faker_1.faker.lorem.paragraph(),
                date: eventDate,
                location: faker_1.faker.location.city(),
                quota: faker_1.faker.number.int({ min: 20, max: 50 }),
                categoryId: category.id,
            },
        });
        events.push(event);
    }
    // buat peserta total ±200
    let totalParticipants = 0;
    for (const event of events) {
        const participantCount = Math.floor(200 / events.length); // rata-rata
        for (let i = 0; i < participantCount; i++) {
            // peserta dibuat random antara 1 bulan sebelum event sampai tanggal event
            const createdAt = faker_1.faker.date.between({
                from: new Date(event.date.getTime() - 30 * 24 * 60 * 60 * 1000),
                to: event.date,
            });
            await prisma.participant.create({
                data: {
                    fullName: faker_1.faker.person.fullName(),
                    email: faker_1.faker.internet.email(),
                    birthDate: faker_1.faker.date.birthdate({ min: 18, max: 50, mode: "age" }),
                    eventId: event.id,
                    ticketCode: faker_1.faker.string.uuid(),
                    status: "REGISTERED",
                    createdAt,
                },
            });
            totalParticipants++;
        }
    }
    console.log(`Seeding finished. Total participants: ${totalParticipants}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
