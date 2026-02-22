package com.mandalateu.auth.service

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.auth.oauth.GoogleTokenVerifier
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired lateinit var authService: AuthService
    @Autowired lateinit var userRepository: UserRepository
    @Autowired lateinit var jwtProvider: JwtProvider

    @MockitoBean
    lateinit var googleTokenVerifier: GoogleTokenVerifier

    private fun makePayload(sub: String = "google-sub-001", email: String = "test@test.com", name: String = "테스터"): GoogleIdToken.Payload {
        val payload = GoogleIdToken.Payload()
        payload.subject = sub
        payload.email = email
        payload["name"] = name
        return payload
    }

    private fun makeUser(email: String = "test@test.com", providerId: String = "google-sub-001") =
        User(email = email, nickname = "테스터", provider = "google", providerId = providerId)

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }

    // ───────────── loginWithGoogle ─────────────

    @Test
    fun `loginWithGoogle - 신규 유저면 DB에 저장 후 토큰을 발급한다`() {
        given(googleTokenVerifier.verify(any())).willReturn(makePayload())

        val response = authService.loginWithGoogle(GoogleLoginRequest(idToken = "valid-token"))

        assertThat(response.accessToken).isNotBlank()
        assertThat(response.refreshToken).isNotBlank()
        assertThat(response.tokenType).isEqualTo("Bearer")
        assertThat(userRepository.findByProviderAndProviderId("google", "google-sub-001")).isNotNull()
    }

    @Test
    fun `loginWithGoogle - 기존 유저면 새로 저장하지 않고 토큰을 발급한다`() {
        userRepository.save(makeUser())
        given(googleTokenVerifier.verify(any())).willReturn(makePayload())

        authService.loginWithGoogle(GoogleLoginRequest(idToken = "valid-token"))

        assertThat(userRepository.findAll()).hasSize(1)
    }

    @Test
    fun `loginWithGoogle - 발급된 액세스 토큰에서 userId를 추출할 수 있다`() {
        val saved = userRepository.save(makeUser())
        given(googleTokenVerifier.verify(any())).willReturn(makePayload())

        val response = authService.loginWithGoogle(GoogleLoginRequest(idToken = "valid-token"))

        assertThat(jwtProvider.getUserIdFromToken(response.accessToken)).isEqualTo(saved.id)
    }

    @Test
    fun `loginWithGoogle - 유효하지 않은 Google 토큰이면 예외가 발생한다`() {
        given(googleTokenVerifier.verify(any())).willReturn(null)

        assertThrows<IllegalArgumentException> {
            authService.loginWithGoogle(GoogleLoginRequest(idToken = "invalid-token"))
        }
    }

    @Test
    fun `loginWithGoogle - name 클레임이 없으면 이메일 앞부분을 닉네임으로 사용한다`() {
        val payload = GoogleIdToken.Payload()
        payload.subject = "google-sub-001"
        payload.email = "user@gmail.com"
        given(googleTokenVerifier.verify(any())).willReturn(payload)

        authService.loginWithGoogle(GoogleLoginRequest(idToken = "valid-token"))

        val saved = userRepository.findByProviderAndProviderId("google", "google-sub-001")
        assertThat(saved!!.nickname).isEqualTo("user")
    }

    // ───────────── refresh ─────────────

    @Test
    fun `refresh - 유효한 리프레시 토큰으로 새 토큰을 발급받는다`() {
        val saved = userRepository.save(makeUser())
        val refreshToken = jwtProvider.generateRefreshToken(saved.id)

        val response = authService.refresh(RefreshRequest(refreshToken))

        assertThat(response.accessToken).isNotBlank()
        assertThat(response.refreshToken).isNotBlank()
        assertThat(jwtProvider.isAccessToken(response.accessToken)).isTrue()
        assertThat(jwtProvider.isRefreshToken(response.refreshToken)).isTrue()
    }

    @Test
    fun `refresh - 재발급된 토큰에서 동일한 userId를 추출할 수 있다`() {
        val saved = userRepository.save(makeUser())
        val refreshToken = jwtProvider.generateRefreshToken(saved.id)

        val response = authService.refresh(RefreshRequest(refreshToken))

        assertThat(jwtProvider.getUserIdFromToken(response.accessToken)).isEqualTo(saved.id)
    }

    @Test
    fun `refresh - 유효하지 않은 토큰이면 예외가 발생한다`() {
        assertThrows<IllegalArgumentException> {
            authService.refresh(RefreshRequest("invalid.token.here"))
        }
    }

    @Test
    fun `refresh - 액세스 토큰을 리프레시에 사용하면 예외가 발생한다`() {
        val saved = userRepository.save(makeUser())
        val accessToken = jwtProvider.generateAccessToken(saved.id)

        assertThrows<IllegalArgumentException> {
            authService.refresh(RefreshRequest(accessToken))
        }
    }
}
