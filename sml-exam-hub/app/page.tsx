import {
  getUnits,
  getPYQPapers,
  getCheatSheets,
  getOverview,
  getQuestionStats,
  getMostRepeatedQuestions,
  getImportantQuestions,
} from "@/lib/dataLoader";
import MainClient from "./MainClient";

export default function Home() {
  // All data fetched server-side — zero client loading state
  const units        = getUnits();
  const papers       = getPYQPapers();
  const sheets       = getCheatSheets();
  const overview     = getOverview();
  const stats        = getQuestionStats();
  const repeated     = getMostRepeatedQuestions();
  const important    = getImportantQuestions();

  return (
    <MainClient
      units={units}
      papers={papers}
      sheets={sheets}
      overview={overview}
      stats={stats}
      repeated={repeated}
      important={important}
    />
  );
}
