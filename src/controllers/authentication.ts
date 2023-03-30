import express from 'express';

import { createUser, getUserByEmail } from '../db/users'
import { random, authentication } from '../helpers/index';

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            console.log('request body', req.body)
            console.log('any of these?', email);
            console.log('any of these?', password);
            console.log('any of these?', username);
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        
        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
              },
          });

        return res.status(200).json(user).end();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}