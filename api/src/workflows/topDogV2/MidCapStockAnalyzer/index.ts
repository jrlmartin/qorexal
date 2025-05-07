import { MidCapScreenerService } from "./services/MidCapScreenerService";

async function runMidCapAnalysis() {
    const midCapScreener = new MidCapScreenerService();
    
    const date = '2025-05-07';
    const time = '09:30:00';

    const data = await midCapScreener.runAnalysis(
      date as string, 
      time as string
    );
    
    return data;
}

export { runMidCapAnalysis };
     