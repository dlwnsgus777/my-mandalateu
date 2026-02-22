package com.mandalateu.auth.controller

import com.mandalateu.auth.dto.GoogleLoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.service.AuthService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {
    @PostMapping("/google")
    fun googleLogin(@RequestBody @Valid request: GoogleLoginRequest): TokenResponse =
        authService.loginWithGoogle(request)

    @PostMapping("/refresh")
    fun refresh(@RequestBody @Valid request: RefreshRequest): TokenResponse =
        authService.refresh(request)
}