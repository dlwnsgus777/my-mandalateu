package com.mandalateu.actionitem.repository

import com.mandalateu.actionitem.domain.ActionItem
import org.springframework.data.jpa.repository.JpaRepository

interface ActionItemRepository : JpaRepository<ActionItem, Long> {
    fun findAllByStrategyId(strategyId: Long): List<ActionItem>
    fun findAllByStrategyIdIn(strategyIds: List<Long>): List<ActionItem>
    fun findAllByStrategyIdInAndCompletedTrue(strategyIds: List<Long>): List<ActionItem>
    fun findAllByStrategyIdInAndDeadlineIsNotNull(strategyIds: List<Long>): List<ActionItem>
    fun deleteAllByStrategyIdIn(strategyIds: List<Long>)
    fun findAllByStrategyIdInAndCompletedAtBetween(
        strategyIds: List<Long>,
        start: java.time.LocalDateTime,
        end: java.time.LocalDateTime
    ): List<ActionItem>
}
