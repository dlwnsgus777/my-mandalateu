package com.mandalateu.strategy.repository

import com.mandalateu.strategy.domain.Strategy
import org.springframework.data.jpa.repository.JpaRepository

interface StrategyRepository : JpaRepository<Strategy, Long> {
    fun findAllByMandalartId(mandalartId: Long): List<Strategy>
}
