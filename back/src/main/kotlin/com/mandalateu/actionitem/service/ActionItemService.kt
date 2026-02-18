package com.mandalateu.actionitem.service

import com.mandalateu.actionitem.dto.ActionItemResponse
import com.mandalateu.actionitem.dto.ActionItemUpdateRequest
import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.repository.StrategyRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class ActionItemService(
    private val actionItemRepository: ActionItemRepository,
    private val strategyRepository: StrategyRepository,
    private val mandalartRepository: MandalartRepository
) {
    fun update(
        userId: Long,
        mandalartId: Long,
        strategyId: Long,
        actionItemId: Long,
        request: ActionItemUpdateRequest
    ): ActionItemResponse {
        verifyOwnership(userId, mandalartId)

        val strategy = strategyRepository.findById(strategyId)
            .orElseThrow { EntityNotFoundException("전략을 찾을 수 없습니다.") }

        if (strategy.mandalart.id != mandalartId) {
            throw EntityNotFoundException("해당 만다라트의 전략을 찾을 수 없습니다.")
        }

        val actionItem = actionItemRepository.findById(actionItemId)
            .orElseThrow { EntityNotFoundException("액션아이템을 찾을 수 없습니다.") }

        if (actionItem.strategy.id != strategyId) {
            throw EntityNotFoundException("해당 전략의 액션아이템을 찾을 수 없습니다.")
        }

        request.title?.let { actionItem.title = it }
        request.description?.let { actionItem.description = it }
        request.deadline?.let { actionItem.deadline = it }
        request.priority?.let { actionItem.priority = it }
        request.completed?.let { completed ->
            actionItem.completed = completed
            actionItem.completedAt = if (completed) LocalDateTime.now() else null
        }

        return actionItem.toResponse()
    }

    private fun verifyOwnership(userId: Long, mandalartId: Long) {
        val mandalart = mandalartRepository.findById(mandalartId)
            .orElseThrow { EntityNotFoundException("만다라트를 찾을 수 없습니다.") }
        if (mandalart.user.id != userId) throw ForbiddenException("접근 권한이 없습니다.")
    }

    private fun com.mandalateu.actionitem.domain.ActionItem.toResponse() = ActionItemResponse(
        id = id,
        position = position,
        isCenter = isCenter,
        title = title,
        description = description,
        completed = completed,
        completedAt = completedAt,
        deadline = deadline,
        priority = priority?.name
    )
}
