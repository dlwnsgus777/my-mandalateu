package com.mandalateu.mandalart.dto

import jakarta.validation.constraints.NotBlank

data class MandalartCreateRequest(
    @field:NotBlank
    val title: String,

    @field:NotBlank
    val coreGoal: String
)
