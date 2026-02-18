package com.mandalateu.auth.jwt

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class JwtProviderTest {

    private lateinit var jwtProvider: JwtProvider

    @BeforeEach
    fun setUp() {
        jwtProvider = JwtProvider(
            secret = "test-secret-key-must-be-at-least-32-bytes!!",
            accessTokenExpiry = 3600000L,   // 1시간
            refreshTokenExpiry = 604800000L  // 7일
        )
    }

    @Test
    fun `generateAccessToken - 유효한 액세스 토큰을 생성한다`() {
        val token = jwtProvider.generateAccessToken(1L)

        assertThat(token).isNotBlank()
        assertThat(jwtProvider.validateToken(token)).isTrue()
        assertThat(jwtProvider.isAccessToken(token)).isTrue()
        assertThat(jwtProvider.isRefreshToken(token)).isFalse()
    }

    @Test
    fun `generateRefreshToken - 유효한 리프레시 토큰을 생성한다`() {
        val token = jwtProvider.generateRefreshToken(1L)

        assertThat(token).isNotBlank()
        assertThat(jwtProvider.validateToken(token)).isTrue()
        assertThat(jwtProvider.isRefreshToken(token)).isTrue()
        assertThat(jwtProvider.isAccessToken(token)).isFalse()
    }

    @Test
    fun `getUserIdFromToken - 토큰에서 userId를 추출한다`() {
        val userId = 42L
        val accessToken = jwtProvider.generateAccessToken(userId)
        val refreshToken = jwtProvider.generateRefreshToken(userId)

        assertThat(jwtProvider.getUserIdFromToken(accessToken)).isEqualTo(userId)
        assertThat(jwtProvider.getUserIdFromToken(refreshToken)).isEqualTo(userId)
    }

    @Test
    fun `validateToken - 유효하지 않은 토큰이면 false를 반환한다`() {
        assertThat(jwtProvider.validateToken("invalid.token.string")).isFalse()
        assertThat(jwtProvider.validateToken("")).isFalse()
    }

    @Test
    fun `validateToken - 만료된 토큰이면 false를 반환한다`() {
        val expiredProvider = JwtProvider(
            secret = "test-secret-key-must-be-at-least-32-bytes!!",
            accessTokenExpiry = 1L,  // 1ms - 즉시 만료
            refreshTokenExpiry = 1L
        )
        val token = expiredProvider.generateAccessToken(1L)
        Thread.sleep(10) // 만료 대기

        assertThat(expiredProvider.validateToken(token)).isFalse()
    }

    @Test
    fun `validateToken - 다른 secret으로 서명된 토큰이면 false를 반환한다`() {
        val otherProvider = JwtProvider(
            secret = "other-secret-key-must-be-at-least-32-bytes!!",
            accessTokenExpiry = 3600000L,
            refreshTokenExpiry = 604800000L
        )
        val tokenFromOther = otherProvider.generateAccessToken(1L)

        assertThat(jwtProvider.validateToken(tokenFromOther)).isFalse()
    }
}
