package com.mandalateu.auth.service

import com.mandalateu.auth.dto.LoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.security.crypto.password.PasswordEncoder

@ExtendWith(MockitoExtension::class)
class AuthServiceTest {

    @Mock lateinit var userRepository: UserRepository
    @Mock lateinit var jwtProvider: JwtProvider
    @Mock lateinit var passwordEncoder: PasswordEncoder

    @InjectMocks lateinit var authService: AuthService

    private val testUser = User(
        id = 1L,
        email = "test@test.com",
        password = "hashed_password",
        nickname = "테스터"
    )

    // ───────────── signup ─────────────

    @Test
    fun `signup - 새 유저를 등록하고 SignupResponse를 반환한다`() {
        val request = SignupRequest(email = "new@test.com", password = "password123", nickname = "신규유저")
        given(userRepository.findByEmail("new@test.com")).willReturn(null)
        given(passwordEncoder.encode("password123")).willReturn("hashed")
        given(userRepository.save(any())).willReturn(testUser)

        val response = authService.signup(request)

        assertThat(response.id).isEqualTo(testUser.id)
        assertThat(response.email).isEqualTo(testUser.email)
        assertThat(response.nickname).isEqualTo(testUser.nickname)
        verify(passwordEncoder).encode("password123")
        verify(userRepository).save(any())
    }

    @Test
    fun `signup - 이미 존재하는 이메일이면 예외가 발생한다`() {
        val request = SignupRequest(email = "test@test.com", password = "password123", nickname = "중복유저")
        given(userRepository.findByEmail("test@test.com")).willReturn(testUser)

        assertThrows<IllegalStateException> {
            authService.signup(request)
        }
        verify(userRepository, never()).save(any())
    }

    // ───────────── login ─────────────

    @Test
    fun `login - 올바른 자격증명으로 토큰을 반환한다`() {
        val request = LoginRequest(email = "test@test.com", password = "password123")
        given(userRepository.findByEmail("test@test.com")).willReturn(testUser)
        given(passwordEncoder.matches("password123", "hashed_password")).willReturn(true)
        given(jwtProvider.generateAccessToken(1L)).willReturn("access-token")
        given(jwtProvider.generateRefreshToken(1L)).willReturn("refresh-token")

        val response = authService.login(request)

        assertThat(response.accessToken).isEqualTo("access-token")
        assertThat(response.refreshToken).isEqualTo("refresh-token")
        assertThat(response.tokenType).isEqualTo("Bearer")
    }

    @Test
    fun `login - 존재하지 않는 이메일이면 예외가 발생한다`() {
        val request = LoginRequest(email = "notexist@test.com", password = "password123")
        given(userRepository.findByEmail("notexist@test.com")).willReturn(null)

        assertThrows<IllegalArgumentException> {
            authService.login(request)
        }
    }

    @Test
    fun `login - 비밀번호가 틀리면 예외가 발생한다`() {
        val request = LoginRequest(email = "test@test.com", password = "wrong_password")
        given(userRepository.findByEmail("test@test.com")).willReturn(testUser)
        given(passwordEncoder.matches("wrong_password", "hashed_password")).willReturn(false)

        assertThrows<IllegalArgumentException> {
            authService.login(request)
        }
    }

    // ───────────── refresh ─────────────

    @Test
    fun `refresh - 유효한 리프레시 토큰으로 새 토큰을 반환한다`() {
        val request = RefreshRequest(refreshToken = "valid-refresh-token")
        given(jwtProvider.validateToken("valid-refresh-token")).willReturn(true)
        given(jwtProvider.isRefreshToken("valid-refresh-token")).willReturn(true)
        given(jwtProvider.getUserIdFromToken("valid-refresh-token")).willReturn(1L)
        given(jwtProvider.generateAccessToken(1L)).willReturn("new-access-token")
        given(jwtProvider.generateRefreshToken(1L)).willReturn("new-refresh-token")

        val response = authService.refresh(request)

        assertThat(response.accessToken).isEqualTo("new-access-token")
        assertThat(response.refreshToken).isEqualTo("new-refresh-token")
    }

    @Test
    fun `refresh - 유효하지 않은 토큰이면 예외가 발생한다`() {
        val request = RefreshRequest(refreshToken = "invalid-token")
        given(jwtProvider.validateToken("invalid-token")).willReturn(false)

        assertThrows<IllegalArgumentException> {
            authService.refresh(request)
        }
    }

    @Test
    fun `refresh - 액세스 토큰을 리프레시 토큰으로 사용하면 예외가 발생한다`() {
        val request = RefreshRequest(refreshToken = "access-token-used-as-refresh")
        given(jwtProvider.validateToken("access-token-used-as-refresh")).willReturn(true)
        given(jwtProvider.isRefreshToken("access-token-used-as-refresh")).willReturn(false)

        assertThrows<IllegalArgumentException> {
            authService.refresh(request)
        }
    }
}
