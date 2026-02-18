package com.mandalateu.strategy.dto

data class StrategyResponse(
    val id: Long,
    val position: Int,
    val title: String,
    val color: String?,
    val notes: String?
)
