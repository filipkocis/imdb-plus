export const FETCH_CACHE_OPTIONS: RequestInit = {
  next: {
    revalidate: 60 * 60 * 24 // 24 hours 
  }
}

export class Requests {
  private requests: number = 0
  private last: number = 0

  constructor(public max: number, public timeframe: number) {}
  
  canRequest() {
    if (this.last + this.timeframe < Date.now()) this.requests = 0;
    this.last = Date.now();
    this.requests++;
    return this.requests <= this.max;
  }
}
