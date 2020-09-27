import prisma from "../../../prisma";

export default {
  Mutation: {
    createPost: async (_, args) => {
      const { contents } = args;

      try {
        const post = await prisma.post.create({ data: { contents } });

        return post;
      } catch (e) {
        await prisma.$disconnect();

        throw Error(e);
      }
    },
  },
};
