package com.mandalateu.dashboard.dto

import java.time.LocalDate

data class StreakResponse(
    val currentStreak: Int,
    val bestStreak: Int,
    val lastCompletedDate: LocalDate?
)
