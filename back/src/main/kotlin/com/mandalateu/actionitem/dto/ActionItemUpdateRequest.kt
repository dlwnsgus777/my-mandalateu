package com.mandalateu.actionitem.dto

import com.mandalateu.actionitem.domain.Priority
import java.time.LocalDate

data class ActionItemUpdateRequest(
    val title: String?,
    val description: String?,
    val completed: Boolean?,
    val deadline: LocalDate?,
    val priority: Priority?
)
