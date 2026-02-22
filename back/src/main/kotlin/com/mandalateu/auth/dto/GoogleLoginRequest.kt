package com.mandalateu.auth.dto

import jakarta.validation.constraints.NotBlank

data class GoogleLoginRequest(
    @field:NotBlank val idToken: String
)