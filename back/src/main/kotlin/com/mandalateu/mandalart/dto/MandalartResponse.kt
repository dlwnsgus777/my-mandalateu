package com.mandalateu.mandalart.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class MandalartResponse(
    val id: Long,
    val title: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val strategies: List<StrategyDto>
) {
    data class StrategyDto(
        val id: Long,
        val position: Int,
        val title: String,
        val color: String?,
        val notes: String?,
        val actionItems: List<ActionItemDto>
    )

    data class ActionItemDto(
        val id: Long,
        val position: Int,
        val isCenter: Boolean,
        val title: String,
        val description: String?,
        val completed: Boolean,
        val completedAt: LocalDateTime?,
        val deadline: LocalDate?,
        val priority: String?
    )
}
