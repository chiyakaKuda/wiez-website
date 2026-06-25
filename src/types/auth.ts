import type {
  USER_ROLES,
  ZIMBABWE_PROVINCES,
  ENGINEERING_DISCIPLINES,
} from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];

export type ZimbabweProvince = (typeof ZIMBABWE_PROVINCES)[number];

export type EngineeringDiscipline = (typeof ENGINEERING_DISCIPLINES)[number];

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  phone?: string;
  province?: ZimbabweProvince;
  engineeringDiscipline?: EngineeringDiscipline;
  roles: UserRole[];
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
}

export interface AuthSession {
  user: UserWithRoles;
  session: {
    id: string;
    expiresAt: Date;
  };
}
