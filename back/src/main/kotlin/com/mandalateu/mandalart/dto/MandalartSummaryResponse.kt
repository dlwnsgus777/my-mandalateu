package com.mandalateu.mandalart.dto

import java.time.LocalDateTime

data class MandalartSummaryResponse(
    val id: Long,
    val title: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
