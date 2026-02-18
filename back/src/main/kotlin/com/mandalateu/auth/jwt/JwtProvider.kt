package com.mandalateu.auth.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtProvider(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.access-token-expiry}") private val accessTokenExpiry: Long,
    @Value("\${jwt.refresh-token-expiry}") private val refreshTokenExpiry: Long
) {
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray(Charsets.UTF_8))
    }

    fun generateAccessToken(userId: Long): String = buildToken(userId, accessTokenExpiry, "access")

    fun generateRefreshToken(userId: Long): String = buildToken(userId, refreshTokenExpiry, "refresh")

    private fun buildToken(userId: Long, expiry: Long, type: String): String =
        Jwts.builder()
            .subject(userId.toString())
            .claim("type", type)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiry))
            .signWith(secretKey)
            .compact()

    fun validateToken(token: String): Boolean =
        runCatching { getClaims(token) }.isSuccess

    fun isAccessToken(token: String): Boolean =
        runCatching { getClaims(token).get("type", String::class.java) == "access" }.getOrDefault(false)

    fun isRefreshToken(token: String): Boolean =
        runCatching { getClaims(token).get("type", String::class.java) == "refresh" }.getOrDefault(false)

    fun getUserIdFromToken(token: String): Long =
        getClaims(token).subject.toLong()

    private fun getClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
}
