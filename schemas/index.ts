import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Lūdzu ievadiet pareizu epastu' })
      .min(1, { message: 'Lūdzu ievadiet epastu' }),
    password: z
      .string()
      .min(8, { message: 'Parolei jābūt vismaz 8 simbolus garai' }),
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
        message:
          'Parole ir par vāju. Parolei jāsatur vismaz viens lielais burts, viens mazais burts, viens cipars un viens speciālais simbols.',
      });
    }
  });

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Vārdam jābūt vismaz 1 simbolam garam' }),
    lastName: z
      .string()
      .min(1, { message: 'Uzvārdam jābūt vismaz 1 simbolam garam' }),
    email: z.string().email({ message: 'Lūdzu ievadiet pareizu epastu' }),
    password: z
      .string()
      .min(8, { message: 'Parolei jābūt vismaz 8 simbolus garai' }),
    passwordConfirmation: z
      .string()
      .min(8, { message: 'Parolei jābūt vismaz 8 simbolus garai' }),
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
        message:
          'Parole ir par vāju. Parolei jāsatur vismaz 8 simboli Parolei jāsatur vismaz viens lielais burts, viens mazais burts, viens cipars, viens speciālais simbols.',
      });
    }
  });

export const personalInfoSchema = z.object({
  name: z.string().min(1, { message: 'Vārdam jābūt vismaz 1 simbolam garam' }),
  lastName: z
    .string()
    .min(1, { message: 'Uzvārdam jābūt vismaz 1 simbolam garam' }),
  phone: z
    .string()
    .min(8, { message: 'Talruna numuram jabut pareizam' })
    .max(8, { message: 'Talruna numuram jabut pareizam' }),
});

export const addressInfoSchema = z.object({
  street: z.string().min(1, { message: 'Adreseu jabut pareizai!' }),
  city: z.string().min(1, { message: 'Ievadi pareizu pisletu!' }),
  country: z.string().min(1, { message: 'Izvelies valsti!' }),
  postalCode: z.string().min(1, { message: 'Ieraksti pareizu kodu!' }),
});

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nosaukumam jābūt vismaz 3 simboliem garam' })
    .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value ?? '')),
  description: z.string().min(10, { message: 'Jabut noraditam descriptionam' }),
  phone: z
    .string()
    .min(8, { message: 'Talruna numuram jabut pareizam' })
    .max(8, { message: 'Talruna numuram jabut pareizam' }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nosakumuma jabut normala,' })
    .max(30, { message: ' nevar p[asrsniegt 30 burtus' })
    .refine((value) => /^[a-zA-Z0-9_.\- ]*$/.test(value ?? ''), {
      message: 'jabut normalam',
    }),
  description: z.string().min(20, { message: 'Ievadi produkta aprakstu' }),
  price: z
    .number()
    .refine(
      (val) =>
        !isNaN(Number.parseFloat(val.toString())) &&
        Number.parseFloat(val.toString()) >= 0,
      {
        message: 'Vajag cenu!',
      },
    ),
  category: z
    .array(z.string())
    .min(1, { message: 'Jbaut vismaz 1 kategorijai' }),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file?.size <= MAX_FILE_SIZE, {
          message: `Maksimalais izmers ir 5MB`,
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
          message: 'Tiaki .jpg, .jpeg, .png and .webp foramtus var.',
        }),
      z.string().min(1),
    ])
    .refine((value) => !!value, { message: 'Vajag bildi!' }),
  quantity: z
    .number()
    .refine(
      (val) =>
        !isNaN(Number.parseInt(val.toString())) &&
        Number.parseInt(val.toString()) >= 0,
      {
        message: 'Vajag daduzumui',
      },
    ),
  isActive: z.boolean(),
  details: z.string().min(5, { message: 'Dzilak paskaidro par savu preci' }),
  specifications: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
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
        message: 'Atsaukmes reitingam jabut no 1 lidz 5',
      },
    ),
  comment: z.string().min(10, { message: 'Jabut vismaz 10 simboliem garam' }),
});
