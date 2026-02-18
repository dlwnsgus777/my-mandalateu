package com.mandalateu.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SignupRequest(
    @field:NotBlank @field:Email
    val email: String,

    @field:NotBlank @field:Size(min = 8, max = 100)
    val password: String,

    @field:NotBlank @field:Size(min = 2, max = 50)
    val nickname: String
)
