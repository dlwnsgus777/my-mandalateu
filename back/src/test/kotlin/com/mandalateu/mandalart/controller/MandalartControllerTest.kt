package com.mandalateu.mandalart.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.dto.MandalartResponse
import com.mandalateu.mandalart.dto.MandalartSummaryResponse
import com.mandalateu.mandalart.dto.MandalartUpdateRequest
import com.mandalateu.mandalart.service.MandalartService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post
import java.time.LocalDateTime

@SpringBootTest
@AutoConfigureMockMvc
class MandalartControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider
    @MockitoBean lateinit var mandalartService: MandalartService

    private val userId = 1L
    private lateinit var accessToken: String

    private val sampleSummary = MandalartSummaryResponse(
        id = 1L, title = "내 목표",
        createdAt = LocalDateTime.now(), updatedAt = LocalDateTime.now()
    )
    private val sampleResponse = MandalartResponse(
        id = 1L, title = "내 목표",
        createdAt = LocalDateTime.now(), updatedAt = LocalDateTime.now(),
        strategies = emptyList()
    )

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(userId)
    }

    // ───────────── GET /api/v1/mandalarts ─────────────

    @Test
    fun `getList - 인증된 요청이면 200과 목록을 반환한다`() {
        given(mandalartService.getList(userId)).willReturn(listOf(sampleSummary))

        mockMvc.get("/api/v1/mandalarts") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$[0].id") { value(1L) }
            jsonPath("$[0].title") { value("내 목표") }
        }
    }

    @Test
    fun `getList - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.get("/api/v1/mandalarts")
            .andExpect { status { isUnauthorized() } }
    }

    // ───────────── POST /api/v1/mandalarts ─────────────

    @Test
    fun `create - 정상 요청이면 201과 MandalartResponse를 반환한다`() {
        val request = MandalartCreateRequest(title = "내 목표", coreGoal = "핵심 목표")
        given(mandalartService.create(eq(userId), any())).willReturn(sampleResponse)

        mockMvc.post("/api/v1/mandalarts") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.id") { value(1L) }
            jsonPath("$.title") { value("내 목표") }
        }
    }

    @Test
    fun `create - title이 빈 값이면 400을 반환한다`() {
        val request = mapOf("title" to "", "coreGoal" to "핵심")

        mockMvc.post("/api/v1/mandalarts") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect { status { isBadRequest() } }
    }

    // ───────────── GET /api/v1/mandalarts/{mandalartId} ─────────────

    @Test
    fun `getDetail - 정상 요청이면 200과 상세 정보를 반환한다`() {
        given(mandalartService.getDetail(userId, 1L)).willReturn(sampleResponse)

        mockMvc.get("/api/v1/mandalarts/1") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { value(1L) }
            jsonPath("$.strategies") { isArray() }
        }
    }

    // ───────────── PATCH /api/v1/mandalarts/{mandalartId} ─────────────

    @Test
    fun `update - 정상 요청이면 200과 수정된 정보를 반환한다`() {
        val request = MandalartUpdateRequest(title = "새 제목")
        val updatedResponse = sampleResponse.copy(title = "새 제목")
        given(mandalartService.update(eq(userId), eq(1L), any())).willReturn(updatedResponse)

        mockMvc.patch("/api/v1/mandalarts/1") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.title") { value("새 제목") }
        }
    }

    // ───────────── DELETE /api/v1/mandalarts/{mandalartId} ─────────────

    @Test
    fun `delete - 정상 요청이면 204를 반환한다`() {
        mockMvc.delete("/api/v1/mandalarts/1") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect { status { isNoContent() } }
    }

    @Test
    fun `delete - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.delete("/api/v1/mandalarts/1")
            .andExpect { status { isUnauthorized() } }
    }
}
