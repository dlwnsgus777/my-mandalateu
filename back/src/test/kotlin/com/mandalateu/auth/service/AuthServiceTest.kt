package com.mandalateu.auth.service

import com.mandalateu.auth.dto.LoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired lateinit var authService: AuthService
    @Autowired lateinit var userRepository: UserRepository
    @Autowired lateinit var jwtProvider: JwtProvider
    @Autowired lateinit var passwordEncoder: PasswordEncoder

    private val defaultSignupRequest = SignupRequest(
        email = "test@test.com",
        password = "password123",
        nickname = "테스터"
    )

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }

    // ───────────── signup ─────────────

    @Test
    fun `signup - 새 유저를 등록하고 DB에 저장된다`() {
        val response = authService.signup(defaultSignupRequest)

        assertThat(response.id).isGreaterThan(0)
        assertThat(response.email).isEqualTo(defaultSignupRequest.email)
        assertThat(response.nickname).isEqualTo(defaultSignupRequest.nickname)

        val savedUser = userRepository.findByEmail(defaultSignupRequest.email)
        assertThat(savedUser).isNotNull()
        assertThat(savedUser!!.nickname).isEqualTo(defaultSignupRequest.nickname)
    }

    @Test
    fun `signup - 비밀번호는 BCrypt로 해시되어 저장된다`() {
        authService.signup(defaultSignupRequest)

        val savedUser = userRepository.findByEmail(defaultSignupRequest.email)!!
        assertThat(savedUser.password).isNotEqualTo(defaultSignupRequest.password)
        assertThat(passwordEncoder.matches(defaultSignupRequest.password, savedUser.password)).isTrue()
    }

    @Test
    fun `signup - 중복 이메일로 가입 시 예외가 발생한다`() {
        authService.signup(defaultSignupRequest)

        assertThrows<IllegalStateException> {
            authService.signup(defaultSignupRequest)
        }
    }

    @Test
    fun `signup - 다른 이메일로는 중복 없이 가입된다`() {
        authService.signup(defaultSignupRequest)
        val anotherRequest = defaultSignupRequest.copy(email = "other@test.com", nickname = "다른유저")

        val response = authService.signup(anotherRequest)

        assertThat(response.email).isEqualTo("other@test.com")
        assertThat(userRepository.findAll()).hasSize(2)
    }

    // ───────────── login ─────────────

    @Test
    fun `login - 올바른 자격증명으로 유효한 토큰을 발급받는다`() {
        authService.signup(defaultSignupRequest)

        val response = authService.login(
            LoginRequest(email = defaultSignupRequest.email, password = defaultSignupRequest.password)
        )

        assertThat(response.accessToken).isNotBlank()
        assertThat(response.refreshToken).isNotBlank()
        assertThat(response.tokenType).isEqualTo("Bearer")
        assertThat(jwtProvider.isAccessToken(response.accessToken)).isTrue()
        assertThat(jwtProvider.isRefreshToken(response.refreshToken)).isTrue()
    }

    @Test
    fun `login - 발급된 액세스 토큰에서 userId를 추출할 수 있다`() {
        val signupResponse = authService.signup(defaultSignupRequest)
        val loginResponse = authService.login(
            LoginRequest(email = defaultSignupRequest.email, password = defaultSignupRequest.password)
        )

        val userIdFromToken = jwtProvider.getUserIdFromToken(loginResponse.accessToken)

        assertThat(userIdFromToken).isEqualTo(signupResponse.id)
    }

    @Test
    fun `login - 존재하지 않는 이메일이면 예외가 발생한다`() {
        assertThrows<IllegalArgumentException> {
            authService.login(LoginRequest(email = "notexist@test.com", password = "password123"))
        }
    }

    @Test
    fun `login - 비밀번호가 틀리면 예외가 발생한다`() {
        authService.signup(defaultSignupRequest)

        assertThrows<IllegalArgumentException> {
            authService.login(
                LoginRequest(email = defaultSignupRequest.email, password = "wrong_password")
            )
        }
    }

    // ───────────── refresh ─────────────

    @Test
    fun `refresh - 유효한 리프레시 토큰으로 새 토큰을 발급받는다`() {
        authService.signup(defaultSignupRequest)
        val loginResponse = authService.login(
            LoginRequest(email = defaultSignupRequest.email, password = defaultSignupRequest.password)
        )

        val refreshResponse = authService.refresh(RefreshRequest(loginResponse.refreshToken))

        assertThat(refreshResponse.accessToken).isNotBlank()
        assertThat(refreshResponse.refreshToken).isNotBlank()
        assertThat(jwtProvider.isAccessToken(refreshResponse.accessToken)).isTrue()
        assertThat(jwtProvider.isRefreshToken(refreshResponse.refreshToken)).isTrue()
    }

    @Test
    fun `refresh - 재발급된 토큰에서 동일한 userId를 추출할 수 있다`() {
        val signupResponse = authService.signup(defaultSignupRequest)
        val loginResponse = authService.login(
            LoginRequest(email = defaultSignupRequest.email, password = defaultSignupRequest.password)
        )

        val refreshResponse = authService.refresh(RefreshRequest(loginResponse.refreshToken))

        assertThat(jwtProvider.getUserIdFromToken(refreshResponse.accessToken)).isEqualTo(signupResponse.id)
    }

    @Test
    fun `refresh - 유효하지 않은 토큰이면 예외가 발생한다`() {
        assertThrows<IllegalArgumentException> {
            authService.refresh(RefreshRequest("invalid.token.here"))
        }
    }

    @Test
    fun `refresh - 액세스 토큰을 리프레시에 사용하면 예외가 발생한다`() {
        authService.signup(defaultSignupRequest)
        val loginResponse = authService.login(
            LoginRequest(email = defaultSignupRequest.email, password = defaultSignupRequest.password)
        )

        assertThrows<IllegalArgumentException> {
            authService.refresh(RefreshRequest(loginResponse.accessToken))
        }
    }
}
