package com.mandalateu.strategy.service

import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.dto.StrategyResponse
import com.mandalateu.strategy.dto.StrategyUpdateRequest
import com.mandalateu.strategy.repository.StrategyRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class StrategyService(
    private val strategyRepository: StrategyRepository,
    private val mandalartRepository: MandalartRepository
) {
    fun update(
        userId: Long,
        mandalartId: Long,
        strategyId: Long,
        request: StrategyUpdateRequest
    ): StrategyResponse {
        verifyOwnership(userId, mandalartId)

        val strategy = strategyRepository.findById(strategyId)
            .orElseThrow { EntityNotFoundException("전략을 찾을 수 없습니다.") }

        if (strategy.mandalart.id != mandalartId) {
            throw EntityNotFoundException("해당 만다라트의 전략을 찾을 수 없습니다.")
        }

        request.title?.let { strategy.title = it }
        request.color?.let { strategy.color = it }
        request.notes?.let { strategy.notes = it }

        return strategy.toResponse()
    }

    private fun verifyOwnership(userId: Long, mandalartId: Long) {
        val mandalart = mandalartRepository.findById(mandalartId)
            .orElseThrow { EntityNotFoundException("만다라트를 찾을 수 없습니다.") }
        if (mandalart.user.id != userId) throw ForbiddenException("접근 권한이 없습니다.")
    }

    private fun com.mandalateu.strategy.domain.Strategy.toResponse() = StrategyResponse(
        id = id,
        position = position,
        title = title,
        color = color,
        notes = notes
    )
}
