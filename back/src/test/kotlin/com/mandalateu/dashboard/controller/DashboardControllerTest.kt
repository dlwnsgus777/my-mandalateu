package com.mandalateu.dashboard.controller

import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.dashboard.dto.DeadlineResponse
import com.mandalateu.dashboard.dto.DeadlineStatus
import com.mandalateu.dashboard.dto.StreakResponse
import com.mandalateu.dashboard.dto.SummaryResponse
import com.mandalateu.dashboard.dto.WeeklyStatsResponse
import com.mandalateu.dashboard.service.DashboardService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.eq
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import java.time.LocalDate

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var jwtProvider: JwtProvider
    @MockitoBean lateinit var dashboardService: DashboardService

    private val userId = 1L
    private val mandalartId = 1L
    private lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(userId)
    }

    // ───────────── GET /summary ─────────────

    @Test
    fun `getSummary - 인증된 요청이면 200과 SummaryResponse를 반환한다`() {
        val response = SummaryResponse(
            totalCount = 81,
            completedCount = 10,
            completionRate = 12.35,
            strategyStats = listOf(
                SummaryResponse.StrategyStatDto(1L, "전략1", 9, 2, 22.22)
            )
        )
        given(dashboardService.getSummary(eq(userId), eq(mandalartId))).willReturn(response)

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/summary") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.totalCount") { value(81) }
            jsonPath("$.completedCount") { value(10) }
            jsonPath("$.completionRate") { value(12.35) }
            jsonPath("$.strategyStats[0].strategyTitle") { value("전략1") }
        }
    }

    @Test
    fun `getSummary - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/summary")
            .andExpect { status { isUnauthorized() } }
    }

    // ───────────── GET /weekly ─────────────

    @Test
    fun `getWeeklyStats - 인증된 요청이면 200과 WeeklyStatsResponse를 반환한다`() {
        val today = LocalDate.now()
        val response = WeeklyStatsResponse(
            weekRange = "2026-02-16 ~ 2026-02-22",
            dailyStats = (0L..6L).map { offset ->
                WeeklyStatsResponse.DailyStatDto(
                    date = today.plusDays(offset),
                    dayOfWeek = listOf("월", "화", "수", "목", "금", "토", "일")[offset.toInt()],
                    completedCount = offset.toInt()
                )
            },
            thisWeekTotal = 21,
            lastWeekTotal = 15,
            changeRate = 40.0
        )
        given(dashboardService.getWeeklyStats(eq(userId), eq(mandalartId))).willReturn(response)

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/weekly") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.thisWeekTotal") { value(21) }
            jsonPath("$.lastWeekTotal") { value(15) }
            jsonPath("$.changeRate") { value(40.0) }
            jsonPath("$.dailyStats.length()") { value(7) }
        }
    }

    @Test
    fun `getWeeklyStats - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/weekly")
            .andExpect { status { isUnauthorized() } }
    }

    // ───────────── GET /streak ─────────────

    @Test
    fun `getStreak - 인증된 요청이면 200과 StreakResponse를 반환한다`() {
        val response = StreakResponse(
            currentStreak = 5,
            bestStreak = 10,
            lastCompletedDate = LocalDate.now()
        )
        given(dashboardService.getStreak(eq(userId), eq(mandalartId))).willReturn(response)

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/streak") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.currentStreak") { value(5) }
            jsonPath("$.bestStreak") { value(10) }
            jsonPath("$.lastCompletedDate") { isNotEmpty() }
        }
    }

    @Test
    fun `getStreak - 완료 이력이 없으면 streak은 0이고 lastCompletedDate는 null이다`() {
        val response = StreakResponse(currentStreak = 0, bestStreak = 0, lastCompletedDate = null)
        given(dashboardService.getStreak(eq(userId), eq(mandalartId))).willReturn(response)

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/streak") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.currentStreak") { value(0) }
            jsonPath("$.bestStreak") { value(0) }
            jsonPath("$.lastCompletedDate") { value(null) }
        }
    }

    @Test
    fun `getStreak - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/streak")
            .andExpect { status { isUnauthorized() } }
    }

    // ───────────── GET /deadlines ─────────────

    @Test
    fun `getDeadlines - 인증된 요청이면 200과 DeadlineResponse 목록을 반환한다`() {
        val response = listOf(
            DeadlineResponse(
                actionItemId = 1L,
                title = "오늘 할 일",
                strategyTitle = "전략1",
                deadline = LocalDate.now(),
                status = DeadlineStatus.TODAY
            ),
            DeadlineResponse(
                actionItemId = 2L,
                title = "내일 할 일",
                strategyTitle = "전략1",
                deadline = LocalDate.now().plusDays(1),
                status = DeadlineStatus.TOMORROW
            )
        )
        given(dashboardService.getDeadlines(eq(userId), eq(mandalartId))).willReturn(response)

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/deadlines") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(2) }
            jsonPath("$[0].title") { value("오늘 할 일") }
            jsonPath("$[0].status") { value("TODAY") }
            jsonPath("$[1].status") { value("TOMORROW") }
        }
    }

    @Test
    fun `getDeadlines - 마감 항목이 없으면 빈 배열이 반환된다`() {
        given(dashboardService.getDeadlines(eq(userId), eq(mandalartId))).willReturn(emptyList())

        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/deadlines") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(0) }
        }
    }

    @Test
    fun `getDeadlines - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.get("/api/v1/mandalarts/$mandalartId/dashboard/deadlines")
            .andExpect { status { isUnauthorized() } }
    }
}
