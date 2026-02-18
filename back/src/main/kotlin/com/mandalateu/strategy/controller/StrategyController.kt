package com.mandalateu.strategy.controller

import com.mandalateu.strategy.dto.StrategyResponse
import com.mandalateu.strategy.dto.StrategyUpdateRequest
import com.mandalateu.strategy.service.StrategyService
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/mandalarts/{mandalartId}/strategies")
class StrategyController(
    private val strategyService: StrategyService
) {
    private val Authentication.userId: Long get() = principal as Long

    @PatchMapping("/{strategyId}")
    fun update(
        authentication: Authentication,
        @PathVariable mandalartId: Long,
        @PathVariable strategyId: Long,
        @RequestBody request: StrategyUpdateRequest
    ): StrategyResponse = strategyService.update(authentication.userId, mandalartId, strategyId, request)
}
