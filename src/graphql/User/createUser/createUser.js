import prisma from "../../../prisma";

export default {
  Mutation: {
    createUser: async (_, args) => {
      const { name } = args;

      try {
        const user = await prisma.user.create({
          data: {
            name,
          },
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return user;
      } catch (e) {
        await prisma.$disconnect();

        throw Error(e);
      }
    },
  },
};
