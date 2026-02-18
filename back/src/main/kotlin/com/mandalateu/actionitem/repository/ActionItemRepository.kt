package com.mandalateu.actionitem.repository

import com.mandalateu.actionitem.domain.ActionItem
import org.springframework.data.jpa.repository.JpaRepository

interface ActionItemRepository : JpaRepository<ActionItem, Long> {
    fun findAllByStrategyId(strategyId: Long): List<ActionItem>
    fun findAllByStrategyIdInAndCompletedTrue(strategyIds: List<Long>): List<ActionItem>
    fun findAllByStrategyIdInAndDeadlineIsNotNull(strategyIds: List<Long>): List<ActionItem>
}
