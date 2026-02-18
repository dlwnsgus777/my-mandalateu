package com.mandalateu.actionitem.controller

import com.mandalateu.actionitem.dto.ActionItemResponse
import com.mandalateu.actionitem.dto.ActionItemUpdateRequest
import com.mandalateu.actionitem.service.ActionItemService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/mandalarts/{mandalartId}/strategies/{strategyId}/action-items")
class ActionItemController(
    private val actionItemService: ActionItemService
) {
    private val Authentication.userId: Long get() = principal as Long

    @PatchMapping("/{actionItemId}")
    fun update(
        authentication: Authentication,
        @PathVariable mandalartId: Long,
        @PathVariable strategyId: Long,
        @PathVariable actionItemId: Long,
        @RequestBody request: ActionItemUpdateRequest
    ): ActionItemResponse = actionItemService.update(
        authentication.userId, mandalartId, strategyId, actionItemId, request
    )
}
