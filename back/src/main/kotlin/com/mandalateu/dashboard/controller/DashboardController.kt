package com.mandalateu.dashboard.controller

import com.mandalateu.dashboard.dto.DeadlineResponse
import com.mandalateu.dashboard.dto.StreakResponse
import com.mandalateu.dashboard.dto.SummaryResponse
import com.mandalateu.dashboard.dto.WeeklyStatsResponse
import com.mandalateu.dashboard.service.DashboardService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/mandalarts/{mandalartId}/dashboard")
class DashboardController(
    private val dashboardService: DashboardService
) {
    private val Authentication.userId: Long get() = principal as Long

    @GetMapping("/summary")
    fun getSummary(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ): SummaryResponse = dashboardService.getSummary(authentication.userId, mandalartId)

    @GetMapping("/weekly")
    fun getWeeklyStats(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ): WeeklyStatsResponse = dashboardService.getWeeklyStats(authentication.userId, mandalartId)

    @GetMapping("/streak")
    fun getStreak(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ): StreakResponse = dashboardService.getStreak(authentication.userId, mandalartId)

    @GetMapping("/deadlines")
    fun getDeadlines(
        authentication: Authentication,
        @PathVariable mandalartId: Long
    ): List<DeadlineResponse> = dashboardService.getDeadlines(authentication.userId, mandalartId)
}
