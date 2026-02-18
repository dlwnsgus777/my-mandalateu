package com.mandalateu.actionitem.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class ActionItemResponse(
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
