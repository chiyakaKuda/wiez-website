CREATE TYPE "public"."enquiry_category" AS ENUM('membership', 'events', 'payment', 'technical', 'other');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('open', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_document_status" AS ENUM('pending', 'uploaded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_document_type" AS ENUM('student_id', 'proof_of_enrollment', 'cv', 'passport_photo', 'degree_certificate', 'transcript', 'proof_of_employment', 'engineering_council', 'professional_headshot', 'certificate_of_incorporation', 'company_profile', 'tax_clearance', 'letter_of_intent', 'payment_proof');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_flow" AS ENUM('registration', 'event_registration', 'status_check', 'enquiry', 'login');--> statement-breakpoint
CREATE TYPE "public"."event_province" AS ENUM('Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands');--> statement-breakpoint
CREATE TYPE "public"."event_registration_payment_status" AS ENUM('not_required', 'pending', 'submitted', 'verified');--> statement-breakpoint
CREATE TYPE "public"."event_registration_source" AS ENUM('web', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."event_registration_status" AS ENUM('pending_review', 'confirmed', 'rejected', 'cancelled', 'attended');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('free', 'paid', 'member_only', 'corporate_sponsored');--> statement-breakpoint
CREATE TABLE "whatsapp_document_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_number" text NOT NULL,
	"user_id" uuid,
	"membership_id" uuid,
	"document_type" "whatsapp_document_type" NOT NULL,
	"meta_media_id" text NOT NULL,
	"uploadthing_url" text,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"status" "whatsapp_document_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_number" text NOT NULL,
	"user_id" uuid,
	"category" "enquiry_category" NOT NULL,
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'open' NOT NULL,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_number" text NOT NULL,
	"user_id" uuid,
	"current_flow" "whatsapp_flow",
	"current_step" text,
	"flow_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_authenticated" boolean DEFAULT false NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_sessions_whatsapp_number_unique" UNIQUE("whatsapp_number")
);
--> statement-breakpoint
CREATE TABLE "event_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_reference" text NOT NULL,
	"payment_proof_url" text NOT NULL,
	"status" "payment_status" DEFAULT 'submitted' NOT NULL,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"ticket_number" text,
	"registration_reference" text NOT NULL,
	"status" "event_registration_status" DEFAULT 'pending_review' NOT NULL,
	"payment_status" "event_registration_payment_status" DEFAULT 'not_required' NOT NULL,
	"payment_method" "payment_method",
	"payment_reference" text,
	"payment_proof_url" text,
	"source" "event_registration_source" DEFAULT 'web' NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_registrations_ticket_number_unique" UNIQUE("ticket_number"),
	CONSTRAINT "event_registrations_registration_reference_unique" UNIQUE("registration_reference")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"venue" text NOT NULL,
	"province" "event_province" NOT NULL,
	"type" "event_type" NOT NULL,
	"fee" numeric(10, 2) DEFAULT 0 NOT NULL,
	"capacity" integer NOT NULL,
	"registered_count" integer DEFAULT 0 NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"image_url" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "whatsapp_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "whatsapp_document_uploads" ADD CONSTRAINT "whatsapp_document_uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_document_uploads" ADD CONSTRAINT "whatsapp_document_uploads_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_enquiries" ADD CONSTRAINT "whatsapp_enquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_enquiries" ADD CONSTRAINT "whatsapp_enquiries_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_sessions" ADD CONSTRAINT "whatsapp_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_payments" ADD CONSTRAINT "event_payments_registration_id_event_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_payments" ADD CONSTRAINT "event_payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_payments" ADD CONSTRAINT "event_payments_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_whatsapp_number_unique" UNIQUE("whatsapp_number");