import { Injectable } from "@nestjs/common";
import { TokenTypes } from "../enums";
import * as bcrypt from 'bcrypt';

import { UserAttributes } from "../interfaces/user.interface";
import { UserService } from "./user.service";
import { TokenService } from "./token.service";
require('dotenv').config();

@Injectable()
export class AuthService {
    constructor(private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) { }

    /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
    async isPasswordMatch(password: string, user: UserAttributes) {
        return bcrypt.compare(password, user.password);
    };

    /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
    async loginUserWithEmailAndPassword(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user || !(await this.isPasswordMatch(password, user))) {
            throw new Error('Incorrect email or password');
        }
        return user;
    };

    /**
     * Logout
     * @param {string} refreshToken
     * @returns {Promise}
     */
    async logout(refreshToken: string) {
        return await this.tokenService.removeRefreshToken(refreshToken);
    };

    /**
     * Refresh auth tokens
     * @param {string} refreshToken
     * @returns {Promise<Object>}
     */
    async refreshAuth(refreshToken: string) {
        try {
            const tokenInfo = await this.tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
            const user = await this.userService.findOne(tokenInfo.user.id);
            if (!user) {
                throw new Error('User not found');
            }
            await this.tokenService.removeRefreshToken(refreshToken);
            return this.tokenService.generateAuthTokens(user);
        } catch (error) {
            throw new Error('Please authenticate');
        }
    };

    /**
     * Reset password
     * @param {string} resetPasswordToken
     * @param {string} newPassword
     * @returns {Promise}
     */
    async resetPassword(resetPasswordToken: string, newPassword: string) {
        try {
            const resetPasswordTokenDoc = await this.tokenService.verifyToken(
                resetPasswordToken,
                TokenTypes.RESET_PASSWORD,
            );
            const user = await this.userService.findOne(resetPasswordTokenDoc.user.id);
            if (!user) {
                throw new Error();
            }
            await this.tokenService.removeToken(resetPasswordToken, TokenTypes.RESET_PASSWORD);
            await this.userService.update(user.id, { password: newPassword });
        } catch (error) {
            throw new Error('Password reset failed');
        }
    };
}