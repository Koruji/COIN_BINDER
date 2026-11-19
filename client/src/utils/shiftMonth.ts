type periodFormat = {
    year: number,
    month: number
}

export function shiftMonth(period: periodFormat, delta: number): periodFormat {
    const index = period.year * 12 + period.month + delta;
    return { month: ((index % 12) + 12) % 12, year: Math.floor(index / 12) };
}