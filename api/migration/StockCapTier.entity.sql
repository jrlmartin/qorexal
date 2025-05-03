/* ============================================================
   1.  Enum: market_cap_tier  (SMALL | MID | LARGE)
   ============================================================ */
   DO $$
   BEGIN
     IF NOT EXISTS (
           SELECT 1 FROM pg_type WHERE typname = 'market_cap_tier'
        ) THEN
       CREATE TYPE market_cap_tier AS ENUM ('SMALL', 'MID', 'LARGE');
     END IF;
   END$$;
   
   
   /* ============================================================
      2.  Table: public.stock_cap_tiers
      ============================================================ */
   CREATE TABLE IF NOT EXISTS public.stock_cap_tiers
   (
       id               SERIAL PRIMARY KEY,
   
       ticker           VARCHAR(10)   NOT NULL,
       company_name     VARCHAR(255)  NOT NULL,
   
       market_cap_usd   NUMERIC(20,2) NOT NULL
                      CHECK (market_cap_usd >= 0),
   
       /* ---------------------------------------------------------
          cap_tier is derived automatically (Postgres ≥ 12)
          --------------------------------------------------------- */
       cap_tier         market_cap_tier
                        GENERATED ALWAYS AS (
                          CASE
                            WHEN market_cap_usd < 2000000000  THEN 'SMALL'::market_cap_tier
                            WHEN market_cap_usd < 10000000000 THEN 'MID'::market_cap_tier
                            ELSE                               'LARGE'::market_cap_tier
                          END
                        ) STORED,
   
       as_of_date       DATE          NOT NULL DEFAULT CURRENT_DATE,
   
       created_ts       TIMESTAMP     NOT NULL DEFAULT NOW(),
       updated_ts       TIMESTAMP     NOT NULL DEFAULT NOW(),
       deleted_ts       TIMESTAMP                     -- nullable for soft-delete
   );
   
   
   /* ============================================================
      3.  Indexes
      ============================================================ */
   CREATE INDEX IF NOT EXISTS idx_stock_cap_tiers_ticker  ON public.stock_cap_tiers (ticker);
   CREATE INDEX IF NOT EXISTS idx_stock_cap_tier          ON public.stock_cap_tiers (cap_tier);
   
   
   /* ============================================================
      4.  Trigger: keep updated_ts fresh on any UPDATE
      ============================================================ */
   CREATE OR REPLACE FUNCTION public.set_updated_ts() RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_ts := NOW();
     RETURN NEW;
   END
   $$ LANGUAGE plpgsql;
   
   DROP TRIGGER IF EXISTS trg_set_updated_ts ON public.stock_cap_tiers;
   
   CREATE TRIGGER trg_set_updated_ts
   BEFORE UPDATE ON public.stock_cap_tiers
   FOR EACH ROW EXECUTE FUNCTION public.set_updated_ts();
   
   
   /* ============================================================
      5.  (Optional) Un-comment to prevent duplicates per day
      ------------------------------------------------------------
      ALTER TABLE public.stock_cap_tiers
        ADD CONSTRAINT uq_ticker_date UNIQUE (ticker, as_of_date);
      ============================================================ */