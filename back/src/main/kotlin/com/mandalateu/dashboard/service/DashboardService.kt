package com.mandalateu.dashboard.service

import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.dashboard.dto.DeadlineResponse
import com.mandalateu.dashboard.dto.DeadlineStatus
import com.mandalateu.dashboard.dto.StreakResponse
import com.mandalateu.dashboard.dto.SummaryResponse
import com.mandalateu.dashboard.dto.WeeklyStatsResponse
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.repository.StrategyRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.DayOfWeek
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class DashboardService(
    private val mandalartRepository: MandalartRepository,
    private val strategyRepository: StrategyRepository,
    private val actionItemRepository: ActionItemRepository
) {
    fun getSummary(userId: Long, mandalartId: Long): SummaryResponse {
        verifyOwnership(userId, mandalartId)

        val strategies = strategyRepository.findAllByMandalartId(mandalartId)
        val strategyIds = strategies.map { it.id }
        val actionItems = actionItemRepository.findAllByStrategyIdIn(strategyIds)

        val itemsByStrategyId = actionItems.groupBy { it.strategy.id }

        val strategyStats = strategies.map { strategy ->
            val items = itemsByStrategyId[strategy.id] ?: emptyList()
            val total = items.size
            val completed = items.count { it.completed }
            SummaryResponse.StrategyStatDto(
                strategyId = strategy.id,
                strategyTitle = strategy.title,
                totalCount = total,
                completedCount = completed,
                completionRate = if (total > 0) completed.toDouble() / total * 100.0 else 0.0
            )
        }

        val total = actionItems.size
        val completed = actionItems.count { it.completed }
        return SummaryResponse(
            totalCount = total,
            completedCount = completed,
            completionRate = if (total > 0) completed.toDouble() / total * 100.0 else 0.0,
            strategyStats = strategyStats
        )
    }

    fun getWeeklyStats(userId: Long, mandalartId: Long): WeeklyStatsResponse {
        verifyOwnership(userId, mandalartId)

        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val today = LocalDate.now()
        val thisMonday = today.with(DayOfWeek.MONDAY)
        val lastMonday = thisMonday.minusWeeks(1)

        val thisWeekItems = actionItemRepository.findAllByStrategyIdInAndCompletedAtBetween(
            strategyIds,
            thisMonday.atStartOfDay(),
            thisMonday.plusDays(6).atTime(23, 59, 59)
        )
        val lastWeekItems = actionItemRepository.findAllByStrategyIdInAndCompletedAtBetween(
            strategyIds,
            lastMonday.atStartOfDay(),
            lastMonday.plusDays(6).atTime(23, 59, 59)
        )

        val dailyMap = thisWeekItems.groupBy { it.completedAt!!.toLocalDate() }.mapValues { it.value.size }
        val dayNames = mapOf(
            DayOfWeek.MONDAY to "월", DayOfWeek.TUESDAY to "화", DayOfWeek.WEDNESDAY to "수",
            DayOfWeek.THURSDAY to "목", DayOfWeek.FRIDAY to "금",
            DayOfWeek.SATURDAY to "토", DayOfWeek.SUNDAY to "일"
        )

        val dailyStats = (0L..6L).map { offset ->
            val date = thisMonday.plusDays(offset)
            WeeklyStatsResponse.DailyStatDto(
                date = date,
                dayOfWeek = dayNames[date.dayOfWeek]!!,
                completedCount = dailyMap[date] ?: 0
            )
        }

        val thisWeekTotal = thisWeekItems.size
        val lastWeekTotal = lastWeekItems.size
        val changeRate = when {
            lastWeekTotal > 0 -> (thisWeekTotal - lastWeekTotal).toDouble() / lastWeekTotal * 100.0
            thisWeekTotal > 0 -> 100.0
            else -> 0.0
        }

        return WeeklyStatsResponse(
            weekRange = "$thisMonday ~ ${thisMonday.plusDays(6)}",
            dailyStats = dailyStats,
            thisWeekTotal = thisWeekTotal,
            lastWeekTotal = lastWeekTotal,
            changeRate = changeRate
        )
    }

    fun getStreak(userId: Long, mandalartId: Long): StreakResponse {
        verifyOwnership(userId, mandalartId)

        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val completedDates = actionItemRepository.findAllByStrategyIdInAndCompletedTrue(strategyIds)
            .mapNotNull { it.completedAt?.toLocalDate() }
            .toSortedSet()

        if (completedDates.isEmpty()) {
            return StreakResponse(currentStreak = 0, bestStreak = 0, lastCompletedDate = null)
        }

        val today = LocalDate.now()

        var currentStreak = 0
        var checkDate = today
        while (completedDates.contains(checkDate)) {
            currentStreak++
            checkDate = checkDate.minusDays(1)
        }

        val sortedList = completedDates.toList()
        var bestStreak = 1
        var streak = 1
        for (i in 1 until sortedList.size) {
            streak = if (sortedList[i] == sortedList[i - 1].plusDays(1)) streak + 1 else 1
            if (streak > bestStreak) bestStreak = streak
        }
        bestStreak = maxOf(bestStreak, currentStreak)

        return StreakResponse(
            currentStreak = currentStreak,
            bestStreak = bestStreak,
            lastCompletedDate = completedDates.last()
        )
    }

    fun getDeadlines(userId: Long, mandalartId: Long): List<DeadlineResponse> {
        verifyOwnership(userId, mandalartId)

        val strategies = strategyRepository.findAllByMandalartId(mandalartId)
        val strategyTitleMap = strategies.associateBy({ it.id }, { it.title })
        val strategyIds = strategies.map { it.id }
        val today = LocalDate.now()

        return actionItemRepository.findAllByStrategyIdInAndDeadlineIsNotNull(strategyIds)
            .filter { !it.completed && it.deadline!! >= today }
            .sortedBy { it.deadline }
            .map { item ->
                val status = when (item.deadline) {
                    today -> DeadlineStatus.TODAY
                    today.plusDays(1) -> DeadlineStatus.TOMORROW
                    else -> DeadlineStatus.SOON
                }
                DeadlineResponse(
                    actionItemId = item.id,
                    title = item.title,
                    strategyTitle = strategyTitleMap[item.strategy.id] ?: "",
                    deadline = item.deadline!!,
                    status = status
                )
            }
    }

    private fun verifyOwnership(userId: Long, mandalartId: Long) {
        val mandalart = mandalartRepository.findById(mandalartId)
            .orElseThrow { EntityNotFoundException("만다라트를 찾을 수 없습니다.") }
        if (mandalart.user.id != userId) throw ForbiddenException("접근 권한이 없습니다.")
    }
}
