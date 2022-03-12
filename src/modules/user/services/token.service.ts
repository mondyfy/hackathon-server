import { Injectable } from "@nestjs/common";
import { TokenTypes } from "../enums";

import { Moment } from 'moment';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';
import { UserAttributes } from "../interfaces/user.interface";
import { Connection, Repository } from "typeorm";
import { Token } from "src/database/models/token.entity";
import { User } from "src/database/models/user.entity";
require('dotenv').config();

@Injectable()
export class TokenService {
    private _tokenRepository: Repository<Token>;
    private _userRepository: Repository<User>;

    constructor(private _connection: Connection) {
        this._tokenRepository = this._connection.getRepository(Token);
        this._userRepository = this._connection.getRepository(User);
    }

    async saveToken(token: string,
        userId: number,
        expires: Moment,
        type: TokenTypes,
        blacklisted = false,) {
        const userInfo = await this._userRepository.findOne(userId);
        const res = await this._tokenRepository.save({
            token,
            user: userInfo,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
        return res;
    }

    /**
     * Generate token
     * @param {ObjectId} userId
     * @param {Moment} expires
     * @param {string} [secret]
     * @returns {string}
     */
    public generateToken(
        user: UserAttributes,
        expires: Moment,
        type: TokenTypes,
        secret = process.env['JWT_SECRET'],
    ) {
        const payload = {
            user,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    };

    /**
     * Generate auth tokens
     * @param {User} user
     * @returns {Promise<Object>}
     */
    async generateAuthTokens(user: UserAttributes) {
        const accessTokenExpires = moment().add(process.env['ACCESS_TOKEN_VALIDITY_DAYS'], 'days');
        const accessToken = this.generateToken(user, accessTokenExpires, TokenTypes.ACCESS);

        const refreshTokenExpires = moment().add(process.env['REFRESH_TOKEN_VALIDITY_DAYS'], 'days');
        const refreshToken = this.generateToken(user, refreshTokenExpires, TokenTypes.REFRESH);
        await this.saveToken(refreshToken, user.id, refreshTokenExpires, TokenTypes.REFRESH);

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    };

    /**
     * Verify token and return token record (or throw an error if it is not valid)
     * @param {string} token
     * @param {string} type
     * @returns {Promise<Token>}
     */
    async verifyToken(token: string, type: TokenTypes) {
        const payload: any = jwt.verify(token, process.env['JWT_SECRET']);

        const tokenInfo = await this._tokenRepository.findOne({
            where: {
                type,
                token,
                user: payload.user.id,
                blacklisted: false,
            },
            relations: ['user']
        });
        if (!tokenInfo) {
            throw new Error('Token not found');
        }
        return tokenInfo;
    };

    /**
     * Delete Token
     * @param {string} refreshToken
     * @returns {Promise}
     */
    async removeRefreshToken(token: string) {
        const refreshToken = await this._tokenRepository.findOne({
            where: {
                token,
                type: TokenTypes.REFRESH,
                blacklisted: false,
            },
        });
        if (!refreshToken) {
            throw new Error('Token Not found');
        }
        return await this._tokenRepository.delete(refreshToken.id);
    };

    /**
     * Delete Tokens
     * @param {string} refreshToken
     * @returns {Promise}
     */
    async removeToken(token: string, type: TokenTypes) {
        const tokenInfo = await this._tokenRepository.findOne({
            where: {
                token,
                type
            },
        });
        if (!tokenInfo) {
            throw new Error('Token Not found');
        }
        return await this._tokenRepository.delete(tokenInfo.id);
    };

    /**
     * Generate reset password token
     * @param {string} email
     * @returns {Promise<string>}
     */
    async generateResetPasswordToken(email: string) {
        const user = await this._userRepository.findOneOrFail({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error('No users found with this email');
        }
        const expires = moment().add(process.env['RESET_PASSWORD_EXPIRATION_MINUTES'], 'minutes');
        const resetPasswordToken = this.generateToken(user, expires, TokenTypes.RESET_PASSWORD);
        await this.saveToken(resetPasswordToken, user.id, expires, TokenTypes.RESET_PASSWORD);
        return resetPasswordToken;
    };
}