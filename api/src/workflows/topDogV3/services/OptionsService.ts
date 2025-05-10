/**
 * Service for analyzing options data for bullish/bearish flow and unusual activity.
 */

export class OptionsService {
  extractOptionsData(optionsData: any[]): {
    call_put_ratio: number;
    unusual_activity: boolean;
    options_flow: {
      bullish_flow_percent: number;
    };
  } {
    if (!optionsData || optionsData.length === 0) {
      return {
        call_put_ratio: 0,
        unusual_activity: false,
        options_flow: {
          bullish_flow_percent: 0
        }
      };
    }
    const calls = optionsData.filter(opt => opt.option_type === 'call');
    const puts = optionsData.filter(opt => opt.option_type === 'put');
    const callVolume = calls.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const putVolume = puts.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const callPutRatio = putVolume === 0
      ? (callVolume > 0 ? 999 : 0)
      : parseFloat((callVolume / putVolume).toFixed(2));

    const callPremium = calls.reduce((sum, opt) =>
      sum + (opt.last || 0) * (opt.volume || 0) * (opt.contract_size || 100), 0);
    const putPremium = puts.reduce((sum, opt) =>
      sum + (opt.last || 0) * (opt.volume || 0) * (opt.contract_size || 100), 0);
    const totalPremium = callPremium + putPremium;
    const bullishFlowPercent = totalPremium === 0
      ? 50
      : parseFloat(((callPremium / totalPremium) * 100).toFixed(2));

    let unusualActivity = false;
    for (const opt of optionsData) {
      if (opt.open_interest && opt.volume && opt.volume > opt.open_interest * 2) {
        unusualActivity = true;
        break;
      }
    }

    return {
      call_put_ratio: callPutRatio,
      unusual_activity: unusualActivity,
      options_flow: {
        bullish_flow_percent: bullishFlowPercent
      }
    };
  }
}