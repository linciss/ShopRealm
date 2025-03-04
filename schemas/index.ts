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
