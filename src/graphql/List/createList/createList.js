import prisma from "../../../prisma";

export default {
  Mutation: {
    createList: async (_, args) => {
      const { contents } = args;

      try {
        const list = await prisma.list.create({ data: { contents } });

        return list;
      } catch (e) {
        await prisma.$disconnect();

        throw Error(e);
      }
    },
  },
};
