import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

const main = async () => {
  // delete all data
  await prisma.notes.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // create a user
  const user = await prisma.user.create({
    data: {
      email: "johndoe@gmail.com",
      password: await bcrypt.hash("123456789", 10),
      username: "johndoe",
    },
  });
  //create 100 contacts with faker
  for (let i = 0; i < 100; i++) {
    await prisma.contact.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        company: faker.company.name(),
        department: faker.commerce.department(),
        position: faker.person.jobTitle(),
        userId: user.id,
        notes: {
          create: {
            content: faker.lorem.paragraphs(4),
          },
        },
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}, ${faker.location.country()}`,
      },
    });
  }
};

// Call main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
