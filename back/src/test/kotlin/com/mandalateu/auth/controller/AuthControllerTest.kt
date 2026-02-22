package com.mandalateu.auth.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.service.AuthService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.given
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

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @MockitoBean
    lateinit var authService: AuthService

    // ───────────── POST /api/v1/auth/google ─────────────

    @Test
    fun `googleLogin - 정상 요청이면 200과 TokenResponse를 반환한다`() {
        val request = GoogleLoginRequest(idToken = "valid-google-id-token")
        val response = TokenResponse(accessToken = "access-token", refreshToken = "refresh-token")
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
        val request = mapOf("idToken" to "")

        mockMvc.post("/api/v1/auth/google") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
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
