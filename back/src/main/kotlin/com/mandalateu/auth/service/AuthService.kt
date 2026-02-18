package com.mandalateu.auth.service

import com.mandalateu.auth.dto.LoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.dto.SignupResponse
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.jwt.JwtProvider
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val jwtProvider: JwtProvider,
    private val passwordEncoder: PasswordEncoder
) {
    fun signup(request: SignupRequest): SignupResponse {
        if (userRepository.findByEmail(request.email) != null) {
            throw IllegalStateException("이미 사용 중인 이메일입니다: ${request.email}")
        }
        val user = userRepository.save(
            User(
                email = request.email,
                password = passwordEncoder.encode(request.password),
                nickname = request.nickname
            )
        )
        return SignupResponse(id = user.id, email = user.email, nickname = user.nickname)
    }

    fun login(request: LoginRequest): TokenResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.")

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.")
        }
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
