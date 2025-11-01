import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Hash passwords
  const pass1 = await bcrypt.hash('password123', 10);
  const pass2 = await bcrypt.hash('password123', 10);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@bits.com',
      name: 'Alice',
      password: pass1,
      skills: ['React', 'Node.js'],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@bits.com',
      name: 'Bob',
      password: pass2,
      skills: ['Python', 'Data Analysis'],
    },
  });

  console.log(`Created users: ${user1.name}, ${user2.name}`);

  // Create Projects (posted by Alice)
  await prisma.project.create({
    data: {
      title: 'Build a Note-Taking App',
      description: 'Need help building a simple React note-taking app.',
      category: 'Web Development',
      authorId: user1.id, // Link to Alice
    },
  });

  await prisma.project.create({
    data: {
      title: 'Thermodynamics Problem Set',
      description: 'Looking for a partner to review 2nd-year thermo problems.',
      category: 'Academics',
      authorId: user1.id, // Link to Alice
    },
  });

  // Create Project (posted by Bob)
  await prisma.project.create({
    data: {
      title: 'Drone Club Logo Design',
      description: 'Need a cool logo for the new drone racing club.',
      category: 'Design',
      authorId: user2.id, // Link to Bob
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });