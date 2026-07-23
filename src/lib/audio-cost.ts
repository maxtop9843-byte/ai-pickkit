export type AudioMode = "stt" | "tts";

export type AudioPriceOption = {
  id: string;
  mode: AudioMode;
  provider: "Google Cloud";
  model: string;
  unitLabel: string;
  pricePerUnitUsd: number;
  note: string;
  sourceUrl: string;
  verifiedAt: string;
};

const speechToTextSource = "https://cloud.google.com/speech-to-text/pricing";
const textToSpeechSource = "https://cloud.google.com/text-to-speech/pricing";

export const audioPriceOptions: AudioPriceOption[] = [
  {
    id: "google-stt-v2-standard",
    mode: "stt",
    provider: "Google Cloud",
    model: "Speech-to-Text V2 Standard",
    unitLabel: "오디오 1분",
    pricePerUnitUsd: 0.016,
    note: "월 50만 분 이하 표준 인식 구간의 공식 분당 단가입니다.",
    sourceUrl: speechToTextSource,
    verifiedAt: "2026-07-24",
  },
  {
    id: "google-tts-standard",
    mode: "tts",
    provider: "Google Cloud",
    model: "Standard voice",
    unitLabel: "문자 1개",
    pricePerUnitUsd: 0.000004,
    note: "무료 사용량을 제외한 공식 문자당 단가입니다.",
    sourceUrl: textToSpeechSource,
    verifiedAt: "2026-07-24",
  },
  {
    id: "google-tts-neural2",
    mode: "tts",
    provider: "Google Cloud",
    model: "Neural2 voice",
    unitLabel: "문자 1개",
    pricePerUnitUsd: 0.000016,
    note: "자연스러운 합성 음성을 위한 공식 문자당 단가입니다.",
    sourceUrl: textToSpeechSource,
    verifiedAt: "2026-07-24",
  },
  {
    id: "google-tts-chirp3-hd",
    mode: "tts",
    provider: "Google Cloud",
    model: "Chirp 3 HD voice",
    unitLabel: "문자 1개",
    pricePerUnitUsd: 0.00003,
    note: "고품질 음성 합성을 위한 공식 문자당 단가입니다.",
    sourceUrl: textToSpeechSource,
    verifiedAt: "2026-07-24",
  },
];

export function calculateAudioCost(
  option: AudioPriceOption,
  amountPerDay: number,
  daysPerMonth: number,
) {
  const safeAmount = Math.max(0, amountPerDay);
  const safeDays = Math.min(31, Math.max(1, daysPerMonth));
  const dailyUsd = option.pricePerUnitUsd * safeAmount;

  return {
    dailyUsd,
    monthlyUsd: dailyUsd * safeDays,
    monthlyAmount: safeAmount * safeDays,
  };
}
