package com.mandalateu.auth.service

import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.auth.oauth.GoogleTokenVerifier
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val jwtProvider: JwtProvider,
    private val googleTokenVerifier: GoogleTokenVerifier
) {
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

        return TokenResponse(
            accessToken = jwtProvider.generateAccessToken(user.id),
            refreshToken = jwtProvider.generateRefreshToken(user.id)
        )
    }

    fun refresh(request: RefreshRequest): TokenResponse {
        if (!jwtProvider.validateToken(request.refreshToken) || !jwtProvider.isRefreshToken(request.refreshToken)) {
            throw IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.")
        }
        val userId = jwtProvider.getUserIdFromToken(request.refreshToken)
        return TokenResponse(
            accessToken = jwtProvider.generateAccessToken(userId),
            refreshToken = jwtProvider.generateRefreshToken(userId)
        )
    }
}