import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

import prisma from "./prisma";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user.findOne({
      where: {
        id: payload.id,
      },
      select: { id: true },
    });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
};

export const authenticateJwt = (req, res, next) => {
  passport.authenticate("user-rule", { session: false }, (err, user) => {
    if (user) {
      req.user = user;
    }

    next();
  })(req, res, next);
};

passport.use("user-rule", new JwtStrategy(jwtOptions, verifyUser));
passport.initialize();
