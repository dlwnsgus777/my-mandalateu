package com.mandalateu.strategy.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.strategy.dto.StrategyResponse
import com.mandalateu.strategy.dto.StrategyUpdateRequest
import com.mandalateu.strategy.service.StrategyService
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
import org.springframework.test.web.servlet.patch

@SpringBootTest
@AutoConfigureMockMvc
class StrategyControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider
    @MockitoBean lateinit var strategyService: StrategyService

    private val userId = 1L
    private lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(userId)
    }

    @Test
    fun `update - 인증된 요청이면 200과 StrategyResponse를 반환한다`() {
        val request = StrategyUpdateRequest(title = "새 전략", color = "#FF0000", notes = "메모")
        val response = StrategyResponse(id = 1L, position = 0, title = "새 전략", color = "#FF0000", notes = "메모")
        given(strategyService.update(eq(userId), eq(1L), eq(1L), any())).willReturn(response)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { value(1L) }
            jsonPath("$.title") { value("새 전략") }
            jsonPath("$.color") { value("#FF0000") }
        }
    }

    @Test
    fun `update - 인증 없이 요청하면 401을 반환한다`() {
        val request = StrategyUpdateRequest(title = "새 전략", color = null, notes = null)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect { status { isUnauthorized() } }
    }

    @Test
    fun `update - 모든 필드가 null이어도 요청이 가능하다`() {
        val request = StrategyUpdateRequest(title = null, color = null, notes = null)
        val response = StrategyResponse(id = 1L, position = 0, title = "기존 제목", color = null, notes = null)
        given(strategyService.update(eq(userId), eq(1L), eq(1L), any())).willReturn(response)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.title") { value("기존 제목") }
        }
    }
}
