import { PrismaClient, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const students = [
  {
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    phone: "+8801711000001",
    class: "Grade 10",
    status: Status.ACTIVE,
  },
  {
    name: "Jamal Hossain",
    email: "jamal.hossain@example.com",
    phone: "+8801711000002",
    class: "Grade 9",
    status: Status.ACTIVE,
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    phone: "+8801711000003",
    class: "Grade 11",
    status: Status.INACTIVE,
  },
  {
    name: "Karim Uddin",
    email: "karim.uddin@example.com",
    phone: "+8801711000004",
    class: "Grade 10",
    status: Status.ACTIVE,
  },
  {
    name: "Farhana Akter",
    email: "farhana.akter@example.com",
    phone: "+8801711000005",
    class: "Grade 12",
    status: Status.INACTIVE,
  },
];

async function main() {
  for (const student of students) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: student,
    });
  }

  console.log(`Seeded ${students.length} students`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
