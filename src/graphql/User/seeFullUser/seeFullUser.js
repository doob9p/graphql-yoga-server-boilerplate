import prisma from "../../../prisma";

export default {
  Query: {
    seeFullUser: async () => {
      try {
        const users = await prisma.user.findMany();

        return users;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
