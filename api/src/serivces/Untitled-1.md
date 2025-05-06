 
```json
{
  "Meta Data": {
    "intraday": {
      "1. Information": "Intraday (5min) open, high, low, close prices and volume - DATA DELAYED BY 15 MINUTES",
      "2. Symbol": "duol",
      "3. Last Refreshed": "2025-05-05 14:10:00",
      "4. Interval": "5min",
      "5. Output Size": "Compact",
      "6. Time Zone": "US/Eastern"
    },
    "RSI": {
      "1: Symbol": "duol",
      "2: Indicator": "Relative Strength Index (RSI) - DATA DELAYED BY 15 MINUTES",
      "3: Last Refreshed": "2025-05-05 14:10:00",
      "4: Interval": "5min",
      "5: Time Period": 14,
      "6: Series Type": "close",
      "7: Time Zone": "US/Eastern Time"
    }
  },
  "Time Series (5min)": {
    "2025-05-05 14:10:00": {
      "intraday": {
        "1. open": "498.9850",
        "2. high": "499.6200",
        "3. low": "498.9850",
        "4. close": "498.9850",
        "5. volume": "1670"   
      },
      "RSI": {
          "RSI": "47.7223"
      },
      MACD
      ...
       "2025-05-05 14:05": {

       }
    ....
    },


  }
}
```

### Intraday Time Series (5-min)
## Intraday Time Series

```json
{
  "Meta Data": {
    "1. Information": "Intraday (5min) open, high, low, close prices and volume",
    "2. Symbol": "nvda",
    "3. Last Refreshed": "2025-05-02 19:55:00",
    "4. Interval": "5min",
    "5. Output Size": "Compact",
    "6. Time Zone": "US/Eastern"
  },
  "Time Series (5min)": {
  "2025-05-05 14:10": {
      "1. open": "114.2099",
      "2. high": "114.2400",
      "3. low": "114.1400",
      "4. close": "114.2000",
      "5. volume": "55472"
    },
      "2025-05-05 14:05": {
      "1. open": "114.2300",
      "2. high": "114.2500",
      "3. low": "114.2000",
      "4. close": "114.2000",
      "5. volume": "24987"
    }
  }
}
```



## Technical Indicators

### RSI (Relative Strength Index)
## RSI Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Relative Strength Index (RSI) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 14,
    "6: Series Type": "close",
    "7: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: RSI": {
    "2025-05-05 14:10": {
      "RSI": "48.1963"
    },
   "2025-05-05 14:05": {
      "RSI": "47.7223"
    }
  }
}
```



### MACD (Moving Average Convergence Divergence)
## MACD Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Moving Average Convergence/Divergence (MACD) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5.1: Fast Period": 12,
    "5.2: Slow Period": 26,
    "5.3: Signal Period": 9,
    "6: Series Type": "close",
    "7: Time Zone": "US/Eastern"
  },
  "Technical Analysis: MACD": {
    "2025-05-05 14:10": {
      "MACD": "0.7655",
      "MACD_Signal": "1.2124",
      "MACD_Hist": "-0.4470"
    },
    "2025-05-05 14:05": {
      "MACD": "0.9640",
      "MACD_Signal": "1.3242",
      "MACD_Hist": "-0.3601"
    }
  }
}
```



### OBV (On-Balance Volume)
## OBV Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "On Balance Volume (OBV) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: OBV": {
    "2025-05-05 14:10": {
      "OBV": "961221.0000"
    },
    "2025-05-05 14:05": {
      "OBV": "959551.0000"
    }
  }
}
```



### EMA (Exponential Moving Average)
## EMA Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Exponential Moving Average (EMA) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 20,
    "6: Series Type": "close",
    "7: Time Zone": "US/Eastern"
  },
  "Technical Analysis: EMA": {
    "2025-05-05 14:10": {
      "EMA": "500.0124"
    },
    "2025-05-05 14:05": {
      "EMA": "500.1205"
    }
  }
}
```



### Bollinger Bands
## BBANDS Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Bollinger Bands (BBANDS) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 20,
    "6.1: Deviation multiplier for upper band": 2,
    "6.2: Deviation multiplier for lower band": 2,
    "6.3: MA Type": 0,
    "7: Series Type": "close",
    "8: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: BBANDS": {
    "2025-05-05 14:10": {
      "Real Upper Band": "502.5810",
      "Real Middle Band": "500.7377",
      "Real Lower Band": "498.8944"
    },
    "2025-05-05 14:05": {
      "Real Upper Band": "502.5992",
      "Real Middle Band": "500.7315",
      "Real Lower Band": "498.8637"
    }
  }
}
```



### Stochastic Oscillator
## STOCH Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Stochastic (STOCH) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5.1: FastK Period": 14,
    "5.2: SlowK Period": 3,
    "5.3: SlowK MA Type": 0,
    "5.4: SlowD Period": 3,
    "5.5: SlowD MA Type": 0,
    "6: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: STOCH": {
    "2025-05-05 14:10": {
      "SlowK": "26.2472",
      "SlowD": "43.0489"
    },
    "2025-05-05 14:05": {
      "SlowK": "39.5037",
      "SlowD": "56.1132"
    }
  }
}
```



### ADX (Average Directional Index)
## ADX Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Average Directional Movement Index (ADX) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 14,
    "6: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: ADX": {
    "2025-05-05 14:10": {
      "ADX": "17.1118"
    },
    "2025-05-05 14:05": {
      "ADX": "17.7754"
    }
  }
}
```



### ATR (Average True Range)
## ATR Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Average True Range (ATR) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 14,
    "6: Time Zone": "US/Eastern Time"
  },
  "Technical Analysis: ATR": {
    "2025-05-05 14:10": {
      "ATR": "2.0240"
    },
    "2025-05-05 14:05": {
      "ATR": "2.1204"
    }
  }
}
```



### SMA (Simple Moving Average)
## SMA Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Simple Moving Average (SMA) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Period": 14,
    "6: Series Type": "close",
    "7: Time Zone": "US/Eastern"
  },
  "Technical Analysis: SMA": {
    "2025-05-05 14:10": {
      "SMA": "500.7380"
    },
    "2025-05-05 14:05": {
      "SMA": "500.8361"
    }
  }
}
```



### VWAP (Volume Weighted Average Price)
## VWAP Technical Indicator

- **Elements Shown**: 2

```json
{
  "Meta Data": {
    "1: Symbol": "duol",
    "2: Indicator": "Volume Weighted Average Price (VWAP) - DATA DELAYED BY 15 MINUTES",
    "3: Last Refreshed": "2025-05-05 14:10:00",
    "4: Interval": "5min",
    "5: Time Zone": "US/Eastern"
  },
  "Technical Analysis: VWAP": {
    "2025-05-05 14:10": {
      "VWAP": "496.6045"
    },
    "2025-05-05 14:05": {
      "VWAP": "496.6001"
    }
  }
}
```



</company>
 
# News
<news>
    
<news-article>
## Article ID: 45114080
## Stocks: DUOL
## Published (UTC): Wed, 30 Apr 2025 15:02:07 -0400
## Title: Duolingo Launches Its Biggest Expansion Yet With 148 New Courses
## URL: https://www.benzinga.com/tech/25/04/45114080/duolingo-launches-its-biggest-expansion-yet-with-148-new-courses
## Tags: AI Generated, Briefs, Stories That Matter
## Channels: News, Top Stories, Tech, General
## Content: Mobile learning platform **Duolingo Inc.** (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) has [introduced its most extensive](https://www.benzinga.com/pressreleases/25/04/g45093631/duolingo-launches-148-new-language-courses-expands-access-to-popular-languages-including-japanese-) course expansion to date, launching 148 new language programs on its platform.

This substantial growth more than doubles its existing offerings. The launch makes Duolingo's top seven non-English languages, Spanish, French, German, Italian, Japanese, Korean, and Mandarin accessible across all 28 of its supported interface languages.

In the past, developing a single language course on Duolingo could take several years. But with the help of generative AI, enhanced internal tools, and a new shared content system, the company has shortened that process, rolling out its newest set of courses in less than a year.

**Also Read: _[Marriott Bets $355M On Trendy CitizenM Hotels To Woo Modern Travelers](https://www.benzinga.com/news/25/04/45040811/marriott-bets-355m-on-trendy-citizenm-hotels-to-woo-modern-travelers)_**

"Developing our first 100 courses took about 12 years, and now, in about a year, we're able to create and launch nearly 150 new courses. This is a great example of how generative AI can directly benefit our learners," said CEO and co-founder **Luis von Ahn**.

This shared content model enables the creation of a core course structure that can be quickly adapted for multiple languages.

The majority of the newly launched courses are designed for beginners, aligning with A1–A2 levels on the CEFR scale, and include interactive tools such as Stories and DuoRadio to help reading and listening comprehension.

Duolingo noted that higher-level content is expected to be added in the coming months.

The release is especially impactful in regions where access to non-English courses was previously limited. In Latin America, Spanish and Portuguese speakers now have access to Asian languages like Japanese, Mandarin, and Korean.

In Europe, learners speaking languages such as French, German, or Italian can also explore these new additions.

Meanwhile, in Asia, speakers of languages like Hindi, Thai, and Tamil can now learn any of the top seven languages, whereas previously, their options were largely restricted to English.

**Price Action**: DUOL shares traded higher by 0.35% at $386.48 at last check Wednesday.

**Read Next**:

*   **_[The Future of Flight? United Airlines Invests In Radical Jet Design](https://www.benzinga.com/news/25/04/45011895/the-future-of-flight-united-airlines-invests-in-radical-jet-design)_**

_Photo by DANIEL CONSTANTE via Shutterstock_
</news-article>


<news-article>
## Article ID: 45127274
## Stocks: AAMI, AAPL, ABNB, ACCO, ADPT, AEE, AGCO, AGIO, AIG, AIT, AJG, ALHC, ALKS, ALNY, ALSN, AME, AMGN, AMH, AMWL, AMZN, APD, APG, APLE, APTV, ARDX, ARVN, ARW, AS, ASND, ASPS, ASUR, ATEC, ATEN, ATI, ATR, AXTI, BAX, BBAI, BDC, BDX, BIIB, BIO, BJRI, BLDR, BMRN, BOOM, BPMC, BR, BRFH, BVN, BZH, CABO, CAH, CARR, CART, CCJ, CCO, CERS, CHD, CMLS, CNH, CNI, CNR, COHN, COHU, COLM, COMM, COOK, CPS, CPT, CRAI, CSR, CTO, CTRE, CUBE, CUZ, CVS, CWST, D, DBRG, DINO, DLB, DNB, DRH, DRS, DSGR, DTE, DUOL, DXCM, ECVT, ED, EDV, EEX, EGO, EIG, EL, ELD, ELME, EOG, ES, ESAB, EXAS, EXC, EXPO, FET, FIVN, FND, FOLD, FTCI, FTDR, FTV, FULC, GCI, GCL, GDDY, GDYN, GPK, GSIT, GTE, GTLS, GTX, GVA, GWW, H, HAYW, HGV, HII, HL, HOG, HOLX, HR, HSY, HTGC, HUBB, HUN, HWM, ICE, ICFI, IDA, IDCC, IDXX, IEX, IR, IRM, IRTC, ITRI, ITT, JHG, JNPR, K, KEX, KIM, KIRK, KKR, KURA, KWR, LAUR, LIN, LLY, LMAT, LOCO, LUMN, LVWR, LXP, LYG, LYV, MA, MCD, MDGL, MERC, MGPI, MHK, MPW, MPWR, MRNA, MSEX, MSI, MSTR, MTD, MTRN, MTZ, MYE, NNN, NPKI, NREF, NSIT, NVEE, NVRI, NVST, OCSL, OFS, OGN, OHI, OIS, OLED, OLN, ONEW, OSIS, OSPN, OWL, PATK, PBF, PCOR, PCTY, PEB, PH, PHAT, PLYM, PNW, PRDO, PRO, PSI, PWR, RBLX, RDDT, RGA, RHP, RIOT, RMAX, RMNI, ROKU, RRR, RYAN, SACH, SBFG, SEM, SHAK, SHC, SIRI, SKWD, SM, SMMT, SNDL, SO, SPXC, STNG, SVV, SW, SXI, SYK, TARS, TEAM, TFX, TGB, THRY, TKO, TREE, TRGP, TRI, TRN, TRP, TRUP, TVTX, TWLO, ULCC, UMH, UP, UPBD, UTZ, VEL, VIAV, VNT, W, WCC, WD, WK, WSC, X, XFOR, XRX, XYZ, ZETA, ZEUS
## Published (UTC): Thu, 01 May 2025 04:32:37 -0400
## Title: Earnings Scheduled For May 1, 2025
## URL: https://www.benzinga.com/insights/earnings/25/05/45127274/earnings-scheduled-for-may-1-2025
## Tags: BZI-UE, Earnings Scheduled
## Channels: Earnings
## Content: ### Companies Reporting Before The Bell

• Itron (NASDAQ:[ITRI](https://www.benzinga.com/stock/ITRI#NASDAQ)) is projected to report quarterly earnings at $1.32 per share on revenue of $614.45 million.

• InterDigital (NASDAQ:[IDCC](https://www.benzinga.com/stock/IDCC#NASDAQ)) is projected to report quarterly earnings at $2.56 per share on revenue of $194.62 million.

• NNN REIT (NYSE:[NNN](https://www.benzinga.com/stock/NNN#NYSE)) is projected to report quarterly earnings at $0.83 per share on revenue of $221.25 million.

• NexPoint Real Estate (NYSE:[NREF](https://www.benzinga.com/stock/NREF#NYSE)) is estimated to report quarterly earnings at $0.49 per share on revenue of $10.95 million.

• Medical Properties Trust (NYSE:[MPW](https://www.benzinga.com/stock/MPW#NYSE)) is projected to report quarterly earnings at $0.15 per share on revenue of $235.83 million.

• Patrick Industries (NASDAQ:[PATK](https://www.benzinga.com/stock/PATK#NASDAQ)) is estimated to report quarterly earnings at $0.96 per share on revenue of $960.79 million.

• Insight Enterprises (NASDAQ:[NSIT](https://www.benzinga.com/stock/NSIT#NASDAQ)) is likely to report quarterly earnings at $2.01 per share on revenue of $2.19 billion.

• Phathom Pharmaceuticals (NASDAQ:[PHAT](https://www.benzinga.com/stock/PHAT#NASDAQ)) is estimated to report quarterly loss at $1.07 per share on revenue of $29.02 million.

• Acadian Asset Management (NYSE:[AAMI](https://www.benzinga.com/stock/AAMI#NYSE)) is projected to report quarterly earnings at $0.49 per share on revenue of $113.30 million.

• Hilton Grand Vacations (NYSE:[HGV](https://www.benzinga.com/stock/HGV#NYSE)) is estimated to report quarterly earnings at $0.53 per share on revenue of $1.25 billion.

• Janus Henderson Group (NYSE:[JHG](https://www.benzinga.com/stock/JHG#NYSE)) is likely to report quarterly earnings at $0.72 per share on revenue of $614.87 million.

• Organon (NYSE:[OGN](https://www.benzinga.com/stock/OGN#NYSE)) is projected to report quarterly earnings at $0.89 per share on revenue of $1.51 billion.

• AGCO (NYSE:[AGCO](https://www.benzinga.com/stock/AGCO#NYSE)) is projected to report quarterly earnings at $0.04 per share on revenue of $2.05 billion.

• ATI (NYSE:[ATI](https://www.benzinga.com/stock/ATI#NYSE)) is likely to report quarterly earnings at $0.59 per share on revenue of $1.08 billion.

• Frontdoor (NASDAQ:[FTDR](https://www.benzinga.com/stock/FTDR#NASDAQ)) is projected to report quarterly earnings at $0.38 per share on revenue of $416.39 million.

• Compania De Minas (NYSE:[BVN](https://www.benzinga.com/stock/BVN#NYSE)) is expected to report quarterly earnings at $0.31 per share on revenue of $286.34 million.

• Vanguard Extended Duration Treasury ETF (NYSE:[EDV](https://www.benzinga.com/stock/EDV#NYSE)) is likely to report earnings for its first quarter.

• Laureate Education (NASDAQ:[LAUR](https://www.benzinga.com/stock/LAUR#NASDAQ)) is likely to report quarterly loss at $0.19 per share on revenue of $223.70 million.

• Huntington Ingalls Indus (NYSE:[HII](https://www.benzinga.com/stock/HII#NYSE)) is expected to report quarterly earnings at $2.81 per share on revenue of $2.79 billion.

• DigitalBridge Gr (NYSE:[DBRG](https://www.benzinga.com/stock/DBRG#NYSE)) is expected to report quarterly earnings at $0.08 per share on revenue of $104.74 million.

• Blueprint Medicines (NASDAQ:[BPMC](https://www.benzinga.com/stock/BPMC#NASDAQ)) is estimated to report quarterly loss at $0.44 per share on revenue of $156.89 million.

• Fulcrum Therapeutics (NASDAQ:[FULC](https://www.benzinga.com/stock/FULC#NASDAQ)) is expected to report earnings for its first quarter.

• Madrigal Pharmaceuticals (NASDAQ:[MDGL](https://www.benzinga.com/stock/MDGL#NASDAQ)) is expected to report quarterly loss at $3.79 per share on revenue of $114.19 million.

• OneWater Marine (NASDAQ:[ONEW](https://www.benzinga.com/stock/ONEW#NASDAQ)) is expected to report quarterly earnings at $0.34 per share on revenue of $496.04 million.

• Amicus Therapeutics (NASDAQ:[FOLD](https://www.benzinga.com/stock/FOLD#NASDAQ)) is likely to report quarterly earnings at $0.08 per share on revenue of $136.35 million.

• Kirby (NYSE:[KEX](https://www.benzinga.com/stock/KEX#NYSE)) is likely to report quarterly earnings at $1.28 per share on revenue of $816.01 million.

• Sachem Cap (AMEX:[SACH](https://www.benzinga.com/stock/SACH#AMEX)) is estimated to report quarterly earnings at $0.00 per share on revenue of $11.67 million.

• Alkermes (NASDAQ:[ALKS](https://www.benzinga.com/stock/ALKS#NASDAQ)) is estimated to report quarterly earnings at $0.24 per share on revenue of $304.11 million.

• Gannett Co (NYSE:[GCI](https://www.benzinga.com/stock/GCI#NYSE)) is expected to report quarterly loss at $0.03 per share on revenue of $593.10 million.

• Arvinas (NASDAQ:[ARVN](https://www.benzinga.com/stock/ARVN#NASDAQ)) is likely to report quarterly loss at $0.97 per share on revenue of $41.87 million.

• Shake Shack (NYSE:[SHAK](https://www.benzinga.com/stock/SHAK#NYSE)) is expected to report quarterly earnings at $0.16 per share on revenue of $327.57 million.

• Hayward Holdings (NYSE:[HAYW](https://www.benzinga.com/stock/HAYW#NYSE)) is expected to report quarterly earnings at $0.09 per share on revenue of $213.38 million.

• SNDL (NASDAQ:[SNDL](https://www.benzinga.com/stock/SNDL#NASDAQ)) is estimated to report quarterly loss at $0.06 per share on revenue of $149.92 million.

• Enviri (NYSE:[NVRI](https://www.benzinga.com/stock/NVRI#NYSE)) is estimated to report quarterly loss at $0.21 per share on revenue of $560.13 million.

• Wayfair (NYSE:[W](https://www.benzinga.com/stock/W#NYSE)) is estimated to report quarterly loss at $0.20 per share on revenue of $2.71 billion.

• Clear Channel Outdoor (NYSE:[CCO](https://www.benzinga.com/stock/CCO#NYSE)) is likely to report quarterly loss at $0.14 per share on revenue of $337.89 million.

• Trinity Indus (NYSE:[TRN](https://www.benzinga.com/stock/TRN#NYSE)) is projected to report quarterly earnings at $0.33 per share on revenue of $619.85 million.

• Harley-Davidson (NYSE:[HOG](https://www.benzinga.com/stock/HOG#NYSE)) is expected to report quarterly earnings at $0.80 per share on revenue of $1.12 billion.

• Scorpio Tankers (NYSE:[STNG](https://www.benzinga.com/stock/STNG#NYSE)) is estimated to report quarterly earnings at $0.74 per share on revenue of $200.30 million.

• Agios Pharmaceuticals (NASDAQ:[AGIO](https://www.benzinga.com/stock/AGIO#NASDAQ)) is likely to report quarterly loss at $1.76 per share on revenue of $9.68 million.

• FTC Solar (NASDAQ:[FTCI](https://www.benzinga.com/stock/FTCI#NASDAQ)) is expected to report quarterly loss at $0.76 per share on revenue of $18.83 million.

• Xerox Holdings (NASDAQ:[XRX](https://www.benzinga.com/stock/XRX#NASDAQ)) is projected to report quarterly loss at $0.03 per share on revenue of $1.52 billion.

• PBF Energy (NYSE:[PBF](https://www.benzinga.com/stock/PBF#NYSE)) is likely to report quarterly loss at $3.29 per share on revenue of $6.60 billion.

• Idacorp (NYSE:[IDA](https://www.benzinga.com/stock/IDA#NYSE)) is likely to report quarterly earnings at $1.05 per share on revenue of $410.49 million.

• Teleflex (NYSE:[TFX](https://www.benzinga.com/stock/TFX#NYSE)) is projected to report quarterly earnings at $2.88 per share on revenue of $699.37 million.

• ITT (NYSE:[ITT](https://www.benzinga.com/stock/ITT#NYSE)) is estimated to report quarterly earnings at $1.44 per share on revenue of $907.48 million.

• Vontier (NYSE:[VNT](https://www.benzinga.com/stock/VNT#NYSE)) is likely to report quarterly earnings at $0.72 per share on revenue of $720.90 million.

• ESAB (NYSE:[ESAB](https://www.benzinga.com/stock/ESAB#NYSE)) is expected to report quarterly earnings at $1.21 per share on revenue of $633.82 million.

• HF Sinclair (NYSE:[DINO](https://www.benzinga.com/stock/DINO#NYSE)) is expected to report quarterly loss at $0.41 per share on revenue of $6.79 billion.

• Graphic Packaging Holding (NYSE:[GPK](https://www.benzinga.com/stock/GPK#NYSE)) is likely to report quarterly earnings at $0.58 per share on revenue of $2.13 billion.

• Chart Industries (NYSE:[GTLS](https://www.benzinga.com/stock/GTLS#NYSE)) is likely to report quarterly earnings at $1.83 per share on revenue of $1.01 billion.

• Utz Brands (NYSE:[UTZ](https://www.benzinga.com/stock/UTZ#NYSE)) is likely to report quarterly earnings at $0.15 per share on revenue of $352.20 million.

• Emerald Holding (NYSE:[EEX](https://www.benzinga.com/stock/EEX#NYSE)) is expected to report quarterly earnings at $0.07 per share on revenue of $134.30 million.

• X4 Pharmaceuticals (NASDAQ:[XFOR](https://www.benzinga.com/stock/XFOR#NASDAQ)) is estimated to report quarterly loss at $3.75 per share on revenue of $7.03 million.

• Walker & Dunlop (NYSE:[WD](https://www.benzinga.com/stock/WD#NYSE)) is estimated to report quarterly earnings at $0.70 per share on revenue of $245.03 million.

• WESCO Intl (NYSE:[WCC](https://www.benzinga.com/stock/WCC#NYSE)) is likely to report quarterly earnings at $2.32 per share on revenue of $5.26 billion.

• LXP Industrial Tr (NYSE:[LXP](https://www.benzinga.com/stock/LXP#NYSE)) is estimated to report quarterly earnings at $0.16 per share on revenue of $85.33 million.

• Ecovyst (NYSE:[ECVT](https://www.benzinga.com/stock/ECVT#NYSE)) is expected to report quarterly loss at $0.03 per share on revenue of $168.38 million.

• Oaktree Specialty Lending (NASDAQ:[OCSL](https://www.benzinga.com/stock/OCSL#NASDAQ)) is expected to report quarterly earnings at $0.47 per share on revenue of $86.41 million.

• TC Energy (NYSE:[TRP](https://www.benzinga.com/stock/TRP#NYSE)) is projected to report quarterly earnings at $0.98 per share on revenue of $3.43 billion.

• Pinnacle West Capital (NYSE:[PNW](https://www.benzinga.com/stock/PNW#NYSE)) is projected to report quarterly earnings at $0.02 per share on revenue of $999.98 million.

• Kellanova (NYSE:[K](https://www.benzinga.com/stock/K#NYSE)) is projected to report quarterly earnings at $1.01 per share on revenue of $3.17 billion.

• Mastercard (NYSE:[MA](https://www.benzinga.com/stock/MA#NYSE)) is likely to report quarterly earnings at $3.57 per share on revenue of $7.11 billion.

• Alnylam Pharmaceuticals (NASDAQ:[ALNY](https://www.benzinga.com/stock/ALNY#NASDAQ)) is estimated to report quarterly loss at $1.03 per share on revenue of $585.82 million.

• IDEX (NYSE:[IEX](https://www.benzinga.com/stock/IEX#NYSE)) is estimated to report quarterly earnings at $1.63 per share on revenue of $807.18 million.

• Lloyds Banking Group (NYSE:[LYG](https://www.benzinga.com/stock/LYG#NYSE)) is expected to report quarterly earnings at $0.08 per share on revenue of $4.60 billion.

• Roblox (NYSE:[RBLX](https://www.benzinga.com/stock/RBLX#NYSE)) is likely to report quarterly loss at $0.40 per share on revenue of $1.14 billion.

• Southern (NYSE:[SO](https://www.benzinga.com/stock/SO#NYSE)) is expected to report quarterly earnings at $1.20 per share on revenue of $7.16 billion.

• Dominion Energy (NYSE:[D](https://www.benzinga.com/stock/D#NYSE)) is expected to report quarterly earnings at $0.75 per share on revenue of $3.97 billion.

• Intercontinental Exchange (NYSE:[ICE](https://www.benzinga.com/stock/ICE#NYSE)) is projected to report quarterly earnings at $1.70 per share on revenue of $2.46 billion.

• Hubbell (NYSE:[HUBB](https://www.benzinga.com/stock/HUBB#NYSE)) is likely to report quarterly earnings at $3.73 per share on revenue of $1.39 billion.

• Biogen (NASDAQ:[BIIB](https://www.benzinga.com/stock/BIIB#NASDAQ)) is likely to report quarterly earnings at $2.52 per share on revenue of $2.23 billion.

• Broadridge Financial Soln (NYSE:[BR](https://www.benzinga.com/stock/BR#NYSE)) is likely to report quarterly earnings at $2.43 per share on revenue of $1.86 billion.

• Blue Owl Capital (NYSE:[OWL](https://www.benzinga.com/stock/OWL#NYSE)) is estimated to report quarterly earnings at $0.19 per share on revenue of $632.32 million.

• DTE Energy (NYSE:[DTE](https://www.benzinga.com/stock/DTE#NYSE)) is likely to report quarterly earnings at $2.00 per share on revenue of $3.43 billion.

• McDonald's (NYSE:[MCD](https://www.benzinga.com/stock/MCD#NYSE)) is likely to report quarterly earnings at $2.66 per share on revenue of $6.09 billion.

• Builders FirstSource (NYSE:[BLDR](https://www.benzinga.com/stock/BLDR#NYSE)) is likely to report quarterly earnings at $1.37 per share on revenue of $3.65 billion.

• Fortive (NYSE:[FTV](https://www.benzinga.com/stock/FTV#NYSE)) is expected to report quarterly earnings at $0.85 per share on revenue of $1.49 billion.

• Church & Dwight Co (NYSE:[CHD](https://www.benzinga.com/stock/CHD#NYSE)) is likely to report quarterly earnings at $0.90 per share on revenue of $1.51 billion.

• Hyatt Hotels (NYSE:[H](https://www.benzinga.com/stock/H#NYSE)) is projected to report quarterly earnings at $0.32 per share on revenue of $1.

• Quanta Services (NYSE:[PWR](https://www.benzinga.com/stock/PWR#NYSE)) is estimated to report quarterly earnings at $1.67 per share on revenue of $5.86 billion.

• KKR (NYSE:[KKR](https://www.benzinga.com/stock/KKR#NYSE)) is projected to report quarterly earnings at $1.15 per share on revenue of $1.74 billion.

• Exelon (NASDAQ:[EXC](https://www.benzinga.com/stock/EXC#NASDAQ)) is estimated to report quarterly earnings at $0.88 per share on revenue of $6.58 billion.

• Kimco Realty (NYSE:[KIM](https://www.benzinga.com/stock/KIM#NYSE)) is projected to report quarterly earnings at $0.42 per share on revenue of $528.86 million.

• Eli Lilly (NYSE:[LLY](https://www.benzinga.com/stock/LLY#NYSE)) is projected to report quarterly earnings at $3.02 per share on revenue of $12.66 billion.

• Aptiv (NYSE:[APTV](https://www.benzinga.com/stock/APTV#NYSE)) is projected to report quarterly earnings at $1.65 per share on revenue of $5.04 billion.

• Cardinal Health (NYSE:[CAH](https://www.benzinga.com/stock/CAH#NYSE)) is estimated to report quarterly earnings at $2.17 per share on revenue of $55.35 billion.

• Cameco (NYSE:[CCJ](https://www.benzinga.com/stock/CCJ#NYSE)) is likely to report quarterly earnings at $0.19 per share on revenue of $806.82 million.

• CNH Industrial (NYSE:[CNH](https://www.benzinga.com/stock/CNH#NYSE)) is estimated to report quarterly earnings at $0.10 per share on revenue of $3.50 billion.

• Thomson Reuters (NASDAQ:[TRI](https://www.benzinga.com/stock/TRI#NASDAQ)) is likely to report quarterly earnings at $0.87 per share on revenue of $1.80 billion.

• IDEXX Laboratories (NASDAQ:[IDXX](https://www.benzinga.com/stock/IDXX#NASDAQ)) is likely to report quarterly earnings at $2.85 per share on revenue of $998.15 million.

• CVS Health (NYSE:[CVS](https://www.benzinga.com/stock/CVS#NYSE)) is estimated to report quarterly earnings at $1.70 per share on revenue of $93.63 billion.

• Smurfit WestRock (NYSE:[SW](https://www.benzinga.com/stock/SW#NYSE)) is expected to report quarterly earnings at $0.69 per share on revenue of $7.77 billion.

• Linde (NASDAQ:[LIN](https://www.benzinga.com/stock/LIN#NASDAQ)) is likely to report quarterly earnings at $4.09 per share on revenue of $8.39 billion.

• Estee Lauder Cos (NYSE:[EL](https://www.benzinga.com/stock/EL#NYSE)) is projected to report quarterly earnings at $0.32 per share on revenue of $3.51 billion.

• Targa Resources (NYSE:[TRGP](https://www.benzinga.com/stock/TRGP#NYSE)) is expected to report quarterly earnings at $1.98 per share on revenue of $4.89 billion.

• Air Products & Chemicals (NYSE:[APD](https://www.benzinga.com/stock/APD#NYSE)) is expected to report quarterly earnings at $2.83 per share on revenue of $2.92 billion.

• Altisource Portfolio (NASDAQ:[ASPS](https://www.benzinga.com/stock/ASPS#NASDAQ)) is expected to report earnings for its first quarter.

• Cohen & Co (AMEX:[COHN](https://www.benzinga.com/stock/COHN#AMEX)) is estimated to report earnings for its first quarter.

• Materion (NYSE:[MTRN](https://www.benzinga.com/stock/MTRN#NYSE)) is estimated to report quarterly earnings at $1.04 per share on revenue of $398.66 million.

• Moderna (NASDAQ:[MRNA](https://www.benzinga.com/stock/MRNA#NASDAQ)) is estimated to report quarterly loss at $3.18 per share on revenue of $115.32 million.

• MGP Ingredients (NASDAQ:[MGPI](https://www.benzinga.com/stock/MGPI#NASDAQ)) is likely to report quarterly earnings at $0.37 per share on revenue of $117.18 million.

• Wheels Up Experience (NYSE:[UP](https://www.benzinga.com/stock/UP#NYSE)) is expected to report earnings for its first quarter.

• Kirkland's (NASDAQ:[KIRK](https://www.benzinga.com/stock/KIRK#NASDAQ)) is projected to report quarterly earnings at $0.59 per share on revenue of $150.09 million.

• Carrier Global (NYSE:[CARR](https://www.benzinga.com/stock/CARR#NYSE)) is projected to report quarterly earnings at $0.58 per share on revenue of $5.18 billion.

• Oil States International (NYSE:[OIS](https://www.benzinga.com/stock/OIS#NYSE)) is estimated to report quarterly earnings at $0.04 per share on revenue of $164.08 million.

• Cumulus Media (NASDAQ:[CMLS](https://www.benzinga.com/stock/CMLS#NASDAQ)) is likely to report quarterly loss at $1.25 per share on revenue of $190.10 million.

• OSI Systems (NASDAQ:[OSIS](https://www.benzinga.com/stock/OSIS#NASDAQ)) is expected to report quarterly earnings at $2.40 per share on revenue of $436.49 million.

• AMETEK (NYSE:[AME](https://www.benzinga.com/stock/AME#NYSE)) is likely to report quarterly earnings at $1.69 per share on revenue of $1.74 billion.

• Iron Mountain (NYSE:[IRM](https://www.benzinga.com/stock/IRM#NYSE)) is projected to report quarterly earnings at $0.40 per share on revenue of $1.59 billion.

• Hershey (NYSE:[HSY](https://www.benzinga.com/stock/HSY#NYSE)) is estimated to report quarterly earnings at $1.95 per share on revenue of $2.80 billion.

• Becton Dickinson (NYSE:[BDX](https://www.benzinga.com/stock/BDX#NYSE)) is likely to report quarterly earnings at $3.28 per share on revenue of $5.35 billion.

• Baxter Intl (NYSE:[BAX](https://www.benzinga.com/stock/BAX#NYSE)) is projected to report quarterly earnings at $0.48 per share on revenue of $2.59 billion.

• Howmet Aerospace (NYSE:[HWM](https://www.benzinga.com/stock/HWM#NYSE)) is likely to report quarterly earnings at $0.78 per share on revenue of $1.94 billion.

• W.W. Grainger (NYSE:[GWW](https://www.benzinga.com/stock/GWW#NYSE)) is estimated to report quarterly earnings at $9.49 per share on revenue of $4.31 billion.

• Parker Hannifin (NYSE:[PH](https://www.benzinga.com/stock/PH#NYSE)) is expected to report quarterly earnings at $6.72 per share on revenue of $4.98 billion.

• APi Group (NYSE:[APG](https://www.benzinga.com/stock/APG#NYSE)) is estimated to report quarterly earnings at $0.36 per share on revenue of $1.66 billion.

• Granite Const (NYSE:[GVA](https://www.benzinga.com/stock/GVA#NYSE)) is estimated to report quarterly loss at $0.46 per share on revenue of $706.15 million.

• Sotera Health (NASDAQ:[SHC](https://www.benzinga.com/stock/SHC#NASDAQ)) is likely to report quarterly earnings at $0.12 per share on revenue of $245.79 million.

• Dun & Bradstreet Holdings (NYSE:[DNB](https://www.benzinga.com/stock/DNB#NYSE)) is projected to report quarterly earnings at $0.20 per share on revenue of $578.02 million.

• LiveWire Gr (NYSE:[LVWR](https://www.benzinga.com/stock/LVWR#NYSE)) is likely to report earnings for its first quarter.

• Arrow Electronics (NYSE:[ARW](https://www.benzinga.com/stock/ARW#NYSE)) is expected to report quarterly earnings at $1.43 per share on revenue of $6.32 billion.

• CRA Intl (NASDAQ:[CRAI](https://www.benzinga.com/stock/CRAI#NASDAQ)) is expected to report quarterly earnings at $1.95 per share on revenue of $176.63 million.

• Sirius XM Holdings (NASDAQ:[SIRI](https://www.benzinga.com/stock/SIRI#NASDAQ)) is likely to report quarterly earnings at $0.66 per share on revenue of $2.08 billion.

• Garrett Motion (NASDAQ:[GTX](https://www.benzinga.com/stock/GTX#NASDAQ)) is estimated to report quarterly earnings at $0.29 per share on revenue of $838.00 million.

• Distribution Solns Gr (NASDAQ:[DSGR](https://www.benzinga.com/stock/DSGR#NASDAQ)) is projected to report quarterly earnings at $0.35 per share on revenue of $497.17 million.

• Leonardo DRS (NASDAQ:[DRS](https://www.benzinga.com/stock/DRS#NASDAQ)) is projected to report quarterly earnings at $0.17 per share on revenue of $736.72 million.

• Myers Indus (NYSE:[MYE](https://www.benzinga.com/stock/MYE#NYSE)) is projected to report quarterly earnings at $0.19 per share on revenue of $206.80 million.

• Belden (NYSE:[BDC](https://www.benzinga.com/stock/BDC#NYSE)) is expected to report quarterly earnings at $1.49 per share on revenue of $616.14 million.

• Applied Industrial Techs (NYSE:[AIT](https://www.benzinga.com/stock/AIT#NYSE)) is projected to report quarterly earnings at $2.41 per share on revenue of $1.17 billion.

• Upbound Group (NASDAQ:[UPBD](https://www.benzinga.com/stock/UPBD#NASDAQ)) is estimated to report quarterly earnings at $0.95 per share on revenue of $1.13 billion.

• CommScope Holding Co (NASDAQ:[COMM](https://www.benzinga.com/stock/COMM#NASDAQ)) is projected to report quarterly earnings at $0.07 per share on revenue of $1.11 billion.

• Thryv Holdings (NASDAQ:[THRY](https://www.benzinga.com/stock/THRY#NASDAQ)) is likely to report quarterly earnings at $0.01 per share on revenue of $173.83 million.

### Companies Reporting After The Bell

• Taseko Mines (AMEX:[TGB](https://www.benzinga.com/stock/TGB#AMEX)) is expected to report earnings for its first quarter.

• TKO Group Holdings (NYSE:[TKO](https://www.benzinga.com/stock/TKO#NYSE)) is expected to report earnings for its first quarter.

• GCL Global Holdings (NASDAQ:[GCL](https://www.benzinga.com/stock/GCL#NASDAQ)) is expected to report earnings for its first quarter.

• Tarsus Pharmaceuticals (NASDAQ:[TARS](https://www.benzinga.com/stock/TARS#NASDAQ)) is likely to report quarterly loss at $0.73 per share on revenue of $62.91 million.

• Amer Sports (NYSE:[AS](https://www.benzinga.com/stock/AS#NYSE)) is estimated to report quarterly earnings at $0.15 per share on revenue of $1.38 billion.

• Standex International (NYSE:[SXI](https://www.benzinga.com/stock/SXI#NYSE)) is expected to report quarterly earnings at $2.00 per share on revenue of $214.88 million.

• Gran Tierra Energy (AMEX:[GTE](https://www.benzinga.com/stock/GTE#AMEX)) is expected to report earnings for its first quarter.

• Travere Therapeutics (NASDAQ:[TVTX](https://www.benzinga.com/stock/TVTX#NASDAQ)) is expected to report quarterly loss at $0.36 per share on revenue of $77.50 million.

• Ascendis Pharma (NASDAQ:[ASND](https://www.benzinga.com/stock/ASND#NASDAQ)) is projected to report quarterly loss at $1.51 per share on revenue of $93.49 million.

• LendingTree (NASDAQ:[TREE](https://www.benzinga.com/stock/TREE#NASDAQ)) is estimated to report quarterly earnings at $0.65 per share on revenue of $244.93 million.

• Summit Therapeutics (NASDAQ:[SMMT](https://www.benzinga.com/stock/SMMT#NASDAQ)) is expected to report earnings for its first quarter.

• MasTec (NYSE:[MTZ](https://www.benzinga.com/stock/MTZ#NYSE)) is estimated to report quarterly earnings at $0.34 per share on revenue of $2.71 billion.

• Mettler-Toledo Intl (NYSE:[MTD](https://www.benzinga.com/stock/MTD#NYSE)) is likely to report quarterly earnings at $7.89 per share on revenue of $875.84 million.

• Strategy (NASDAQ:[MSTR](https://www.benzinga.com/stock/MSTR#NASDAQ)) is projected to report quarterly loss at $0.02 per share on revenue of $116.66 million.

• Motorola Solutions (NYSE:[MSI](https://www.benzinga.com/stock/MSI#NYSE)) is expected to report quarterly earnings at $3.01 per share on revenue of $2.52 billion.

• Monolithic Power Systems (NASDAQ:[MPWR](https://www.benzinga.com/stock/MPWR#NASDAQ)) is estimated to report quarterly earnings at $4.00 per share on revenue of $633.43 million.

• Mohawk Industries (NYSE:[MHK](https://www.benzinga.com/stock/MHK#NYSE)) is expected to report quarterly earnings at $1.41 per share on revenue of $2.56 billion.

• Mercer Intl (NASDAQ:[MERC](https://www.benzinga.com/stock/MERC#NASDAQ)) is projected to report quarterly loss at $0.19 per share on revenue of $505.47 million.

• Kura Oncology (NASDAQ:[KURA](https://www.benzinga.com/stock/KURA#NASDAQ)) is likely to report quarterly loss at $0.60 per share on revenue of $39.08 million.

• Hecla Mining (NYSE:[HL](https://www.benzinga.com/stock/HL#NYSE)) is projected to report quarterly earnings at $0.08 per share on revenue of $238.50 million.

• Live Nation Entertainment (NYSE:[LYV](https://www.benzinga.com/stock/LYV#NYSE)) is estimated to report quarterly loss at $0.01 per share on revenue of $3.54 billion.

• OFS Capital (NASDAQ:[OFS](https://www.benzinga.com/stock/OFS#NASDAQ)) is estimated to report quarterly earnings at $0.33 per share on revenue of $11.90 million.

• CareTrust REIT (NYSE:[CTRE](https://www.benzinga.com/stock/CTRE#NYSE)) is expected to report quarterly earnings at $0.43 per share on revenue of $98.85 million.

• SPX Technologies (NYSE:[SPXC](https://www.benzinga.com/stock/SPXC#NYSE)) is projected to report quarterly earnings at $1.17 per share on revenue of $481.18 million.

• Lumen Technologies (NYSE:[LUMN](https://www.benzinga.com/stock/LUMN#NYSE)) is estimated to report quarterly loss at $0.27 per share on revenue of $3.12 billion.

• LeMaitre Vascular (NASDAQ:[LMAT](https://www.benzinga.com/stock/LMAT#NASDAQ)) is expected to report quarterly earnings at $0.50 per share on revenue of $57.61 million.

• Ryman Hospitality Props (NYSE:[RHP](https://www.benzinga.com/stock/RHP#NYSE)) is estimated to report quarterly earnings at $1.77 per share on revenue of $548.10 million.

• Select Medical Hldgs (NYSE:[SEM](https://www.benzinga.com/stock/SEM#NYSE)) is projected to report quarterly earnings at $0.45 per share on revenue of $1.40 billion.

• Eldorado Gold (NYSE:[EGO](https://www.benzinga.com/stock/EGO#NYSE)) is projected to report quarterly earnings at $0.48 per share on revenue of $343.28 million.

• Bio-Rad Laboratories (NYSE:[BIO](https://www.benzinga.com/stock/BIO#NYSE)) is projected to report quarterly earnings at $1.79 per share on revenue of $573.01 million.

• American Well (NYSE:[AMWL](https://www.benzinga.com/stock/AMWL#NYSE)) is projected to report quarterly loss at $1.88 per share on revenue of $74.31 million.

• RE/MAX Holdings (NYSE:[RMAX](https://www.benzinga.com/stock/RMAX#NYSE)) is projected to report quarterly earnings at $0.17 per share on revenue of $74.23 million.

• Cooper-Standard Holdings (NYSE:[CPS](https://www.benzinga.com/stock/CPS#NYSE)) is estimated to report quarterly loss at $0.93 per share on revenue of $670.00 million.

• Traeger (NYSE:[COOK](https://www.benzinga.com/stock/COOK#NYSE)) is likely to report quarterly earnings at $0.04 per share on revenue of $140.39 million.

• Cerus (NASDAQ:[CERS](https://www.benzinga.com/stock/CERS#NASDAQ)) is projected to report quarterly loss at $0.05 per share on revenue of $47.44 million.

• El Pollo Loco Holdings (NASDAQ:[LOCO](https://www.benzinga.com/stock/LOCO#NASDAQ)) is estimated to report quarterly earnings at $0.21 per share on revenue of $117.26 million.

• Red Rock Resorts (NASDAQ:[RRR](https://www.benzinga.com/stock/RRR#NASDAQ)) is projected to report quarterly earnings at $0.50 per share on revenue of $499.12 million.

• AXT (NASDAQ:[AXTI](https://www.benzinga.com/stock/AXTI#NASDAQ)) is likely to report quarterly loss at $0.14 per share on revenue of $18.98 million.

• Perdoceo Education (NASDAQ:[PRDO](https://www.benzinga.com/stock/PRDO#NASDAQ)) is estimated to report quarterly earnings at $0.66 per share on revenue of $207.97 million.

• Middlesex Water (NASDAQ:[MSEX](https://www.benzinga.com/stock/MSEX#NASDAQ)) is projected to report quarterly earnings at $0.57 per share on revenue of $43.79 million.

• ACCO Brands (NYSE:[ACCO](https://www.benzinga.com/stock/ACCO#NYSE)) is likely to report quarterly loss at $0.04 per share on revenue of $362.80 million.

• Quaker Houghton (NYSE:[KWR](https://www.benzinga.com/stock/KWR#NYSE)) is estimated to report quarterly earnings at $1.61 per share on revenue of $455.23 million.

• Velocity Financial (NYSE:[VEL](https://www.benzinga.com/stock/VEL#NYSE)) is expected to report quarterly earnings at $0.56 per share on revenue of $51.33 million.

• Savers Value Village (NYSE:[SVV](https://www.benzinga.com/stock/SVV#NYSE)) is estimated to report quarterly earnings at $0.07 per share on revenue of $379.93 million.

• Frontier Group Holdings (NASDAQ:[ULCC](https://www.benzinga.com/stock/ULCC#NASDAQ)) is likely to report quarterly loss at $0.04 per share on revenue of $956.92 million.

• Arthur J. Gallagher (NYSE:[AJG](https://www.benzinga.com/stock/AJG#NYSE)) is expected to report quarterly earnings at $3.85 per share on revenue of $3.73 billion.

• Beazer Homes USA (NYSE:[BZH](https://www.benzinga.com/stock/BZH#NYSE)) is expected to report quarterly earnings at $0.29 per share on revenue of $543.60 million.

• BJ's Restaurants (NASDAQ:[BJRI](https://www.benzinga.com/stock/BJRI#NASDAQ)) is likely to report quarterly earnings at $0.37 per share on revenue of $347.70 million.

• Cohu (NASDAQ:[COHU](https://www.benzinga.com/stock/COHU#NASDAQ)) is likely to report quarterly loss at $0.17 per share on revenue of $96.61 million.

• Five9 (NASDAQ:[FIVN](https://www.benzinga.com/stock/FIVN#NASDAQ)) is expected to report quarterly earnings at $0.49 per share on revenue of $272.17 million.

• Eversource Energy (NYSE:[ES](https://www.benzinga.com/stock/ES#NYSE)) is projected to report quarterly earnings at $1.54 per share on revenue of $3.40 billion.

• Canadian National Railway (NYSE:[CNI](https://www.benzinga.com/stock/CNI#NYSE)) is projected to report quarterly earnings at $1.79 per share on revenue of $4.38 billion.

• Stryker (NYSE:[SYK](https://www.benzinga.com/stock/SYK#NYSE)) is estimated to report quarterly earnings at $2.86 per share on revenue of $5.70 billion.

• Allison Transmission (NYSE:[ALSN](https://www.benzinga.com/stock/ALSN#NYSE)) is expected to report quarterly earnings at $2.04 per share on revenue of $793.36 million.

• Reinsurance Gr (NYSE:[RGA](https://www.benzinga.com/stock/RGA#NYSE)) is expected to report quarterly earnings at $5.47 per share on revenue of $5.74 billion.

• Ryan Specialty Hldgs (NYSE:[RYAN](https://www.benzinga.com/stock/RYAN#NYSE)) is estimated to report quarterly earnings at $0.39 per share on revenue of $680.80 million.

• American Homes 4 Rent (NYSE:[AMH](https://www.benzinga.com/stock/AMH#NYSE)) is estimated to report quarterly earnings at $0.45 per share on revenue of $444.29 million.

• GoDaddy (NYSE:[GDDY](https://www.benzinga.com/stock/GDDY#NYSE)) is likely to report quarterly earnings at $1.38 per share on revenue of $1.19 billion.

• Camden Prop Trust (NYSE:[CPT](https://www.benzinga.com/stock/CPT#NYSE)) is likely to report quarterly earnings at $1.68 per share on revenue of $388.47 million.

• Omega Healthcare Invts (NYSE:[OHI](https://www.benzinga.com/stock/OHI#NYSE)) is estimated to report quarterly earnings at $0.75 per share on revenue of $235.80 million.

• Block (NYSE:[XYZ](https://www.benzinga.com/stock/XYZ#NYSE)) is estimated to report quarterly earnings at $0.95 per share on revenue of $6.15 billion.

• Ameren (NYSE:[AEE](https://www.benzinga.com/stock/AEE#NYSE)) is estimated to report quarterly earnings at $1.04 per share on revenue of $1.92 billion.

• Consolidated Edison (NYSE:[ED](https://www.benzinga.com/stock/ED#NYSE)) is projected to report quarterly earnings at $2.05 per share on revenue of $4.21 billion.

• Ingersoll Rand (NYSE:[IR](https://www.benzinga.com/stock/IR#NYSE)) is expected to report quarterly earnings at $0.74 per share on revenue of $1.73 billion.

• Exponent (NASDAQ:[EXPO](https://www.benzinga.com/stock/EXPO#NASDAQ)) is estimated to report quarterly earnings at $0.54 per share on revenue of $136.93 million.

• Skyward Specialty (NASDAQ:[SKWD](https://www.benzinga.com/stock/SKWD#NASDAQ)) is likely to report quarterly earnings at $0.77 per share on revenue of $310.94 million.

• Twilio (NYSE:[TWLO](https://www.benzinga.com/stock/TWLO#NYSE)) is expected to report quarterly earnings at $0.96 per share on revenue of $1.14 billion.

• Universal Display (NASDAQ:[OLED](https://www.benzinga.com/stock/OLED#NASDAQ)) is expected to report quarterly earnings at $1.05 per share on revenue of $154.76 million.

• Exact Sciences (NASDAQ:[EXAS](https://www.benzinga.com/stock/EXAS#NASDAQ)) is expected to report quarterly loss at $0.27 per share on revenue of $698.60 million.

• Casella Waste Systems (NASDAQ:[CWST](https://www.benzinga.com/stock/CWST#NASDAQ)) is expected to report quarterly earnings at $0.09 per share on revenue of $403.64 million.

• Floor & Decor Hldgs (NYSE:[FND](https://www.benzinga.com/stock/FND#NYSE)) is expected to report quarterly earnings at $0.49 per share on revenue of $1.18 billion.

• Hercules Capital (NYSE:[HTGC](https://www.benzinga.com/stock/HTGC#NYSE)) is projected to report quarterly earnings at $0.47 per share on revenue of $125.43 million.

• SM Energy (NYSE:[SM](https://www.benzinga.com/stock/SM#NYSE)) is projected to report quarterly earnings at $1.55 per share on revenue of $820.87 million.

• United States Steel (NYSE:[X](https://www.benzinga.com/stock/X#NYSE)) is likely to report quarterly loss at $0.41 per share on revenue of $3.54 billion.

• Cousins Props (NYSE:[CUZ](https://www.benzinga.com/stock/CUZ#NYSE)) is expected to report quarterly earnings at $0.71 per share on revenue of $236.44 million.

• Dolby Laboratories (NYSE:[DLB](https://www.benzinga.com/stock/DLB#NYSE)) is projected to report quarterly earnings at $1.28 per share on revenue of $375.44 million.

• Apple Hospitality REIT (NYSE:[APLE](https://www.benzinga.com/stock/APLE#NYSE)) is estimated to report quarterly earnings at $0.33 per share on revenue of $332.94 million.

• Biomarin Pharmaceutical (NASDAQ:[BMRN](https://www.benzinga.com/stock/BMRN#NASDAQ)) is expected to report quarterly earnings at $0.97 per share on revenue of $741.92 million.

• Hologic (NASDAQ:[HOLX](https://www.benzinga.com/stock/HOLX#NASDAQ)) is estimated to report quarterly earnings at $1.02 per share on revenue of $1.00 billion.

• DexCom (NASDAQ:[DXCM](https://www.benzinga.com/stock/DXCM#NASDAQ)) is projected to report quarterly earnings at $0.33 per share on revenue of $1.02 billion.

• Amgen (NASDAQ:[AMGN](https://www.benzinga.com/stock/AMGN#NASDAQ)) is likely to report quarterly earnings at $4.29 per share on revenue of $8.06 billion.

• Atlassian (NASDAQ:[TEAM](https://www.benzinga.com/stock/TEAM#NASDAQ)) is expected to report quarterly earnings at $0.93 per share on revenue of $1.35 billion.

• Airbnb (NASDAQ:[ABNB](https://www.benzinga.com/stock/ABNB#NASDAQ)) is projected to report quarterly earnings at $0.23 per share on revenue of $2.26 billion.

• Reddit (NYSE:[RDDT](https://www.benzinga.com/stock/RDDT#NYSE)) is estimated to report quarterly earnings at $0.02 per share on revenue of $370.54 million.

• Juniper Networks (NYSE:[JNPR](https://www.benzinga.com/stock/JNPR#NYSE)) is projected to report quarterly earnings at $0.43 per share on revenue of $1.28 billion.

• Cable One (NYSE:[CABO](https://www.benzinga.com/stock/CABO#NYSE)) is likely to report quarterly earnings at $12.21 per share on revenue of $386.61 million.

• Viavi Solutions (NASDAQ:[VIAV](https://www.benzinga.com/stock/VIAV#NASDAQ)) is estimated to report quarterly earnings at $0.12 per share on revenue of $282.13 million.

• Trupanion (NASDAQ:[TRUP](https://www.benzinga.com/stock/TRUP#NASDAQ)) is expected to report quarterly loss at $0.05 per share on revenue of $337.81 million.

• iRhythm Technologies (NASDAQ:[IRTC](https://www.benzinga.com/stock/IRTC#NASDAQ)) is likely to report quarterly loss at $0.94 per share on revenue of $153.39 million.

• BigBear.ai Hldgs (NYSE:[BBAI](https://www.benzinga.com/stock/BBAI#NYSE)) is estimated to report quarterly loss at $0.06 per share on revenue of $35.90 million.

• Paylocity Holding (NASDAQ:[PCTY](https://www.benzinga.com/stock/PCTY#NASDAQ)) is likely to report quarterly earnings at $2.12 per share on revenue of $441.77 million.

• Roku (NASDAQ:[ROKU](https://www.benzinga.com/stock/ROKU#NASDAQ)) is expected to report quarterly loss at $0.25 per share on revenue of $1.01 billion.

• Amazon.com (NASDAQ:[AMZN](https://www.benzinga.com/stock/AMZN#NASDAQ)) is likely to report quarterly earnings at $1.36 per share on revenue of $154.94 billion.

• Asure Software (NASDAQ:[ASUR](https://www.benzinga.com/stock/ASUR#NASDAQ)) is projected to report quarterly earnings at $0.18 per share on revenue of $34.20 million.

• WillScot Holdings (NASDAQ:[WSC](https://www.benzinga.com/stock/WSC#NASDAQ)) is likely to report quarterly earnings at $0.26 per share on revenue of $555.51 million.

• Riot Platforms (NASDAQ:[RIOT](https://www.benzinga.com/stock/RIOT#NASDAQ)) is likely to report quarterly loss at $0.20 per share on revenue of $158.81 million.

• Barfresh Food Group (NASDAQ:[BRFH](https://www.benzinga.com/stock/BRFH#NASDAQ)) is expected to report quarterly loss at $0.06 per share on revenue of $2.81 million.

• Ardelyx (NASDAQ:[ARDX](https://www.benzinga.com/stock/ARDX#NASDAQ)) is projected to report quarterly loss at $0.08 per share on revenue of $79.50 million.

• GSI Technology (NASDAQ:[GSIT](https://www.benzinga.com/stock/GSIT#NASDAQ)) is estimated to report earnings for its fourth quarter.

• NPK International (NYSE:[NPKI](https://www.benzinga.com/stock/NPKI#NYSE)) is expected to report quarterly earnings at $0.08 per share on revenue of $56.20 million.

• DMC Glb (NASDAQ:[BOOM](https://www.benzinga.com/stock/BOOM#NASDAQ)) is estimated to report quarterly loss at $0.09 per share on revenue of $148.90 million.

• Forum Energy Technologies (NYSE:[FET](https://www.benzinga.com/stock/FET#NYSE)) is projected to report quarterly earnings at $0.00 per share on revenue of $207.70 million.

• Maplebear (NASDAQ:[CART](https://www.benzinga.com/stock/CART#NASDAQ)) is estimated to report quarterly earnings at $0.72 per share on revenue of $897.11 million.

• SB Finl Gr (NASDAQ:[SBFG](https://www.benzinga.com/stock/SBFG#NASDAQ)) is estimated to report quarterly earnings at $0.40 per share on revenue of $11.30 million.

• Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) is expected to report quarterly earnings at $1.20 per share on revenue of $223.02 million.

• ICF International (NASDAQ:[ICFI](https://www.benzinga.com/stock/ICFI#NASDAQ)) is expected to report quarterly earnings at $1.73 per share on revenue of $487.28 million.

• Huntsman (NYSE:[HUN](https://www.benzinga.com/stock/HUN#NYSE)) is estimated to report quarterly loss at $0.10 per share on revenue of $1.49 billion.

• Healthcare Realty Trust (NYSE:[HR](https://www.benzinga.com/stock/HR#NYSE)) is expected to report quarterly earnings at $0.39 per share on revenue of $297.00 million.

• Diamondrock Hospitality (NYSE:[DRH](https://www.benzinga.com/stock/DRH#NYSE)) is expected to report quarterly earnings at $0.17 per share on revenue of $259.27 million.

• Alphatec Holdings (NASDAQ:[ATEC](https://www.benzinga.com/stock/ATEC#NASDAQ)) is expected to report quarterly loss at $0.12 per share on revenue of $167.57 million.

• Rimini Street (NASDAQ:[RMNI](https://www.benzinga.com/stock/RMNI#NASDAQ)) is expected to report quarterly earnings at $0.08 per share on revenue of $103.26 million.

• Columbia Sportswear (NASDAQ:[COLM](https://www.benzinga.com/stock/COLM#NASDAQ)) is expected to report quarterly earnings at $0.66 per share on revenue of $763.23 million.

• Pros Holdings (NYSE:[PRO](https://www.benzinga.com/stock/PRO#NYSE)) is estimated to report quarterly earnings at $0.12 per share on revenue of $87.21 million.

• Procore Technologies (NYSE:[PCOR](https://www.benzinga.com/stock/PCOR#NYSE)) is likely to report quarterly earnings at $0.18 per share on revenue of $302.68 million.

• Zeta Global Holdings (NYSE:[ZETA](https://www.benzinga.com/stock/ZETA#NYSE)) is estimated to report quarterly earnings at $0.12 per share on revenue of $254.18 million.

• Adaptive Biotechnologies (NASDAQ:[ADPT](https://www.benzinga.com/stock/ADPT#NASDAQ)) is estimated to report quarterly loss at $0.30 per share on revenue of $42.13 million.

• Alignment Healthcare (NASDAQ:[ALHC](https://www.benzinga.com/stock/ALHC#NASDAQ)) is expected to report quarterly loss at $0.08 per share on revenue of $889.83 million.

• Plymouth Industrial REIT (NYSE:[PLYM](https://www.benzinga.com/stock/PLYM#NYSE)) is expected to report quarterly earnings at $0.45 per share on revenue of $47.69 million.

• NV5 Global (NASDAQ:[NVEE](https://www.benzinga.com/stock/NVEE#NASDAQ)) is likely to report quarterly earnings at $0.19 per share on revenue of $229.89 million.

• OneSpan (NASDAQ:[OSPN](https://www.benzinga.com/stock/OSPN#NASDAQ)) is estimated to report quarterly earnings at $0.32 per share on revenue of $62.58 million.

• Pebblebrook Hotel (NYSE:[PEB](https://www.benzinga.com/stock/PEB#NYSE)) is expected to report quarterly earnings at $0.13 per share on revenue of $313.02 million.

• Invesco Semiconductors ETF (NYSE:[PSI](https://www.benzinga.com/stock/PSI#NYSE)) is projected to report quarterly earnings at $0.26 per share on revenue of $106.60 million.

• CubeSmart (NYSE:[CUBE](https://www.benzinga.com/stock/CUBE#NYSE)) is projected to report quarterly earnings at $0.63 per share on revenue of $268.10 million.

• CTO Realty Growth (NYSE:[CTO](https://www.benzinga.com/stock/CTO#NYSE)) is projected to report quarterly earnings at $0.48 per share on revenue of $34.91 million.

• Grid Dynamics Holdings (NASDAQ:[GDYN](https://www.benzinga.com/stock/GDYN#NASDAQ)) is expected to report quarterly earnings at $0.09 per share on revenue of $98.19 million.

• Envista Holdings (NYSE:[NVST](https://www.benzinga.com/stock/NVST#NYSE)) is likely to report quarterly earnings at $0.25 per share on revenue of $627.13 million.

• Workiva (NYSE:[WK](https://www.benzinga.com/stock/WK#NYSE)) is estimated to report quarterly earnings at $0.07 per share on revenue of $204.16 million.

• AptarGroup (NYSE:[ATR](https://www.benzinga.com/stock/ATR#NYSE)) is expected to report quarterly earnings at $1.50 per share on revenue of $894.26 million.

• Apple (NASDAQ:[AAPL](https://www.benzinga.com/stock/AAPL#NASDAQ)) is projected to report quarterly earnings at $1.61 per share on revenue of $94.07 billion.

• Olympic Steel (NASDAQ:[ZEUS](https://www.benzinga.com/stock/ZEUS#NASDAQ)) is expected to report quarterly earnings at $0.24 per share on revenue of $466.80 million.

• Olin (NYSE:[OLN](https://www.benzinga.com/stock/OLN#NYSE)) is projected to report quarterly loss at $0.08 per share on revenue of $1.58 billion.

• American International Gr (NYSE:[AIG](https://www.benzinga.com/stock/AIG#NYSE)) is projected to report quarterly earnings at $1.00 per share on revenue of $6.89 billion.

• Center (NYSE:[CSR](https://www.benzinga.com/stock/CSR#NYSE)) is estimated to report quarterly earnings at $1.21 per share on revenue of $66.70 million.

• WisdomTree Emerging Markets Local Debt Fund (NYSE:[ELD](https://www.benzinga.com/stock/ELD#NYSE)) is estimated to report quarterly earnings at $0.48 per share on revenue of $343.28 million.

• Elme (NYSE:[ELME](https://www.benzinga.com/stock/ELME#NYSE)) is likely to report quarterly earnings at $0.23 per share on revenue of $60.89 million.

• Core Natural Resources (NYSE:[CNR](https://www.benzinga.com/stock/CNR#NYSE)) is projected to report quarterly earnings at $1.79 per share on revenue of $4.38 billion.

• Employers Holdings (NYSE:[EIG](https://www.benzinga.com/stock/EIG#NYSE)) is projected to report quarterly earnings at $0.72 per share on revenue of $220.53 million.

• A10 Networks (NYSE:[ATEN](https://www.benzinga.com/stock/ATEN#NYSE)) is likely to report quarterly earnings at $0.18 per share on revenue of $63.63 million.

• UMH Properties (NYSE:[UMH](https://www.benzinga.com/stock/UMH#NYSE)) is projected to report quarterly earnings at $0.23 per share on revenue of $62.64 million.

• EOG Resources (NYSE:[EOG](https://www.benzinga.com/stock/EOG#NYSE)) is projected to report quarterly earnings at $2.55 per share on revenue of $6.00 billion.

This article was generated by Benzinga's automated content engine and reviewed by an editor.
</news-article>


<news-article>
## Article ID: 45150051
## Stocks: DUOL
## Published (UTC): Thu, 01 May 2025 16:07:20 -0400
## Title: Duolingo Q1 EPS $0.72 Beats $0.51 Estimate, Sales $230.74M Beat $222.98M Estimate
## URL: https://www.benzinga.com/news/earnings/25/05/45150051/duolingo-q1-eps-0-72-beats-0-51-estimate-sales-230-74m-beat-222-98m-estimate
## Tags: 
## Channels: Earnings, Earnings Beats, News
## Content: Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) reported quarterly earnings of $0.72 per share which beat the analyst consensus estimate of $0.51 by 41.18 percent. This is a 26.32 percent increase over earnings of $0.57 per share from the same period last year. The company reported quarterly sales of $230.74 million which beat the analyst consensus estimate of $222.98 million by 3.48 percent. This is a 37.71 percent increase over sales of $167.55 million the same period last year.
</news-article>


<news-article>
## Article ID: 45150194
## Stocks: DUOL
## Published (UTC): Thu, 01 May 2025 16:08:16 -0400
## Title: Duolingo Raises FY2025 Sales Guidance from $962.50M-$978.50M to $987.00M-$996.00M vs $977.16M Est
## URL: https://www.benzinga.com/news/25/05/45150194/duolingo-raises-fy2025-sales-guidance-from-962-50m-978-50m-to-987-00m-996-00m-vs-977-16m-est
## Tags: 
## Channels: News, Guidance
## Content: Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) raises FY2025 sales outlook from $962.50 million-$978.50 million to $987.00 million-$996.00 million vs $977.16 million estimate.
</news-article>


<news-article>
## Article ID: 45150217
## Stocks: DUOL
## Published (UTC): Thu, 01 May 2025 16:08:26 -0400
## Title: Duolingo Sees Q2 Sales $238.500M-$241.500M vs $233.76M Est
## URL: https://www.benzinga.com/news/25/05/45150217/duolingo-sees-q2-sales-238-500m-241-500m-vs-233-76m-est
## Tags: 
## Channels: News, Guidance
## Content: Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) sees Q2 sales of $238.500 million-$241.500 million vs $233.76 million analyst estimate.
</news-article>


<news-article>
## Article ID: 45150972
## Stocks: DUOL
## Published (UTC): Thu, 01 May 2025 16:19:24 -0400
## Title: Duolingo shares are trading higher after the company reported better-than-expected Q1 financial results, issued Q2 sales guidance above estimates, and raised its FY25 sales guidance.
## URL: https://www.benzinga.com/wiim/25/05/45150972/duolingo-shares-are-trading-higher-after-the-company-reported-better-than-expected-q1-financial-resu
## Tags: 
## Channels: WIIM
## Content: 
</news-article>


<news-article>
## Article ID: 45161995
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 06:46:23 -0400
## Title: Needham Maintains Buy on Duolingo, Raises Price Target to $460
## URL: https://www.benzinga.com/news/25/05/45161995/needham-maintains-buy-on-duolingo-raises-price-target-to-460
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Needham analyst Ryan MacDonald maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Buy and raises the price target from $400 to $460.
</news-article>


<news-article>
## Article ID: 45162362
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 07:04:18 -0400
## Title: Duolingo shares are trading higher after the company reported better-than-expected Q1 financial results, issued Q2 sales guidance above estimates, and raised its FY25 sales guidance.
## URL: https://www.benzinga.com/wiim/25/05/45162362/duolingo-shares-are-trading-higher-after-the-company-reported-better-than-expected-q1-financial-resu
## Tags: 
## Channels: WIIM
## Content: 
</news-article>


<news-article>
## Article ID: 45163433
## Stocks: AAPL, ALNY, ARVN, DUOL, FIVN, GOVX, KSS, MSTR, XYZ, YOU
## Published (UTC): Fri, 02 May 2025 07:57:53 -0400
## Title: Apple To Rally More Than 17%? Here Are 10 Top Analyst Forecasts For Friday
## URL: https://www.benzinga.com/25/05/45163433/apple-to-rally-more-than-17-here-are-10-top-analyst-forecasts-for-friday
## Tags: analysts forecasts, PT Changes
## Channels: News, Price Target, Pre-Market Outlook, Markets, Analyst Ratings, Trading Ideas
## Content: Top Wall Street analysts changed their outlook on these top names. For a complete view of all analyst rating changes, including upgrades and downgrades, please see our [analyst ratings page](https://www.benzinga.com/analyst-stock-ratings).

*   Telsey Advisory Group cut **Kohl’s Corporation** (NYSE:[KSS](https://www.benzinga.com/stock/KSS#NYSE)) price target from $10 to $9. Telsey Advisory Group analyst Dana Telsey maintained a Market Perform rating. Kohl’s shares closed at $7.21 on Thursday. [See how other analysts view this stock.](https://www.benzinga.com/quote/KSS/analyst-ratings)
*   Needham raised the price target for **Duolingo, Inc.** (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) from $400 to $460. Needham analyst Ryan MacDonald maintained a Buy rating. Duolingo shares closed at $400.00 on Thursday. [See how other analysts view this stock](https://www.benzinga.com/quote/DUOL/analyst-ratings).
*   Chardan Capital raised **Alnylam Pharmaceuticals, Inc**. (NASDAQ:[ALNY](https://www.benzinga.com/stock/ALNY#NASDAQ)) price target from $300 to $325. Chardan Capital analyst Keay Nakae maintained a Buy rating. Alnylam Pharmaceuticals shares closed at $255.13 on Thursday. [See how other analysts view this stock.](https://www.benzinga.com/quote/ALNY/analyst-ratings)
*   Canaccord Genuity slashed the price target for **Block, Inc**. (NYSE:[XYZ](https://www.benzinga.com/stock/XYZ#NYSE)) from $100 to $80. Canaccord Genuity analyst Joseph Vafi maintained a Buy rating. Block shares closed at $58.48 on Thursday. [See how other analysts view this stock.](https://www.benzinga.com/quote/XYZ/analyst-ratings)
*   D. Boral Capital cut the price target for **GeoVax Labs, Inc**. (NASDAQ:[GOVX](https://www.benzinga.com/stock/GOVX#NASDAQ)) from $14 to $9. D. Boral Capital analyst Jason Kolbert maintained a Buy rating. GeoVax Labs shares closed at $0.9893 on Thursday. [See how other analysts view this stock.](https://www.benzinga.com/quote/GOVX/analyst-ratings)
*   DA Davidson raised **Apple Inc.** (NASDAQ:[AAPL](https://www.benzinga.com/stock/AAPL#NASDAQ)) price target from $230 to $250. DA Davidson analyst Gil Luria maintained a Buy rating. Apple shares settled at $213.32 on Thursday. [See how other analysts view this stock](https://www.benzinga.com/quote/AAPL/analyst-ratings).
*   Jefferies cut **Arvinas, Inc**. (NASDAQ:[ARVN](https://www.benzinga.com/stock/ARVN#NASDAQ)) price target from $52 to $10. Jefferies analyst Akash Tewari downgraded the stock from Buy to Hold. Arvinas shares closed at $7.23 on Thursday. [See how other analysts view this stock.](https://www.benzinga.com/quote/ARVN/analyst-ratings)
*   Telsey Advisory Group cut **Clear Secure, Inc**. (NYSE:[YOU](https://www.benzinga.com/stock/YOU#NYSE)) price target from $42 to $32. Telsey Advisory Group analyst Dana Telsey maintained an Outperform rating. Clear Secure shares closed at $24.40 on Thursday.  [See how other analysts view this stock](https://www.benzinga.com/quote/YOU/analyst-ratings).
*   Needham lowered the price target for **Five9, Inc.** (NASDAQ:[FIVN](https://www.benzinga.com/stock/FIVN#NASDAQ)) from $52 to $40. Needham analyst Scott Berg maintained a Buy rating. Five9 shares settled at $25.08 on Thursday. [See how other analysts view this stock](https://www.benzinga.com/quote/FIVN/analyst-ratings).
*   Canaccord Genuity increased **Strategy Incorporated** (NASDAQ:[MSTR](https://www.benzinga.com/stock/MSTR#NASDAQ)) price target from $409 to $464. Canaccord Genuity analyst Joseph Vafi maintained a Buy rating. Strategy shares closed at $381.60 on Thursday. [See how other analysts view this stock](https://www.benzinga.com/quote/MSTR/analyst-ratings).

Considering buying AAPL stock? Here’s what analysts think:

![](https://editorial-assets.benzinga.com/wp-content/uploads/2025/05/02075526/image-23-1024x606.png)

**Read This Next:[](https://www.benzinga.com/trading-ideas/long-ideas/25/05/45133450/jim-cramer-this-consumer-cyclical-stock-is-a-one-trick-pony)**

*   **[Jim Cramer: This Consumer Cyclical Stock Is A ‘One-Trick Pony’](https://www.benzinga.com/trading-ideas/long-ideas/25/05/45133450/jim-cramer-this-consumer-cyclical-stock-is-a-one-trick-pony)**

Photo via Shutterstock
</news-article>


<news-article>
## Article ID: 45165375
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 09:11:46 -0400
## Title: Evercore ISI Group Maintains Outperform on Duolingo, Raises Price Target to $480
## URL: https://www.benzinga.com/news/25/05/45165375/evercore-isi-group-maintains-outperform-on-duolingo-raises-price-target-to-480
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Evercore ISI Group analyst Mark Mahaney maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Outperform and raises the price target from $400 to $480.
</news-article>


<news-article>
## Article ID: 45166476
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 09:41:20 -0400
## Title: Barclays Maintains Equal-Weight on Duolingo, Raises Price Target to $375
## URL: https://www.benzinga.com/news/25/05/45166476/barclays-maintains-equal-weight-on-duolingo-raises-price-target-to-375
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Barclays analyst Mario Lu maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Equal-Weight and raises the price target from $330 to $375.
</news-article>


<news-article>
## Article ID: 45168618
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 10:28:06 -0400
## Title: Scotiabank Maintains Sector Outperform on Duolingo, Raises Price Target to $470
## URL: https://www.benzinga.com/news/25/05/45168618/scotiabank-maintains-sector-outperform-on-duolingo-raises-price-target-to-470
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Scotiabank analyst Nat Schindler maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Sector Outperform and raises the price target from $405 to $470.
</news-article>


<news-article>
## Article ID: 45169072
## Stocks: ACHR, ADPT, ASTS, AUR, CART, DUOL, DXCM, EXAS, HOOD, HPH, IRTC, MTZ, NPKI, PONY, TRUP, WOLF
## Published (UTC): Fri, 02 May 2025 10:36:47 -0400
## Title: Trupanion Posts Better-Than-Expected Results, Joins Duolingo, DexCom, Exact Sciences And Other Big Stocks Moving Higher On Friday
## URL: https://www.benzinga.com/25/05/45169072/trupanion-posts-better-than-expected-results-joins-duolingo-dexcom-exact-sciences-and-other-big-stocks-moving-higher-on-friday
## Tags: big gainers, Mid-Day Movers
## Channels: News, Intraday Update, Markets, Movers, Trading Ideas
## Content: U.S. stocks were higher, with the Dow Jones index gaining around 400 points on Friday.

Shares of **Trupanion, Inc**. (NASDAQ:[TRUP](https://www.benzinga.com/stock/TRUP#NASDAQ)) rose sharply during Friday's session after the company reported better-than-expected first-quarter financial results and [raised its FY25 sales guidance](https://www.benzinga.com/quote/TRUP/earnings).

Trupanion reported quarterly loss of 3 cents per share which beat the analyst consensus estimate of loss of 5 cents per share. The company reported quarterly sales of $341.98 million which beat the analyst consensus estimate of $337.82 million.

Trupanion shares jumped 18.2% to $43.08 on Friday.

Here are some other big stocks recording gains in today’s session.

*   **Adaptive Biotechnologies Corporation** (NASDAQ:[ADPT](https://www.benzinga.com/stock/ADPT#NASDAQ)) shares surged 30% to $9.60 after the company reported first-quarter financial results and beat its EPS and revenue estimates.
*   **NPK International Inc**. (NASDAQ:[NPKI](https://www.benzinga.com/stock/NPKI#NASDAQ)) gained 26.6% to $7.65 after the company reported better-than-expected first-quarter financial results.
*   **Wolfspeed, Inc**. (NYSE:[WOLF](https://www.benzinga.com/stock/WOLF#NYSE)) rose 23.1% to $4.42.
*   **Highest Performances Holdings Inc**. (NASDAQ:[HPH](https://www.benzinga.com/stock/HPH#NASDAQ)) gained 23.1% to $7.20.
*   **Pony AI Inc**. (NASDAQ:[PONY](https://www.benzinga.com/stock/PONY#NASDAQ)) rose 20.8% to $10.37.
*   **AST SpaceMobile, Inc**. (NASDAQ:[ASTS](https://www.benzinga.com/stock/ASTS#NASDAQ)) climbed 17.4% to $26.96.
*   **iRhythm Technologies, Inc**. (NASDAQ:[IRTC](https://www.benzinga.com/stock/IRTC#NASDAQ)) rose 17.4% to $127.43 after the company reported better-than-expected first-quarter results and raised its FY25 sales guidance
*   **Duolingo, Inc**. (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) gained 15% to $460.50 after the company reported better-than-expected first-quarter financial results and raised its FY25 sales guidance.
*   **DexCom, Inc**. (NASDAQ:[DXCM](https://www.benzinga.com/stock/DXCM#NASDAQ)) gained 13.7% to $79.87 following strong quarterly sales.
*   **Aurora Innovation, Inc**. (NASDAQ:[AUR](https://www.benzinga.com/stock/AUR#NASDAQ)) jumped 12.4% to $7.74.
*   **Maplebear Inc**. (NASDAQ:[CART](https://www.benzinga.com/stock/CART#NASDAQ)) gained 11.3% to $44.33 following first-quarter results.
*   **Exact Sciences Corporation** (NASDAQ:[EXAS](https://www.benzinga.com/stock/EXAS#NASDAQ)) gained 11.1% to $52.40 after the company reported better-than-expected first-quarter sales results and raised its FY25 sales guidance.
*   **Archer Aviation Inc**. (NYSE:[ACHR](https://www.benzinga.com/stock/ACHR#NYSE)) gained 10.6% to $9.39.
*   **MasTec, Inc**. (NYSE:[MTZ](https://www.benzinga.com/stock/MTZ#NYSE)) gained 6.4% to $142.68 following first-quarter results.
*   **Robinhood Markets, In**c. (NASDAQ:[HOOD](https://www.benzinga.com/stock/HOOD#NASDAQ)) rose 6.3% to $49.58.

**Now Read This:**

*   **[How To Earn $500 A Month From Tyson Foods Stock Ahead Of Q2 Earnings](https://www.benzinga.com/news/earnings/25/05/45164963/how-to-earn-500-a-month-from-tyson-foods-stock-ahead-of-q2-earnings)**
</news-article>


<news-article>
## Article ID: 45171280
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 11:25:03 -0400
## Title: Piper Sandler Maintains Overweight on Duolingo, Raises Price Target to $465
## URL: https://www.benzinga.com/news/25/05/45171280/piper-sandler-maintains-overweight-on-duolingo-raises-price-target-to-465
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Piper Sandler analyst Arvind Ramnani maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Overweight and raises the price target from $390 to $465.
</news-article>


<news-article>
## Article ID: 45174211
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 13:25:40 -0400
## Title: DA Davidson Maintains Buy on Duolingo, Raises Price Target to $470
## URL: https://www.benzinga.com/news/25/05/45174211/da-davidson-maintains-buy-on-duolingo-raises-price-target-to-470
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: DA Davidson analyst Wyatt Swanson maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Buy and raises the price target from $410 to $470.
</news-article>


<news-article>
## Article ID: 45174502
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 13:40:39 -0400
## Title: JP Morgan Maintains Overweight on Duolingo, Raises Price Target to $500
## URL: https://www.benzinga.com/news/25/05/45174502/jp-morgan-maintains-overweight-on-duolingo-raises-price-target-to-500
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: JP Morgan analyst Bryan Smilek maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Overweight and raises the price target from $360 to $500.
</news-article>


<news-article>
## Article ID: 45175089
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 14:00:51 -0400
## Title: Forecasting The Future: 18 Analyst Projections For Duolingo
## URL: https://www.benzinga.com/insights/analyst-ratings/25/05/45175089/forecasting-the-future-18-analyst-projections-for-duolingo
## Tags: BZI-AAR
## Channels: Analyst Ratings
## Content: Providing a diverse range of perspectives from bullish to bearish, 18 analysts have published ratings on Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) in the last three months.

Summarizing their recent assessments, the table below illustrates the evolving sentiments in the past 30 days and compares them to the preceding months.

**Bullish**

**Somewhat Bullish**

**Indifferent**

**Somewhat Bearish**

**Bearish**

**Total Ratings**

6

9

3

0

0

**Last 30D**

2

4

1

0

0

**1M Ago**

1

2

0

0

0

**2M Ago**

1

1

1

0

0

**3M Ago**

2

2

1

0

0

The 12-month price targets, analyzed by analysts, offer insights with an average target of $414.72, a high estimate of $500.00, and a low estimate of $330.00. Witnessing a positive shift, the current average has risen by 9.89% from the previous average price target of $377.41.

![price target chart](https://www.benzinga.com/files/images/story/2025/1746208848_0.png)

Analyzing Analyst Ratings: A Detailed Breakdown
-----------------------------------------------

The standing of Duolingo among financial experts is revealed through an in-depth exploration of recent analyst actions. The summary below outlines key analysts, their recent evaluations, and adjustments to ratings and price targets.

Analyst

Analyst Firm

Action Taken

Rating

Current Price Target

Prior Price Target

Bryan Smilek

JP Morgan

Raises

Overweight

$500.00

$360.00

Wyatt Swanson

DA Davidson

Raises

Buy

$470.00

$410.00

Arvind Ramnani

Piper Sandler

Raises

Overweight

$465.00

$390.00

Nat Schindler

Scotiabank

Raises

Sector Outperform

$470.00

$405.00

Mario Lu

Barclays

Raises

Equal-Weight

$375.00

$330.00

Mark Mahaney

Evercore ISI Group

Raises

Outperform

$480.00

$400.00

Ryan MacDonald

Needham

Raises

Buy

$460.00

$400.00

Nat Schindler

Scotiabank

Lowers

Sector Outperform

$405.00

$425.00

Chris Kuntarich

UBS

Lowers

Buy

$400.00

$430.00

Bryan Smilek

JP Morgan

Lowers

Overweight

$360.00

$410.00

Wyatt Swanson

DA Davidson

Raises

Buy

$410.00

$400.00

Andrew Boone

Citizens Capital Markets

Announces

Market Outperform

$400.00

\-

Eric Sheridan

Goldman Sachs

Raises

Neutral

$340.00

$275.00

Mario Lu

Barclays

Raises

Equal-Weight

$330.00

$295.00

Bryan Smilek

JP Morgan

Raises

Overweight

$410.00

$400.00

Wyatt Swanson

DA Davidson

Raises

Buy

$400.00

$350.00

Ryan MacDonald

Needham

Raises

Buy

$400.00

$385.00

Arvind Ramnani

Piper Sandler

Raises

Overweight

$390.00

$351.00

### Key Insights:

*   **Action Taken:** In response to dynamic market conditions and company performance, analysts update their recommendations. Whether they 'Maintain', 'Raise', or 'Lower' their stance, it signifies their reaction to recent developments related to Duolingo. This insight gives a snapshot of analysts' perspectives on the current state of the company.
*   **Rating:** Analyzing trends, analysts offer qualitative evaluations, ranging from 'Outperform' to 'Underperform'. These ratings convey expectations for the relative performance of Duolingo compared to the broader market.
*   **Price Targets:** Delving into movements, analysts provide estimates for the future value of Duolingo's stock. This analysis reveals shifts in analysts' expectations over time.

To gain a panoramic view of Duolingo's market performance, explore these analyst evaluations alongside essential financial indicators. Stay informed and make judicious decisions using our Ratings Table.

[**Stay up to date on Duolingo analyst ratings.**](https://www.benzinga.com/quote/DUOL/analyst-ratings?adType=benzinga-insights&ad=analyst-ratings&campaign=wallstreetadvantage)

Unveiling the Story Behind Duolingo
-----------------------------------

Duolingo Inc is a technology company that develops a mobile learning platform to learn languages and is the top-grossing app in the Education category on both Google Play and the Apple App Store. Its products are powered by sophisticated data analytics and artificial intelligence and delivered with class art, animation, and design to make it easier for learners to stay motivated master new material, and achieve their learning goals. Its solutions include the Duolingo Language Learning App, Super Duolingo, Duolingo English Test: AI-Driven Language Assessment, Duolingo For Schools, Duolingo ABC, and Duolingo Math. It has four predominant sources of revenue; time-based subscriptions, in-app advertising placement by third parties, and the Duolingo English Test, and In-App Purchases.

### Duolingo: Financial Performance Dissected

**Market Capitalization Analysis:** With a profound presence, the company's market capitalization is above industry averages. This reflects substantial size and strong market recognition.

**Revenue Growth:** Duolingo's remarkable performance in 3M is evident. As of 31 December, 2024, the company achieved an impressive revenue growth rate of **38.79%**. This signifies a substantial increase in the company's top-line earnings. As compared to its peers, the company achieved a growth rate higher than the average among peers in Consumer Discretionary sector.

**Net Margin:** Duolingo's net margin falls below industry averages, indicating challenges in achieving strong profitability. With a net margin of **6.64%,** the company may face hurdles in effective cost management.

**Return on Equity (ROE):** Duolingo's ROE falls below industry averages, indicating challenges in efficiently using equity capital. With an ROE of **1.69%,** the company may face hurdles in generating optimal returns for shareholders.

**Return on Assets (ROA):** Duolingo's ROA lags behind industry averages, suggesting challenges in maximizing returns from its assets. With an ROA of **1.1%,** the company may face hurdles in achieving optimal financial performance.

**Debt Management:** The company maintains a balanced debt approach with a debt-to-equity ratio below industry norms, standing at **0.07**.

The Core of Analyst Ratings: What Every Investor Should Know
------------------------------------------------------------

Analysts are specialists within banking and financial systems that typically report for specific stocks or within defined sectors. These people research company financial statements, sit in conference calls and meetings, and speak with relevant insiders to determine what are known as analyst ratings for stocks. Typically, analysts will rate each stock once a quarter.

Beyond their standard evaluations, some analysts contribute predictions for metrics like growth estimates, earnings, and revenue, furnishing investors with additional guidance. Users of analyst ratings should be mindful that this specialized advice is shaped by human perspectives and may be subject to variability.

**Which Stocks Are Analysts Recommending Now?**

Benzinga Edge gives you instant access to all major analyst upgrades, downgrades, and price targets. Sort by accuracy, upside potential, and more. [**Click here to stay ahead of the market**](https://www.benzinga.com/premium/ideas/benzinga-edge-checkout/?t=be8be9arja3be22bz21&adType=benzinga-insights&ad=analyst-ratings&campaign=wallstreetadvantage).

This article was generated by Benzinga's automated content engine and reviewed by an editor.
</news-article>


<news-article>
## Article ID: 45176523
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 15:02:17 -0400
## Title: Duolingo Charms Wall Street With Viral Surge, AI Power, Soaring Subscriptions
## URL: https://www.benzinga.com/analyst-ratings/price-target/25/05/45176523/duolingo-charms-wall-street-with-viral-surge-ai-power-soaring-subscriptions
## Tags: Briefs, Expert Ideas, why it's moving
## Channels: News, Price Target, Reiteration, Analyst Ratings, Trading Ideas
## Content: **Duolingo Inc** (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) [stock traded higher](https://www.benzinga.com/topic/duolingo) on Friday after the company reported better-than-expected first-quarter financial results on Thursday.

Wall Street analysts raised their price targets on the stock.

Needham analyst Ryan MacDonald maintained Duolingo with a Buy and raised the [price target from](https://www.benzinga.com/quote/DUOL/analyst-ratings) $400 to $460.

**Also Read: [Duolingo’s AI Investments Set The Stage For Long-Term Growth—Analyst Sees Stock Hitting $400](https://www.benzinga.com/analyst-ratings/analyst-color/25/02/44047945/duolingos-ai-investments-set-the-stage-for-long-term-growth-analyst-sees-stock-hitting-400)**

The company reported quarterly revenue growth of 38% to $230.74 million, beating the analyst consensus estimates of $222.98 million. EPS of $0.72 beat the [analyst consensus estimate](https://investors.duolingo.com/investor-relations) of $0.51.

This quarter’s top-line outperformance was mainly driven by Subscriptions, which topped estimates, driven by better-than-expected subscriber count and revenue per subscriber. Paid subscribers came in at 10.3 million for the quarter, above the consensus of 10.12 million. Gross margins exceeded the analyst estimate of 70.0% at 71.1% but were down from 73.0% a year ago.

The decline was expected and due to a combination of lower subscription margins from increased generative AI costs associated with increased Duolingo Max adoption. However, management noted they benefited from some earlier-than-expected cost optimization and higher than anticipated advertising gross margin in other revenue.

Daily active users (DAUs) were 46.6 million, an increase of 49%, and monthly active users (MAUs) were 130.2 million, an increase of 33%.

A viral campaign helps drive record MAU adds, while Max adoption continues at a similar rate to the fourth quarter. Subscription bookings were strong in the quarter, with Y/Y growth at 43.8% versus the analyst’s 35% growth estimate, resulting in subscription bookings of $232.2 million, above the consensus of $218.5 million.

Duolingo expects second-quarter revenue of $238.50 million-$241.50 million versus the $233.76 million analyst consensus estimate. MacDonald expects quarterly revenue of $240.12 million.

Duolingo raised its fiscal 2025 revenue outlook from $962.50 million-$978.50 million to $987.00 million-$996.00 million versus the $977.16 million estimate. MacDonald expects fiscal revenue of $991.51 million.

Duolingo stock continued its strong run to start 2025, with shares up 23.4% year-to-date and 79.4% in the past year. While the stock is trading at a premium multiple to the comp group, and MacDonald’s new price target represents a 22.1 times EV/sales multiple on his fiscal 2025 estimates, the analyst noted that the strong year-end subscription bookings likely translate into subscription revenue growth in the mid-40s range for fiscal 2025 versus the current consensus of 38.3%.

**Price Action**: DUOL shares traded higher by 18.5% at $474.13 at last check Friday.

**Read Next:**

*   **[US Listed Chinese Stocks Soar On Hopes for US-China Trade Truce](https://www.benzinga.com/government/regulations/25/05/45168490/us-listed-chinese-stocks-soar-on-hopes-for-us-china-trade-truce)**

_Photo: Shutterstock_
</news-article>


<news-article>
## Article ID: 45181068
## Stocks: DUOL
## Published (UTC): Fri, 02 May 2025 18:22:22 -0400
## Title: UBS Maintains Buy on Duolingo, Raises Price Target to $500
## URL: https://www.benzinga.com/news/25/05/45181068/ubs-maintains-buy-on-duolingo-raises-price-target-to-500
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: UBS analyst Chris Kuntarich maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Buy and raises the price target from $400 to $500.
</news-article>


<news-article>
## Article ID: 45185422
## Stocks: ANET, AUR, CARR, CRWV, DUOL, DXCM, EXAS, PWR, SMMT, THC, TT, XPO
## Published (UTC): Sun, 04 May 2025 09:45:00 -0400
## Title: Duolingo, CoreWeave And DexCom Are Among Top 10 Large-Cap Gainers Last Week (Apr 28-May 2): Are The Others In Your Portfolio?
## URL: https://www.benzinga.com/news/large-cap/25/05/45185422/duolingo-coreweave-and-dexcom-are-among-top-10-large-cap-gainers-last-week-apr-28-may-2-are-the-others-in-your-portfolio
## Tags: Briefs, Stories That Matter, why it's moving
## Channels: Equities, Large Cap, News, Top Stories, Movers, Trading Ideas
## Content: These large-cap stocks were the best performers in the last week. Are they in your portfolio?

1.  **Duolingo, Inc.** (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) shares rose 27.39% after the company reported better-than-expected financial results and raised [its FY25 sales guidance](https://www.benzinga.com//node/45149547). Several analysts [boosted the price forecast](https://www.benzinga.com/quote/duol/analyst-ratings).
2.  **CoreWeave, Inc.** (NASDAQ:[CRWV](https://www.benzinga.com/stock/CRWV#NASDAQ)) shares increased 24.15%.
3.  **Tenet Healthcare** (NYSE:[THC](https://www.benzinga.com/stock/THC#NYSE)) stock escalated 21.24% after the company reported better-than-expected financial results and raised [its FY25 adjusted EPS guidance](https://www.benzinga.com//node/45061907). Many analysts [boosted the price forecast](https://www.benzinga.com/quote/thc/analyst-ratings).
4.  **Carrier Global Corporation** (NYSE:[CARR](https://www.benzinga.com/stock/CARR#NYSE)) stock upped 19.10% after it reported better-than-expected first-quarter financial results [and raised its FY25 guidance](https://www.benzinga.com//node/45135625).
5.  **Summit Therapeutics Inc.** (NASDAQ:[SMMT](https://www.benzinga.com/stock/SMMT#NASDAQ)) stock upped 18.90%. **Akeso, Inc.** announced the Chinese Health Authorities, the National Medical Products Administration (NMPA) approved ivonescimab for a second indication based on the results of the Phase 3 [trial, HARMONi-2 or AK112-303](https://www.benzinga.com//node/45046531).
6.  **Aurora Innovation, Inc.** (NASDAQ:[AUR](https://www.benzinga.com/stock/AUR#NASDAQ)) stock upped 18.31% last week after the company announced it launched its commercial self-driving [trucking service in Texas](https://www.benzinga.com//node/45128218).
7.  **Arista Networks, Inc.** (NYSE:[ANET](https://www.benzinga.com/stock/ANET#NYSE)) shares were up 16.83% after **Rosenblatt** upgraded the stock from Sell to Neutral and raised its [price forecast from $55 to $85](https://www.benzinga.com/quote/anet/analyst-ratings).
8.  **Trane Technologies plc** (NYSE:[TT](https://www.benzinga.com/stock/TT#NYSE)) stock grew 14.83% after the company reported better-than-expected financial results and raised its FY25 GAAP EPS and [sales guidance above estimates](https://www.benzinga.com//node/45108290). Many analysts [boosted the price forecast](https://www.benzinga.com/quote/tt/analyst-ratings).
9.  **DexCom, Inc.** (NASDAQ:[DXCM](https://www.benzinga.com/stock/DXCM#NASDAQ)) shares escalated 13.90% f[ollowing strong quarterly sales](https://www.benzinga.com//node/45149628). Many analysts [revised the price forecast](https://www.benzinga.com/quote/dxcm/analyst-ratings).
10.  **XPO Inc** (NYSE:[XPO](https://www.benzinga.com/stock/XPO#NYSE)) shares increased 13.81%  after the company reported better-than-expected [first-quarter EPS results](https://www.benzinga.com//node/45099967). Many analysts [revised the price forecast](https://www.benzinga.com/quote/xpo/analyst-ratings).

_Photo by DANIEL CONSTANTE via Shutterstock_
</news-article>


<news-article>
## Article ID: 45196137
## Stocks: DUOL
## Published (UTC): Mon, 05 May 2025 10:20:06 -0400
## Title: Morgan Stanley Maintains Overweight on Duolingo, Raises Price Target to $515
## URL: https://www.benzinga.com/news/25/05/45196137/morgan-stanley-maintains-overweight-on-duolingo-raises-price-target-to-515
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Morgan Stanley analyst Nathan Feather maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Overweight and raises the price target from $435 to $515.
</news-article>


<news-article>
## Article ID: 45197434
## Stocks: DUOL
## Published (UTC): Mon, 05 May 2025 10:56:37 -0400
## Title: Goldman Sachs Maintains Neutral on Duolingo, Raises Price Target to $403
## URL: https://www.benzinga.com/news/25/05/45197434/goldman-sachs-maintains-neutral-on-duolingo-raises-price-target-to-403
## Tags: 
## Channels: News, Price Target, Analyst Ratings
## Content: Goldman Sachs analyst Eric Sheridan maintains Duolingo (NASDAQ:[DUOL](https://www.benzinga.com/stock/DUOL#NASDAQ)) with a Neutral and raises the price target from $340 to $403.
</news-article>

</news>

Follow these guidelines:
<instructions>
1. PRICE MOVEMENT ANALYSIS:
   - Identify key price trends from daily adjusted time series data
   - Calculate short returns (today, 1 day, 5 days)
   - Analyze price volatility and trading volume patterns
   - Identify support and resistance levels
   - Note any significant price gaps or anomalies

2. TECHNICAL INDICATOR ANALYSIS:
   - Interpret the RSI (Relative Strength Index) for overbought/oversold conditions
   - Analyze MACD (Moving Average Convergence Divergence) for trend strength and momentum
   - Evaluate OBV (On-Balance Volume) for volume pressure confirmation
   - Examine EMA (Exponential Moving Average) for trend direction
   - Assess Bollinger Bands for volatility and potential price targets
   - Review Stochastic Oscillator for momentum shifts
   - Consider ATR (Average True Range) for volatility measurement
   - Use SMA (Simple Moving Average) for trend confirmation
   - Analyze VWAP (Volume Weighted Average Price) for institutional interest
   - Combine multiple indicators for consensus signals

3. NEWS SENTIMENT ANALYSIS:
   - Summarize recent news articles affecting NVIDIA
   - Identify positive, negative, or neutral sentiment in media coverage
   - Extract key events, product announcements, or regulatory changes
   - Highlight market reactions to news events
   - Note any recurring themes or concerns in media coverage

4. FUTURE OUTLOOK:
   - Synthesize technical and fundamental analysis for short-term outlook
   - Consider growth opportunities mentioned in news articles
   - Discuss potential catalysts for price movement
   - Address analyst ratings and price targets when available

5. PREDICT PRICE MOVEMENT:
   - Predict price at opening tomorrow. 
   - Predict price at noon EST tomorrow.
   - Predict price at closing tomorrow.
   
</instructions>

Present your analysis in a clear, structured format with appropriate headings and bullet points where necessary. Use visualizations to illustrate key points if helpful. Avoid making definitive investment recommendations, but rather present evidence-based analysis that enables informed decision-making.
    