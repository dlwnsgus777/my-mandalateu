package com.mandalateu.auth.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.dto.UserInfo
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.auth.service.AuthService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.mockito.kotlin.willDoNothing
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider

    @MockitoBean
    lateinit var authService: AuthService

    private lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(1L)
    }

    // ───────────── POST /api/v1/auth/google ─────────────

    @Test
    fun `googleLogin - 정상 요청이면 200과 TokenResponse를 반환한다`() {
        val request = GoogleLoginRequest(idToken = "valid-google-id-token")
        val response = TokenResponse(accessToken = "access-token", refreshToken = "refresh-token", user = UserInfo(id = 1L, email = "test@test.com", nickname = "테스터"))
        given(authService.loginWithGoogle(any())).willReturn(response)

        mockMvc.post("/api/v1/auth/google") {
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
    fun `googleLogin - idToken이 빈 값이면 400을 반환한다`() {
        mockMvc.post("/api/v1/auth/google") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("idToken" to ""))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `googleLogin - idToken 필드가 없으면 400을 반환한다`() {
        mockMvc.post("/api/v1/auth/google") {
            contentType = MediaType.APPLICATION_JSON
            content = "{}"
        }.andExpect {
            status { isBadRequest() }
        }
    }

    // ───────────── POST /api/v1/auth/refresh ─────────────

    @Test
    fun `refresh - 정상 요청이면 200과 새 TokenResponse를 반환한다`() {
        val request = RefreshRequest(refreshToken = "valid-refresh-token")
        val response = TokenResponse(accessToken = "new-access-token", refreshToken = "new-refresh-token", user = UserInfo(id = 1L, email = "test@test.com", nickname = "테스터"))
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
        mockMvc.post("/api/v1/auth/refresh") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("refreshToken" to ""))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    // ───────────── POST /api/v1/auth/logout ─────────────

    @Test
    fun `logout - 인증된 요청이면 204를 반환한다`() {
        given(authService.logout(any())).willDoNothing()

        mockMvc.post("/api/v1/auth/logout") {
            header("Authorization", "Bearer $accessToken")
        }.andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `logout - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.post("/api/v1/auth/logout") {
        }.andExpect {
            status { isUnauthorized() }
        }
    }
}
