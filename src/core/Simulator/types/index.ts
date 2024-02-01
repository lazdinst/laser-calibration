export interface OutputType {
  timestamp: Date;
  output: number;
  error: number;
  integral: number;
  derivative: number;
}

export interface PlotType {
  name: string;
  plot: string;
}
