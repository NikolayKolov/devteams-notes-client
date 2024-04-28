import { z } from 'zod';

export const CreateUser = z.object({
    email: z.string().email().min(5),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(8, { message: 'Must have at least 8 characters' }),
    passwordRepeat: z.string().min(8, { message: 'Must have at least 8 characters' })
}).refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords don't match",
    path: ["passwordRepeat"], // path of error
}).superRefine(({ password }, ctx) => {
    // password strength regex
    const passwordContainUpperCase = /[A-Z]+/g;
    const passwordContainLowerCase = /[a-z]+/g;
    const passwordContainNumber = /[0-9]+/g;
    const passwordContainSpecial = /[!@#$%^&*()\\]+/g;
    // check password strength
    const errorMessage = [];
    const hasLower = passwordContainLowerCase.test(password);
    if (!hasLower) errorMessage.push('Must have at least one lowercase letter');

    const hasUpper = passwordContainUpperCase.test(password);
    if (!hasUpper) errorMessage.push('Must have at least one capital letter');

    const hasNumber = passwordContainNumber.test(password);
    if (!hasNumber) errorMessage.push('Must have at least one number');

    const hasSpecial = passwordContainSpecial.test(password);
    if (!hasSpecial) errorMessage.push('Must have at least one of these characters: !@#$%^&*()');

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
        ctx.addIssue({
            code: 'custom',
            message: errorMessage.join('\n'),
            path: ['password']
        });
    }
});

export type UserCreateRequestType = z.infer<typeof CreateUser>; 