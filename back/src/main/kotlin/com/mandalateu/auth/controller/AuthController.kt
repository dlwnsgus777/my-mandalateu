package com.mandalateu.auth.controller

import com.mandalateu.auth.dto.LoginRequest
import com.mandalateu.auth.dto.RefreshRequest
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.dto.SignupResponse
import com.mandalateu.auth.dto.TokenResponse
import com.mandalateu.auth.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    fun signup(@RequestBody @Valid request: SignupRequest): SignupResponse =
        authService.signup(request)

    @PostMapping("/login")
    fun login(@RequestBody @Valid request: LoginRequest): TokenResponse =
        authService.login(request)

    @PostMapping("/refresh")
    fun refresh(@RequestBody @Valid request: RefreshRequest): TokenResponse =
        authService.refresh(request)
}
