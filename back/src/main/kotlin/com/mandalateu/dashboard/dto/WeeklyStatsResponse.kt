package com.mandalateu.dashboard.dto

import java.time.LocalDate

data class WeeklyStatsResponse(
    val weekRange: String,
    val dailyStats: List<DailyStatDto>,
    val thisWeekTotal: Int,
    val lastWeekTotal: Int,
    val changeRate: Double
) {
    data class DailyStatDto(
        val date: LocalDate,
        val dayOfWeek: String,
        val completedCount: Int
    )
}
