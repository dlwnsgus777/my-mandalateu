package com.mandalateu.user.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UpdateNicknameRequest(
    @field:NotBlank
    @field:Size(max = 50)
    val nickname: String
)
