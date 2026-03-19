CREATE TABLE "beneficial_ownership" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"layer" integer DEFAULT 1 NOT NULL,
	"owner_type" text NOT NULL,
	"owner_name" text NOT NULL,
	"ownership_percentage" numeric(5, 2),
	"nationality" text,
	"date_of_birth" date,
	"passport_number" text,
	"residential_address" text,
	"company_registration_number" text,
	"country_of_incorporation" text,
	"trust_name" text,
	"trustee_name" text,
	"is_ultimate_beneficial_owner" boolean DEFAULT false,
	"is_pep" boolean DEFAULT false,
	"pep_details" text,
	"document_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capital_call_allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"capital_call_id" integer NOT NULL,
	"lp_commitment_id" integer NOT NULL,
	"lp_name" text NOT NULL,
	"allocated_amount" numeric(20, 2) NOT NULL,
	"received_amount" numeric(20, 2) DEFAULT '0',
	"outstanding_amount" numeric(20, 2),
	"received_date" date,
	"wire_reference" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capital_calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"fund_id" integer NOT NULL,
	"call_number" integer NOT NULL,
	"call_date" date NOT NULL,
	"due_date" date NOT NULL,
	"call_percent" numeric(10, 4),
	"call_amount" numeric(20, 2) NOT NULL,
	"purpose" text NOT NULL,
	"investment_amount" numeric(20, 2),
	"management_fee_amount" numeric(20, 2),
	"expenses_amount" numeric(20, 2),
	"total_noticed" numeric(20, 2),
	"total_received" numeric(20, 2) DEFAULT '0',
	"receipt_percent" numeric(10, 4) DEFAULT '0',
	"fund_admin_reference" text,
	"wire_instructions" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capital_distributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"fund_id" integer NOT NULL,
	"distribution_number" integer NOT NULL,
	"distribution_date" date NOT NULL,
	"total_amount" numeric(20, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"distribution_type" text NOT NULL,
	"return_of_capital_amount" numeric(20, 2) DEFAULT '0',
	"realized_gains_amount" numeric(20, 2) DEFAULT '0',
	"lp_allocations" jsonb DEFAULT '[]'::jsonb,
	"fund_admin_reference" text,
	"related_investment" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"submitted_by" integer NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"minimum_aum_met" boolean DEFAULT false,
	"experience_aligned_with_strategy" boolean DEFAULT false,
	"wealth_corroboration_percentage" integer,
	"committee_members" jsonb DEFAULT '[]'::jsonb,
	"decision" text DEFAULT 'pending',
	"decision_date" date,
	"decision_rationale" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_classification" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"classification" text NOT NULL,
	"classification_basis" text,
	"meets_net_worth_requirement" boolean DEFAULT false,
	"meets_portfolio_requirement" boolean DEFAULT false,
	"meets_experience_requirement" boolean DEFAULT false,
	"classification_date" date NOT NULL,
	"classified_by" integer,
	"approved_by" integer,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custodians" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"custodian_type" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"api_endpoint" text,
	"ftp_host" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund_structures" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"fund_name" text NOT NULL,
	"fund_code" text,
	"strategy_type" text,
	"legal_structure" text,
	"currency" text DEFAULT 'USD' NOT NULL,
	"vintage" integer,
	"target_fund_size" numeric(20, 2),
	"hard_cap" numeric(20, 2),
	"total_commitments" numeric(20, 2) DEFAULT '0',
	"called_capital" numeric(20, 2) DEFAULT '0',
	"uncalled_capital" numeric(20, 2) DEFAULT '0',
	"distributed_capital" numeric(20, 2) DEFAULT '0',
	"management_fee_rate" numeric(10, 4),
	"performance_fee_rate" numeric(10, 4),
	"hurdle_rate" numeric(10, 4),
	"high_water_mark" boolean DEFAULT true,
	"fund_administrator" text,
	"auditor" text,
	"legal_counsel" text,
	"prime_broker" text,
	"inception_date" date,
	"first_close_date" date,
	"final_close_date" date,
	"investment_period_end" date,
	"fund_term_date" date,
	"status" text DEFAULT 'fundraising' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lp_commitments" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"fund_id" integer NOT NULL,
	"client_id" integer,
	"lp_name" text NOT NULL,
	"lp_type" text,
	"lp_jurisdiction" text,
	"committed_capital" numeric(20, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"called_capital" numeric(20, 2) DEFAULT '0',
	"uncalled_capital" numeric(20, 2),
	"called_percent" numeric(10, 4) DEFAULT '0',
	"distributed_capital" numeric(20, 2) DEFAULT '0',
	"net_contributions" numeric(20, 2),
	"commitment_date" date NOT NULL,
	"first_close_date" date,
	"subscribed_date" date,
	"subscription_docs_signed" boolean DEFAULT false,
	"kyc_approved" boolean DEFAULT false,
	"wire_received" boolean DEFAULT false,
	"status" text DEFAULT 'committed' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"fund_id" integer NOT NULL,
	"nav_date" date NOT NULL,
	"gross_aum" numeric(20, 2) NOT NULL,
	"net_aum" numeric(20, 2) NOT NULL,
	"shares_outstanding" numeric(20, 6),
	"nav_per_share" numeric(20, 6),
	"mtd_return" numeric(10, 6),
	"qtd_return" numeric(10, 6),
	"ytd_return" numeric(10, 6),
	"inception_return" numeric(10, 6),
	"gross_return" numeric(10, 6),
	"management_fee_accrual" numeric(20, 2),
	"performance_fee_accrual" numeric(20, 2),
	"total_expenses" numeric(20, 2),
	"capital_called" numeric(20, 2) DEFAULT '0',
	"capital_returned" numeric(20, 2) DEFAULT '0',
	"confirmed_by_fund_admin" boolean DEFAULT false,
	"confirmed_at" timestamp,
	"confirmed_by" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"portfolio_name" text NOT NULL,
	"account_number" text,
	"investment_risk_profile" text,
	"investment_objective" text,
	"benchmark_index" text,
	"total_market_value" numeric(20, 2),
	"total_cost_basis" numeric(20, 2),
	"total_unrealized_pnl" numeric(20, 2),
	"total_realized_pnl" numeric(20, 2),
	"gross_assets" numeric(20, 2),
	"total_liabilities" numeric(20, 2),
	"net_assets" numeric(20, 2),
	"loan_interest" numeric(10, 4),
	"weighted_avg_lending_rate" numeric(10, 4),
	"status" text DEFAULT 'active' NOT NULL,
	"as_of_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"portfolio_id" integer NOT NULL,
	"custodian_id" integer NOT NULL,
	"security_id" integer NOT NULL,
	"quantity" numeric(20, 6) NOT NULL,
	"average_cost" numeric(20, 6),
	"cost_basis" numeric(20, 2),
	"current_price" numeric(20, 6),
	"market_value" numeric(20, 2),
	"unrealized_pnl" numeric(20, 2),
	"realized_pnl" numeric(20, 2),
	"allocation_percent" numeric(10, 4),
	"annual_cashflow" numeric(20, 2),
	"indicative_ltv" numeric(10, 4),
	"position_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_breaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"recon_run_id" integer NOT NULL,
	"portfolio_id" integer,
	"custodian_id" integer NOT NULL,
	"security_id" integer,
	"break_type" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"orca_quantity" numeric(20, 6),
	"orca_price" numeric(20, 6),
	"orca_value" numeric(20, 2),
	"custodian_quantity" numeric(20, 6),
	"custodian_price" numeric(20, 6),
	"custodian_value" numeric(20, 2),
	"quantity_difference" numeric(20, 6),
	"value_difference" numeric(20, 2),
	"difference_percent" numeric(10, 4),
	"security_name" text,
	"ticker" text,
	"portfolio_name" text,
	"custodian_name" text,
	"status" text DEFAULT 'open' NOT NULL,
	"resolution_notes" text,
	"root_cause" text,
	"resolved_by_id" integer,
	"resolved_at" timestamp,
	"aging_days" integer DEFAULT 0,
	"break_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"custodian_id" integer NOT NULL,
	"run_date" date NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_positions" integer DEFAULT 0,
	"matched_positions" integer DEFAULT 0,
	"break_count" integer DEFAULT 0,
	"cash_break_count" integer DEFAULT 0,
	"tolerance_breach_count" integer DEFAULT 0,
	"run_duration_ms" integer,
	"notes" text,
	"run_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risk_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"assessment_type" text NOT NULL,
	"assessment_date" date NOT NULL,
	"country_risk" integer,
	"occupation_risk" integer,
	"product_risk" integer,
	"channel_risk" integer,
	"pep_risk" integer,
	"source_of_wealth_risk" integer,
	"transaction_pattern_risk" integer,
	"total_risk_score" integer,
	"risk_band" text,
	"assessed_by" integer,
	"assessment_notes" text,
	"override_reason" text,
	"approved_by" integer,
	"approved_at" timestamp,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rm_kyc_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"relationship_manager_id" integer NOT NULL,
	"note_type" text NOT NULL,
	"note_date" date NOT NULL,
	"client_background" text,
	"relationship_with_rm" text,
	"relationship_with_firm" text,
	"contact_initiation_details" text,
	"source_of_wealth_narrative" text,
	"source_of_funds_narrative" text,
	"investment_knowledge_assessment" text,
	"current_professional_activities" text,
	"other_relevant_information" text,
	"signature" text,
	"signed_at" timestamp,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "securities_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"firm_id" integer NOT NULL,
	"ticker" text,
	"isin" text,
	"cusip" text,
	"sedol" text,
	"bloomberg_id" text,
	"reuters_ric" text,
	"security_name" text NOT NULL,
	"asset_class" text NOT NULL,
	"security_type" text,
	"product_category" text,
	"issuer_name" text,
	"issuer_country" text,
	"issuer_sector" text,
	"currency" text DEFAULT 'USD' NOT NULL,
	"exchange" text,
	"country" text,
	"maturity_date" date,
	"coupon_rate" numeric(10, 4),
	"yield_to_maturity" numeric(10, 4),
	"duration" numeric(10, 2),
	"credit_rating" text,
	"prr" integer,
	"beta" numeric(10, 4),
	"last_price" numeric(20, 6),
	"price_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "securities_master_isin_unique" UNIQUE("isin")
);
--> statement-breakpoint
CREATE TABLE "suitability_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"assessment_date" date NOT NULL,
	"investment_objective" text,
	"product_knowledge" jsonb DEFAULT '[]'::jsonb,
	"investment_time_horizon" text,
	"time_horizon_score" integer,
	"reliance_on_assets" integer,
	"market_decline_response" integer,
	"portfolio_decline_tolerance" integer,
	"percentage_of_net_worth" integer,
	"total_score" integer,
	"suitability_rating" text,
	"assessed_by" integer,
	"approved_by" integer,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"review_period_start" date NOT NULL,
	"review_period_end" date NOT NULL,
	"review_type" text NOT NULL,
	"trigger_reason" text,
	"credit_transactions" jsonb,
	"debit_transactions" jsonb,
	"unusual_activity_detected" boolean DEFAULT false,
	"unusual_activity_details" text,
	"supporting_documents_reviewed" boolean DEFAULT false,
	"large_transactions_justified" boolean DEFAULT false,
	"observations" text,
	"action_taken" text,
	"recommendations" text,
	"prepared_by" integer,
	"reviewed_by_compliance" integer,
	"review_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wealth_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"firm_id" integer NOT NULL,
	"source_of_wealth_narrative" text,
	"source_of_funds_narrative" text,
	"total_net_worth" numeric(15, 2),
	"liquid_assets" numeric(15, 2),
	"illiquid_assets" numeric(15, 2),
	"liabilities" numeric(15, 2),
	"annual_income" numeric(15, 2),
	"income_source" text,
	"asset_breakdown" jsonb,
	"wealth_verification_status" text DEFAULT 'pending',
	"verification_percentage" integer DEFAULT 0,
	"verified_by" integer,
	"verified_at" timestamp,
	"verification_notes" text,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "client_category" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "place_of_birth" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "residential_address" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "tax_residencies" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "is_us_person" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "us_tin" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "current_occupation" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "employer" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "sector" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "is_pep" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "pep_details" jsonb;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "risk_band" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "assigned_user_id" integer;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "relationship_start_date" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "last_review_date" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "next_review_date" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "enhanced_due_diligence" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "company_registration_number" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "date_of_incorporation" date;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "country_of_incorporation" text;--> statement-breakpoint
ALTER TABLE "beneficial_ownership" ADD CONSTRAINT "beneficial_ownership_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beneficial_ownership" ADD CONSTRAINT "beneficial_ownership_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_call_allocations" ADD CONSTRAINT "capital_call_allocations_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_call_allocations" ADD CONSTRAINT "capital_call_allocations_capital_call_id_capital_calls_id_fk" FOREIGN KEY ("capital_call_id") REFERENCES "public"."capital_calls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_call_allocations" ADD CONSTRAINT "capital_call_allocations_lp_commitment_id_lp_commitments_id_fk" FOREIGN KEY ("lp_commitment_id") REFERENCES "public"."lp_commitments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_calls" ADD CONSTRAINT "capital_calls_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_calls" ADD CONSTRAINT "capital_calls_fund_id_fund_structures_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_distributions" ADD CONSTRAINT "capital_distributions_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_distributions" ADD CONSTRAINT "capital_distributions_fund_id_fund_structures_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_approvals" ADD CONSTRAINT "client_approvals_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_approvals" ADD CONSTRAINT "client_approvals_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_approvals" ADD CONSTRAINT "client_approvals_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_classification" ADD CONSTRAINT "client_classification_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_classification" ADD CONSTRAINT "client_classification_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_classification" ADD CONSTRAINT "client_classification_classified_by_users_id_fk" FOREIGN KEY ("classified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_classification" ADD CONSTRAINT "client_classification_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custodians" ADD CONSTRAINT "custodians_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund_structures" ADD CONSTRAINT "fund_structures_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lp_commitments" ADD CONSTRAINT "lp_commitments_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lp_commitments" ADD CONSTRAINT "lp_commitments_fund_id_fund_structures_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lp_commitments" ADD CONSTRAINT "lp_commitments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_records" ADD CONSTRAINT "nav_records_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_records" ADD CONSTRAINT "nav_records_fund_id_fund_structures_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_records" ADD CONSTRAINT "nav_records_confirmed_by_users_id_fk" FOREIGN KEY ("confirmed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_custodian_id_custodians_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."custodians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_security_id_securities_master_id_fk" FOREIGN KEY ("security_id") REFERENCES "public"."securities_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_recon_run_id_recon_runs_id_fk" FOREIGN KEY ("recon_run_id") REFERENCES "public"."recon_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_custodian_id_custodians_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."custodians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_security_id_securities_master_id_fk" FOREIGN KEY ("security_id") REFERENCES "public"."securities_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_breaks" ADD CONSTRAINT "recon_breaks_resolved_by_id_users_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_custodian_id_custodians_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."custodians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_run_by_users_id_fk" FOREIGN KEY ("run_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_assessed_by_users_id_fk" FOREIGN KEY ("assessed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rm_kyc_notes" ADD CONSTRAINT "rm_kyc_notes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rm_kyc_notes" ADD CONSTRAINT "rm_kyc_notes_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rm_kyc_notes" ADD CONSTRAINT "rm_kyc_notes_relationship_manager_id_users_id_fk" FOREIGN KEY ("relationship_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "securities_master" ADD CONSTRAINT "securities_master_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suitability_assessments" ADD CONSTRAINT "suitability_assessments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suitability_assessments" ADD CONSTRAINT "suitability_assessments_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suitability_assessments" ADD CONSTRAINT "suitability_assessments_assessed_by_users_id_fk" FOREIGN KEY ("assessed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suitability_assessments" ADD CONSTRAINT "suitability_assessments_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_monitoring" ADD CONSTRAINT "transaction_monitoring_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_monitoring" ADD CONSTRAINT "transaction_monitoring_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_monitoring" ADD CONSTRAINT "transaction_monitoring_prepared_by_users_id_fk" FOREIGN KEY ("prepared_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_monitoring" ADD CONSTRAINT "transaction_monitoring_reviewed_by_compliance_users_id_fk" FOREIGN KEY ("reviewed_by_compliance") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wealth_information" ADD CONSTRAINT "wealth_information_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wealth_information" ADD CONSTRAINT "wealth_information_firm_id_firms_id_fk" FOREIGN KEY ("firm_id") REFERENCES "public"."firms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wealth_information" ADD CONSTRAINT "wealth_information_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;