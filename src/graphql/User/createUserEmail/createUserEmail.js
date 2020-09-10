import prisma from "../../../prisma";
import { newShaEncrytion } from "../../../utils";

export default {
  Mutation: {
    createUserEmail: async (_, args) => {
      const { name, email, password } = args;

      try {
        const { encryptPwd, salt } = newShaEncrytion(password);

        const userCount = await prisma.user.count({
          where: {
            email,
          },
        });
        if (userCount !== 0) {
          return null;
        }

        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: encryptPwd,
            salt,
            type: "EMAIL",
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
