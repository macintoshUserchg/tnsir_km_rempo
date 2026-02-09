import { z } from 'zod';

// Application form schema with validation
export const applicationSchema = z.object({
    // Applicant type: CITIZEN or PUBLIC_REP
    applicantType: z.enum(['CITIZEN', 'PUBLIC_REP'], {
        message: 'कृपया आवेदक का प्रकार चुनें / Please select applicant type',
    }),

    // Basic info
    name: z
        .string()
        .min(2, 'नाम कम से कम 2 अक्षर का होना चाहिए / Name must be at least 2 characters')
        .max(100, 'नाम 100 अक्षरों से अधिक नहीं हो सकता'),

    fatherName: z
        .string()
        .min(2, 'पिता का नाम कम से कम 2 अक्षर का होना चाहिए')
        .max(100, 'पिता का नाम 100 अक्षरों से अधिक नहीं हो सकता'),

    address: z
        .string()
        .min(10, 'कृपया पूरा पता दें / Please provide complete address')
        .max(500, 'पता 500 अक्षरों से अधिक नहीं हो सकता'),

    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'कृपया वैध 10 अंकों का मोबाइल नंबर दें / Please enter valid 10 digit mobile number'),

    vidhansabhaId: z
        .number({
            message: 'कृपया विधानसभा चुनें / Please select Vidhansabha',
        })
        .int()
        .positive(),

    workTypeId: z
        .number({
            message: 'कृपया कार्य का प्रकार चुनें / Please select work type',
        })
        .int()
        .positive(),

    description: z
        .string()
        .min(20, 'विवरण कम से कम 20 अक्षर का होना चाहिए / Description must be at least 20 characters')
        .max(2000, 'विवरण 2000 अक्षरों से अधिक नहीं हो सकता'),

    // Optional fields for PUBLIC_REP
    post: z.string().optional(),
});

// Infer the type from the schema
export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Schema for file upload
export const fileUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, 'फाइल का आकार 5MB से अधिक नहीं हो सकता')
        .refine(
            (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
            'केवल PDF, JPG, PNG फाइलें मान्य हैं'
        )
        .optional(),
});
