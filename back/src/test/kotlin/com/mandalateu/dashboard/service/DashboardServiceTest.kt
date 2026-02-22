package com.mandalateu.dashboard.service

import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.service.MandalartService
import com.mandalateu.strategy.repository.StrategyRepository
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@SpringBootTest
@Transactional
class DashboardServiceTest {

    @Autowired lateinit var dashboardService: DashboardService
    @Autowired lateinit var mandalartService: MandalartService
    @Autowired lateinit var strategyRepository: StrategyRepository
    @Autowired lateinit var actionItemRepository: ActionItemRepository
    @Autowired lateinit var userRepository: UserRepository

    private var userId: Long = 0L
    private var otherUserId: Long = 0L
    private var mandalartId: Long = 0L

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
        userId = userRepository.save(User(email = "owner@test.com", nickname = "소유자", provider = "google", providerId = "sub-owner")).id
        otherUserId = userRepository.save(User(email = "other@test.com", nickname = "다른유저", provider = "google", providerId = "sub-other")).id

        val mandalart = mandalartService.create(userId, MandalartCreateRequest("목표", "핵심"))
        mandalartId = mandalart.id
    }

    // ───────────── getSummary ─────────────

    @Test
    fun `getSummary - 완료 항목이 없으면 completionRate는 0이다`() {
        val summary = dashboardService.getSummary(userId, mandalartId)

        assertThat(summary.totalCount).isEqualTo(81)
        assertThat(summary.completedCount).isEqualTo(0)
        assertThat(summary.completionRate).isEqualTo(0.0)
        assertThat(summary.strategyStats).hasSize(9)
    }

    @Test
    fun `getSummary - 일부 완료 시 completionRate가 올바르게 계산된다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        // 비중심 아이템 중 9개 완료 처리 (전체 72개 중 9개 = 12.5%)
        items.take(9).forEach { it.completed = true; it.completedAt = LocalDateTime.now() }

        val summary = dashboardService.getSummary(userId, mandalartId)

        assertThat(summary.completedCount).isEqualTo(9)
        assertThat(summary.completionRate).isGreaterThan(0.0)
    }

    @Test
    fun `getSummary - 다른 유저의 만다라트 조회 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            dashboardService.getSummary(otherUserId, mandalartId)
        }
    }

    @Test
    fun `getSummary - strategyStats에 각 전략별 통계가 포함된다`() {
        val summary = dashboardService.getSummary(userId, mandalartId)

        assertThat(summary.strategyStats).allSatisfy { stat ->
            assertThat(stat.totalCount).isEqualTo(9)
            assertThat(stat.completedCount).isEqualTo(0)
        }
    }

    // ───────────── getWeeklyStats ─────────────

    @Test
    fun `getWeeklyStats - 완료 항목이 없으면 thisWeekTotal은 0이다`() {
        val weekly = dashboardService.getWeeklyStats(userId, mandalartId)

        assertThat(weekly.thisWeekTotal).isEqualTo(0)
        assertThat(weekly.lastWeekTotal).isEqualTo(0)
        assertThat(weekly.changeRate).isEqualTo(0.0)
        assertThat(weekly.dailyStats).hasSize(7)
    }

    @Test
    fun `getWeeklyStats - 이번 주 완료 항목이 반영된다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        items.take(3).forEach {
            it.completed = true
            it.completedAt = LocalDateTime.now() // 오늘 = 이번 주
        }

        val weekly = dashboardService.getWeeklyStats(userId, mandalartId)

        assertThat(weekly.thisWeekTotal).isEqualTo(3)
    }

    @Test
    fun `getWeeklyStats - dailyStats의 dayOfWeek가 한글로 반환된다`() {
        val weekly = dashboardService.getWeeklyStats(userId, mandalartId)
        val dayNames = setOf("월", "화", "수", "목", "금", "토", "일")

        assertThat(weekly.dailyStats.map { it.dayOfWeek }).allMatch { it in dayNames }
    }

    @Test
    fun `getWeeklyStats - lastWeekTotal이 0이고 thisWeekTotal이 양수이면 changeRate는 100이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        items.first().let {
            it.completed = true
            it.completedAt = LocalDateTime.now()
        }

        val weekly = dashboardService.getWeeklyStats(userId, mandalartId)

        assertThat(weekly.changeRate).isEqualTo(100.0)
    }

    @Test
    fun `getWeeklyStats - 다른 유저의 만다라트 조회 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            dashboardService.getWeeklyStats(otherUserId, mandalartId)
        }
    }

    // ───────────── getStreak ─────────────

    @Test
    fun `getStreak - 완료 항목이 없으면 currentStreak과 bestStreak은 0이다`() {
        val streak = dashboardService.getStreak(userId, mandalartId)

        assertThat(streak.currentStreak).isEqualTo(0)
        assertThat(streak.bestStreak).isEqualTo(0)
        assertThat(streak.lastCompletedDate).isNull()
    }

    @Test
    fun `getStreak - 오늘 완료 항목이 있으면 currentStreak은 1 이상이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        items.first().let {
            it.completed = true
            it.completedAt = LocalDateTime.now()
        }

        val streak = dashboardService.getStreak(userId, mandalartId)

        assertThat(streak.currentStreak).isGreaterThanOrEqualTo(1)
        assertThat(streak.lastCompletedDate).isEqualTo(LocalDate.now())
    }

    @Test
    fun `getStreak - 연속 3일 완료 시 currentStreak은 3이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        val today = LocalDate.now()

        items[0].let { it.completed = true; it.completedAt = today.atStartOfDay() }
        items[1].let { it.completed = true; it.completedAt = today.minusDays(1).atStartOfDay() }
        items[2].let { it.completed = true; it.completedAt = today.minusDays(2).atStartOfDay() }

        val streak = dashboardService.getStreak(userId, mandalartId)

        assertThat(streak.currentStreak).isEqualTo(3)
        assertThat(streak.bestStreak).isGreaterThanOrEqualTo(3)
    }

    @Test
    fun `getStreak - 다른 유저의 만다라트 조회 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            dashboardService.getStreak(otherUserId, mandalartId)
        }
    }

    // ───────────── getDeadlines ─────────────

    @Test
    fun `getDeadlines - 마감일이 없으면 빈 목록이 반환된다`() {
        val deadlines = dashboardService.getDeadlines(userId, mandalartId)
        assertThat(deadlines).isEmpty()
    }

    @Test
    fun `getDeadlines - 오늘 마감인 항목은 TODAY 상태이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val item = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }.first()
        item.deadline = LocalDate.now()

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).hasSize(1)
        assertThat(deadlines[0].status.name).isEqualTo("TODAY")
    }

    @Test
    fun `getDeadlines - 내일 마감인 항목은 TOMORROW 상태이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val item = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }.first()
        item.deadline = LocalDate.now().plusDays(1)

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).hasSize(1)
        assertThat(deadlines[0].status.name).isEqualTo("TOMORROW")
    }

    @Test
    fun `getDeadlines - 2일 이후 마감인 항목은 SOON 상태이다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val item = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }.first()
        item.deadline = LocalDate.now().plusDays(5)

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).hasSize(1)
        assertThat(deadlines[0].status.name).isEqualTo("SOON")
    }

    @Test
    fun `getDeadlines - 완료된 항목은 반환하지 않는다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val item = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }.first()
        item.deadline = LocalDate.now()
        item.completed = true
        item.completedAt = LocalDateTime.now()

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).isEmpty()
    }

    @Test
    fun `getDeadlines - 마감일이 지난 항목은 반환하지 않는다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val item = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }.first()
        item.deadline = LocalDate.now().minusDays(1)

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).isEmpty()
    }

    @Test
    fun `getDeadlines - 마감일 오름차순으로 정렬된다`() {
        val strategyIds = strategyRepository.findAllByMandalartId(mandalartId).map { it.id }
        val items = actionItemRepository.findAllByStrategyIdIn(strategyIds).filter { !it.isCenter }
        items[0].deadline = LocalDate.now().plusDays(5)
        items[1].deadline = LocalDate.now()
        items[2].deadline = LocalDate.now().plusDays(1)

        val deadlines = dashboardService.getDeadlines(userId, mandalartId)

        assertThat(deadlines).hasSize(3)
        assertThat(deadlines[0].deadline).isEqualTo(LocalDate.now())
        assertThat(deadlines[1].deadline).isEqualTo(LocalDate.now().plusDays(1))
        assertThat(deadlines[2].deadline).isEqualTo(LocalDate.now().plusDays(5))
    }

    @Test
    fun `getDeadlines - 다른 유저의 만다라트 조회 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            dashboardService.getDeadlines(otherUserId, mandalartId)
        }
    }
}
