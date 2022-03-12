import {
    Injectable,
    Logger,
    NestMiddleware,
    Next,
    Req,
    Res,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private logger = new Logger();

    async use(@Req() req, @Res() res, @Next() next) {
        try {
            const tokenPrefix = 'Bearer ';
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.replace(tokenPrefix, '');

                const decodedInfo = await jwt.verify(token, process.env['JWT_SECRET']);
                this.logger.log(`claim confirmed from ${decodedInfo.user.email}`);
                req.auth = decodedInfo;
                return next();
            } else {
                res.status(401).send('invalid header');
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}
