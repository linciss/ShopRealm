import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'invalidEmail' })
      .min(1, { message: 'enterEmail' }),
    password: z.string().min(8, { message: 'min8Chars' }),
  })
  .superRefine(({ password }, validate) => {
    // checks for the appropriate password strength
    const containsLowerCase = /[a-z]/.test(password);
    const containsUpperCase = /[A-Z]/.test(password);
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const containsNumber = /[0-9]/.test(password);

    if (
      !containsLowerCase ||
      !containsUpperCase ||
      !containsSpecialCharacter ||
      !containsNumber
    ) {
      validate.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'tooWeakPassword',
      });
    }
  });

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: 'name' }),
    lastName: z.string().min(1, { message: 'lastName' }),
    email: z.string().email({ message: 'invalidEmail' }),
    password: z.string().min(8, { message: 'min8Chars' }),
    passwordConfirmation: z.string().min(8, { message: 'min8Chars' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'passNotMatch',
    path: ['password'],
  })
  .superRefine(({ password }, validate) => {
    // checks for the appropriate password strength
    const containsLowerCase = /[a-z]/.test(password);
    const containsUpperCase = /[A-Z]/.test(password);
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const containsNumber = /[0-9]/.test(password);

    if (
      !containsLowerCase ||
      !containsUpperCase ||
      !containsSpecialCharacter ||
      !containsNumber
    ) {
      validate.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'tooWeakPassword',
      });
    }
  });

export const personalInfoSchema = z.object({
  name: z.string().min(1, { message: 'name' }),
  lastName: z.string().min(1, { message: 'lastName' }),
  phone: z.string().min(8, { message: 'phone' }).max(8, { message: 'phone' }),
});

export const addressInfoSchema = z.object({
  street: z.string().min(1, { message: 'address' }),
  city: z.string().min(1, { message: 'city' }),
  country: z.string().min(1, { message: 'country' }),
  postalCode: z.string().min(1, { message: 'postalCode' }),
});

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'shopName' })
    .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? '')),
  description: z.string().min(10, { message: 'shopDesc' }),
  phone: z.string().min(8, { message: 'phone' }).max(8, { message: 'phone' }),
});

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const productSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'productName' })
      .max(30, { message: '30letters' })
      .refine((value) => /^[a-zA-Z0-9_.\- ]*$/.test(value ?? ''), {
        message: 'letters',
      }),
    description: z.string().min(20, { message: 'prodDesc' }),
    price: z
      .number()
      .refine(
        (val) =>
          !isNaN(Number.parseFloat(val.toString())) &&
          Number.parseFloat(val.toString()) >= 0,
        {
          message: 'price',
        },
      ),
    category: z.array(z.string()).min(1, { message: 'category' }),
    image: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file?.size <= MAX_FILE_SIZE, {
            message: `maxSize`,
          })
          .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
            message: 'formats',
          }),
        z.string().min(1),
      ])
      .refine((value) => !!value, { message: 'image' }),
    quantity: z
      .number()
      .refine(
        (val) =>
          !isNaN(Number.parseInt(val.toString())) &&
          Number.parseInt(val.toString()) >= 0,
        {
          message: 'quantity',
        },
      ),
    isActive: z.boolean(),
    details: z.string().min(5, { message: 'productDetails' }),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    sale: z.boolean(),
    salePrice: z
      .number()
      .refine(
        (val) =>
          !isNaN(Number.parseFloat(val.toString())) &&
          Number.parseFloat(val.toString()) >= 0,
        {
          message: 'salePriceError',
        },
      )
      .optional(),
  })
  .superRefine(({ salePrice, price, sale }, validate) => {
    // checks if price is smaller than sale price
    if (sale && salePrice !== undefined && salePrice >= price) {
      validate.addIssue({
        code: 'custom',
        path: ['salePrice'],
        message: 'salePriceError',
      });
    }
  });

export const reviewSchema = z.object({
  rating: z
    .number()
    .refine(
      (val) =>
        !isNaN(Number.parseInt(val.toString())) &&
        Number.parseInt(val.toString()) >= 1 &&
        Number.parseInt(val.toString()) <= 5,
      {
        message: 'rating',
      },
    ),
  comment: z.string().min(10, { message: 'ratingDesc' }),
});

export const shippingInfoSchema = personalInfoSchema.merge(addressInfoSchema);

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'min8Chars' }),
  newPasswordConfirm: z.string().min(8, { message: 'min8Chars' }),
});

// change password for users who have access to their account
export const changeProfilePasswordSchema = changePasswordSchema
  .extend({
    oldPassword: z.string().min(8, { message: 'min8Chars' }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'doNotMatch',
    path: ['newPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'cantBeSame',
    path: ['newPassword'],
  })
  .superRefine(({ newPassword, newPasswordConfirm, oldPassword }, validate) => {
    // checks for the appropriate password strength
    const checkStrength = (password: string, path: string[]) => {
      const containsLowerCase = /[a-z]/.test(password);
      const containsUpperCase = /[A-Z]/.test(password);
      const containsSpecialCharacter =
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
      const containsNumber = /[0-9]/.test(password);

      if (
        !containsLowerCase ||
        !containsUpperCase ||
        !containsSpecialCharacter ||
        !containsNumber
      ) {
        validate.addIssue({
          code: 'custom',
          path,
          message: 'tooWeakPassword',
        });
      }
    };

    checkStrength(oldPassword, ['oldPassword']);
    checkStrength(newPassword, ['newPassword']);
    checkStrength(newPasswordConfirm, ['newPasswordConfirm']);
  });

export const createPasswordSchema = changePasswordSchema
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'doNotMatch',
    path: ['newPassword'],
  })
  .superRefine(({ newPassword, newPasswordConfirm }, validate) => {
    // checks for the appropriate password strength
    const checkStrength = (password: string, path: string[]) => {
      const containsLowerCase = /[a-z]/.test(password);
      const containsUpperCase = /[A-Z]/.test(password);
      const containsSpecialCharacter =
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
      const containsNumber = /[0-9]/.test(password);

      if (
        !containsLowerCase ||
        !containsUpperCase ||
        !containsSpecialCharacter ||
        !containsNumber
      ) {
        validate.addIssue({
          code: 'custom',
          path,
          message: 'tooWeakPassword',
        });
      }
    };
    checkStrength(newPassword, ['newPassword']);
    checkStrength(newPasswordConfirm, ['newPasswordConfirm']);
  });
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'invalidEmail' }),
});

export const deleteConfirmationSchema = z
  .object({
    password: z.string().min(8, { message: 'min8Chars' }),
  })
  .superRefine(({ password }, validate) => {
    // checks for the appropriate password strength
    const checkStrength = (password: string, path: string[]) => {
      const containsLowerCase = /[a-z]/.test(password);
      const containsUpperCase = /[A-Z]/.test(password);
      const containsSpecialCharacter =
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
      const containsNumber = /[0-9]/.test(password);

      if (
        !containsLowerCase ||
        !containsUpperCase ||
        !containsSpecialCharacter ||
        !containsNumber
      ) {
        validate.addIssue({
          code: 'custom',
          path,
          message: 'tooWeakPassword',
        });
      }
    };
    checkStrength(password, ['password']);
  });
