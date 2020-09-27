import prisma from "../../../prisma";

export default {
  Mutation: {
    updatePost: async (_, args) => {
      const { contents } = args;

      try {
        const post = await prisma.post.update({
          where: {
            id: "",
          },
          data: { contents },
          select: {
            id: true,
            contents: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return post;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
