package com.mandalateu.dashboard.dto

data class SummaryResponse(
    val totalCount: Int,
    val completedCount: Int,
    val completionRate: Double,
    val strategyStats: List<StrategyStatDto>
) {
    data class StrategyStatDto(
        val strategyId: Long,
        val strategyTitle: String,
        val totalCount: Int,
        val completedCount: Int,
        val completionRate: Double
    )
}
