import { MidCapScreenerService } from "./services/MidCapScreenerService";
import { getNow } from "./utils/dateUtils";

async function runMidCapAnalysis() {
    const midCapScreener = new MidCapScreenerService();
    
    // Get current date and time in the format compatible with the stock system
    const now = getNow();
    // Extract date and time parts
    const [date, time] = now.split(' ');

    const data = await midCapScreener.runAnalysis(
      date, 
      time
    );
    
    return data;
}

export { runMidCapAnalysis };
     