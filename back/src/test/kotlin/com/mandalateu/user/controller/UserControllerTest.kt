package com.mandalateu.user.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.mandalateu.auth.dto.UserInfo
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.user.dto.UpdateNicknameRequest
import com.mandalateu.user.service.UserService
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
import org.springframework.test.web.servlet.patch

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired lateinit var mockMvc: MockMvc
    @Autowired lateinit var objectMapper: ObjectMapper
    @Autowired lateinit var jwtProvider: JwtProvider

    @MockitoBean
    lateinit var userService: UserService

    private lateinit var accessToken: String

    @BeforeEach
    fun setUp() {
        accessToken = jwtProvider.generateAccessToken(1L)
    }

    @Test
    fun `updateMe - 정상 요청이면 200과 UserInfo를 반환한다`() {
        val request = UpdateNicknameRequest(nickname = "새닉네임")
        val response = UserInfo(id = 1L, email = "test@test.com", nickname = "새닉네임")
        given(userService.updateNickname(any(), any())).willReturn(response)

        mockMvc.patch("/api/v1/users/me") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isOk() }
            jsonPath("$.nickname") { value("새닉네임") }
            jsonPath("$.email") { value("test@test.com") }
            jsonPath("$.id") { value(1) }
        }
    }

    @Test
    fun `updateMe - nickname이 빈 값이면 400을 반환한다`() {
        mockMvc.patch("/api/v1/users/me") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("nickname" to ""))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `updateMe - nickname이 50자를 초과하면 400을 반환한다`() {
        val longNickname = "a".repeat(51)
        mockMvc.patch("/api/v1/users/me") {
            header("Authorization", "Bearer $accessToken")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("nickname" to longNickname))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `updateMe - 인증 없이 요청하면 401을 반환한다`() {
        mockMvc.patch("/api/v1/users/me") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(mapOf("nickname" to "닉네임"))
        }.andExpect {
            status { isUnauthorized() }
        }
    }
}
