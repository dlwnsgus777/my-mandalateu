package com.mandalateu.auth.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.dto.LoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.dto.SignupResponse
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.service.AuthService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@WebMvcTest(
    controllers = [AuthController::class],
    excludeAutoConfiguration = [SecurityAutoConfiguration::class]
)
class AuthControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @MockitoBean
    lateinit var authService: AuthService

    // ───────────── POST /api/v1/auth/signup ─────────────

    @Test
    fun `signup - 정상 요청이면 201과 SignupResponse를 반환한다`() {
        val request = SignupRequest(email = "new@test.com", password = "password123", nickname = "유저")
        val response = SignupResponse(id = 1L, email = "new@test.com", nickname = "유저")
        given(authService.signup(any())).willReturn(response)

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.id") { value(1L) }
            jsonPath("$.email") { value("new@test.com") }
            jsonPath("$.nickname") { value("유저") }
        }
    }

    @Test
    fun `signup - 이메일 형식이 잘못되면 400을 반환한다`() {
        val request = mapOf("email" to "invalid-email", "password" to "password123", "nickname" to "유저")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `signup - 비밀번호가 8자 미만이면 400을 반환한다`() {
        val request = mapOf("email" to "test@test.com", "password" to "short", "nickname" to "유저")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `signup - 필수 필드가 빠지면 400을 반환한다`() {
        val request = mapOf("email" to "test@test.com")

        mockMvc.post("/api/v1/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    // ───────────── POST /api/v1/auth/login ─────────────

    @Test
    fun `login - 정상 요청이면 200과 TokenResponse를 반환한다`() {
        val request = LoginRequest(email = "test@test.com", password = "password123")
        val response = TokenResponse(accessToken = "access-token", refreshToken = "refresh-token")
        given(authService.login(any())).willReturn(response)

        mockMvc.post("/api/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { value("access-token") }
            jsonPath("$.refreshToken") { value("refresh-token") }
            jsonPath("$.tokenType") { value("Bearer") }
        }
    }

    @Test
    fun `login - 이메일이 빈 값이면 400을 반환한다`() {
        val request = mapOf("email" to "", "password" to "password123")

        mockMvc.post("/api/v1/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    // ───────────── POST /api/v1/auth/refresh ─────────────

    @Test
    fun `refresh - 정상 요청이면 200과 새 TokenResponse를 반환한다`() {
        val request = RefreshRequest(refreshToken = "valid-refresh-token")
        val response = TokenResponse(accessToken = "new-access-token", refreshToken = "new-refresh-token")
        given(authService.refresh(any())).willReturn(response)

        mockMvc.post("/api/v1/auth/refresh") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { value("new-access-token") }
            jsonPath("$.refreshToken") { value("new-refresh-token") }
        }
    }

    @Test
    fun `refresh - refreshToken이 빈 값이면 400을 반환한다`() {
        val request = mapOf("refreshToken" to "")

        mockMvc.post("/api/v1/auth/refresh") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }
}
