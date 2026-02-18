package com.mandalateu.dashboard.dto

import java.time.LocalDate

enum class DeadlineStatus { TODAY, TOMORROW, SOON }

data class DeadlineResponse(
    val actionItemId: Long,
    val title: String,
    val strategyTitle: String,
    val deadline: LocalDate,
    val status: DeadlineStatus
)
