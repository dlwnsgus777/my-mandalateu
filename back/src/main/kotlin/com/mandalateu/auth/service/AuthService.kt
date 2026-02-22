package com.mandalateu.auth.service

import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.dto.UserInfo
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.auth.oauth.GoogleTokenVerifier
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val jwtProvider: JwtProvider,
    private val googleTokenVerifier: GoogleTokenVerifier
) {
    @Transactional
    fun loginWithGoogle(request: GoogleLoginRequest): TokenResponse {
        val payload = googleTokenVerifier.verify(request.idToken)
            ?: throw IllegalArgumentException("유효하지 않은 Google 토큰입니다.")

        val email = payload.email
        val nickname = (payload["name"] as? String) ?: email.substringBefore("@")
        val providerId = payload.subject

        val user = userRepository.findByProviderAndProviderId("google", providerId)
            ?: userRepository.save(
                User(
                    email = email,
                    nickname = nickname,
                    provider = "google",
                    providerId = providerId
                )
            )

        val accessToken = jwtProvider.generateAccessToken(user.id)
        val refreshToken = jwtProvider.generateRefreshToken(user.id)
        user.refreshToken = refreshToken

        return TokenResponse(
            accessToken = accessToken,
            refreshToken = refreshToken,
            user = UserInfo(id = user.id, email = user.email, nickname = user.nickname)
        )
    }

    @Transactional
    fun refresh(request: RefreshRequest): TokenResponse {
        if (!jwtProvider.validateToken(request.refreshToken) || !jwtProvider.isRefreshToken(request.refreshToken)) {
            throw IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.")
        }

        val userId = jwtProvider.getUserIdFromToken(request.refreshToken)
        val user = userRepository.findById(userId).orElseThrow {
            EntityNotFoundException("사용자를 찾을 수 없습니다.")
        }

        if (user.refreshToken != request.refreshToken) {
            throw IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.")
        }

        val newAccessToken = jwtProvider.generateAccessToken(userId)
        val newRefreshToken = jwtProvider.generateRefreshToken(userId)
        user.refreshToken = newRefreshToken

        return TokenResponse(
            accessToken = newAccessToken,
            refreshToken = newRefreshToken,
            user = UserInfo(id = user.id, email = user.email, nickname = user.nickname)
        )
    }

    @Transactional
    fun logout(userId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            EntityNotFoundException("사용자를 찾을 수 없습니다.")
        }
        user.refreshToken = null
    }
}
