import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const loginagentcheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let isValidLogin = false;
    let allowed_user_agents = process.env.ALLOWED_USER_AGENTS?.split(',');
    let useragents = req.headers['user-agent']?.toLowerCase();
    //useragents = 'mozilla/5.0 (macintosh; intel mac os x 10_15_7) applewebkit/537.36 (khtml, like gecko) chrome/117.0.0.0 safari/537.36'
    console.log('useragents = ', useragents);
    for (let index = 0; index < allowed_user_agents!.length; index++) {
      const element = allowed_user_agents![index];
      console.log('useragents element= ', element);
      console.log(
        'useragents!.indexOf(element)= ',
        useragents!.indexOf(element)
      );
      if (Number(useragents!.indexOf(element)) > -1) {
        isValidLogin = true;
      }
    }
    console.log('final answer = ', isValidLogin);
    if (isValidLogin === false) {
      return res
        .status(401)
        .json({ isSucess: false, message: 'Unathourised login' });
      // res.status(401).send("Unathourised Login");
    } else {
      next();
    }
  } catch (err) {
    return res
      .status(401)
      .json({ isSucess: false, message: 'Please authenticate' });
    // res.status(401).send("Please authenticate");
  }
};
