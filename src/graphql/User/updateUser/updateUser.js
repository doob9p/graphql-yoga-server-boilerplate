import prisma from "../../../prisma";

export default {
  Mutation: {
    updateUser: async (_, args) => {
      const { name } = args;

      try {
        const user = await prisma.user.update({
          where: {
            id: "",
          },
          data: { name },
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return user;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
