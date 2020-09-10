import prisma from "../../../prisma";

export default {
  Mutation: {
    createUserKakao: async (_, args) => {
      const { name, refreshToken } = args;

      try {
        const user = await prisma.user.create({
          data: {
            name,
            refreshToken,
            type: "KAKAO",
          },
          select: {
            id: true,
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
