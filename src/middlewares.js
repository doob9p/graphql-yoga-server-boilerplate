import prisma from "./prisma";

export const isAuthenticated = async (request) => {
  if (!request.user || !request.user.id) {
    throw Error("유저 정보가 존재하지 않습니다.");
  }

  const isUser = await prisma.user.count({
    where: {
      id: request.user.id,
    },
  });
  if (isUser === 0) {
    throw Error("유저 정보가 존재하지 않습니다.");
  }
};
