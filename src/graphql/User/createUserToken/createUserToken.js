import prisma from "../../../prisma";
import { ShaEncrytion, generateToken } from "../../../utils";

export default {
  Query: {
    createUserToken: async (_, args) => {
      const { email, password } = args;

      const obj = {
        isSuccess: false,
        token: "",
        message: "",
      };

      try {
        const userCount = await prisma.user.count({
          where: {
            email,
          },
        });
        if (userCount === 0) {
          obj.message = "존재하지 않는 회원입니다";

          return obj;
        }

        const user = await prisma.user.findOne({
          where: { email },
          select: { id: true, password: true, salt: true },
        });
        const encPwd = ShaEncrytion(password, user.salt);

        if (user.password !== encPwd) {
          obj.message = "비밀번호가 올바르지 않습니다";

          return obj;
        }

        obj.isSuccess = true;
        obj.token = generateToken(user.id);

        return obj;
      } catch (e) {
        await prisma.$disconnect();

        throw Error(e);
      }
    },
  },
};
