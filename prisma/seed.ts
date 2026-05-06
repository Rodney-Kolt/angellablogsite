import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Kiro Daily database...");

  // Create owner user (update email to your own)
  const owner = await prisma.user.upsert({
    where: { email: "rodynaine@gmail.com" },
    update: { isOwner: true },
    create: {
      email: "rodynaine@gmail.com",
      name: "Kiro",
      isOwner: true,
      bio: "just a girl writing her heart out ✨",
      image: null,
    },
  });

  console.log("✅ Owner created:", owner.email);

  // Create a sample post
  const post = await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "hello, world 🌸",
      slug: "hello-world",
      content: `<p>welcome to my little corner of the internet ✨</p>
<p>this is where i'll be documenting my days, my thoughts, my tiny joys. consider this a digital scrapbook — messy, honest, and very much mine.</p>
<p>i hope you find something here that makes you feel a little less alone 🫧</p>`,
      excerpt: "welcome to my little corner of the internet ✨",
      mood: "soft and hopeful",
      moodEmoji: "🌸",
      song: "Lavender Haze",
      songArtist: "Taylor Swift",
      tinyJoy: "the way sunlight looks through curtains in the morning",
      isDiaryLock: false,
      published: true,
      authorId: owner.id,
    },
  });

  console.log("✅ Sample post created:", post.title);
  console.log("🌸 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
