package com.mandalateu.common.exception

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.service.AuthService
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.mandalart.service.MandalartService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class GlobalExceptionHandlerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider

    @MockitoBean lateinit var authService: AuthService
    @MockitoBean lateinit var mandalartService: MandalartService

    private val userId = 1L
    private lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(userId)
    }

    // ───────────── 400 Bad Request ─────────────

    @Test
    fun `400 - @Valid 검증 실패 시 VALIDATION_FAILED 코드와 fieldErrors가 반환된다`() {
        val invalidRequest = SignupRequest(email = "not-an-email", password = "short", nickname = "a")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(invalidRequest)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.code") { value("VALIDATION_FAILED") }
            jsonPath("$.message") { value("입력값이 올바르지 않습니다.") }
            jsonPath("$.fieldErrors") { isArray() }
            jsonPath("$.timestamp") { isNotEmpty() }
        }
    }

    @Test
    fun `400 - fieldErrors에 잘못된 필드명이 포함된다`() {
        val invalidRequest = mapOf("email" to "", "password" to "password123", "nickname" to "닉네임")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(invalidRequest)
        }.andExpect {
            status { isBadRequest() }
            jsonPath("$.fieldErrors[?(@.field == 'email')]") { isNotEmpty() }
        }
    }

    // ───────────── 404 Not Found ─────────────

    @Test
    fun `404 - EntityNotFoundException 발생 시 NOT_FOUND 코드가 반환된다`() {
        given(mandalartService.getDetail(any(), any()))
            .willThrow(EntityNotFoundException("만다라트를 찾을 수 없습니다."))

        mockMvc.get("/api/v1/mandalarts/99999") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isNotFound() }
            jsonPath("$.code") { value("NOT_FOUND") }
            jsonPath("$.message") { value("만다라트를 찾을 수 없습니다.") }
            jsonPath("$.timestamp") { isNotEmpty() }
        }
    }

    // ───────────── 403 Forbidden ─────────────

    @Test
    fun `403 - ForbiddenException 발생 시 FORBIDDEN 코드가 반환된다`() {
        given(mandalartService.getDetail(any(), any()))
            .willThrow(ForbiddenException("접근 권한이 없습니다."))

        mockMvc.get("/api/v1/mandalarts/1") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isForbidden() }
            jsonPath("$.code") { value("FORBIDDEN") }
            jsonPath("$.message") { value("접근 권한이 없습니다.") }
        }
    }

    // ───────────── 409 Conflict ─────────────

    @Test
    fun `409 - DuplicateEmailException 발생 시 DUPLICATE_EMAIL 코드가 반환된다`() {
        given(authService.signup(any()))
            .willThrow(DuplicateEmailException("이미 사용 중인 이메일입니다: test@test.com"))

        val request = SignupRequest(email = "test@test.com", password = "password123", nickname = "테스트")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isConflict() }
            jsonPath("$.code") { value("DUPLICATE_EMAIL") }
            jsonPath("$.message") { value("이미 사용 중인 이메일입니다: test@test.com") }
        }
    }

    // ───────────── 500 Internal Server Error ─────────────

    @Test
    fun `500 - 처리되지 않은 예외 발생 시 INTERNAL_SERVER_ERROR 코드가 반환된다`() {
        given(mandalartService.getDetail(any(), any()))
            .willThrow(RuntimeException("예상치 못한 오류"))

        mockMvc.get("/api/v1/mandalarts/1") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isInternalServerError() }
            jsonPath("$.code") { value("INTERNAL_SERVER_ERROR") }
            jsonPath("$.message") { value("서버 오류가 발생했습니다.") }
        }
    }
}
