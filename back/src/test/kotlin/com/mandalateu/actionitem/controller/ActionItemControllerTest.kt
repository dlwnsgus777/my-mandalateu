package com.mandalateu.actionitem.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.actionitem.domain.Priority
import com.mandalateu.actionitem.dto.ActionItemResponse
import com.mandalateu.actionitem.dto.ActionItemUpdateRequest
import com.mandalateu.actionitem.service.ActionItemService
import com.mandalateu.auth.jwt.JwtProvider
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
import java.time.LocalDate
import java.time.LocalDateTime

@SpringBootTest
@AutoConfigureMockMvc
class ActionItemControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider
    @MockitoBean lateinit var actionItemService: ActionItemService

    private val userId = 1L
    private lateinit var accessToken: String

    private val sampleResponse = ActionItemResponse(
        id = 1L, position = 0, isCenter = false,
        title = "할 일", description = "상세 설명",
        completed = true, completedAt = LocalDateTime.now(),
        deadline = LocalDate.now().plusDays(3), priority = "HIGH"
    )

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(userId)
    }

    @Test
    fun `update - 인증된 요청이면 200과 ActionItemResponse를 반환한다`() {
        val request = ActionItemUpdateRequest(
            title = "할 일", description = "상세 설명",
            completed = true, deadline = LocalDate.now().plusDays(3), priority = Priority.HIGH
        )
        given(actionItemService.update(eq(userId), eq(1L), eq(1L), eq(1L), any()))
            .willReturn(sampleResponse)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1/action-items/1") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { value(1L) }
            jsonPath("$.title") { value("할 일") }
            jsonPath("$.completed") { value(true) }
            jsonPath("$.priority") { value("HIGH") }
        }
    }

    @Test
    fun `update - 인증 없이 요청하면 401을 반환한다`() {
        val request = ActionItemUpdateRequest(null, null, null, null, null)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1/action-items/1") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect { status { isUnauthorized() } }
    }

    @Test
    fun `update - 모든 필드가 null이어도 요청이 가능하다`() {
        val request = ActionItemUpdateRequest(null, null, null, null, null)
        given(actionItemService.update(eq(userId), eq(1L), eq(1L), eq(1L), any()))
            .willReturn(sampleResponse)

        mockMvc.patch("/api/v1/mandalarts/1/strategies/1/action-items/1") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect { status { isOk() } }
    }
}
