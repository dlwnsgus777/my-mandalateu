package com.mandalateu.mandalart.service

import com.mandalateu.actionitem.domain.ActionItem
import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.domain.Mandalart
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.dto.MandalartResponse
import com.mandalateu.mandalart.dto.MandalartSummaryResponse
import com.mandalateu.mandalart.dto.MandalartUpdateRequest
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.domain.Strategy
import com.mandalateu.strategy.repository.StrategyRepository
import com.mandalateu.user.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class MandalartService(
    private val mandalartRepository: MandalartRepository,
    private val strategyRepository: StrategyRepository,
    private val actionItemRepository: ActionItemRepository,
    private val userRepository: UserRepository
) {
    @Transactional(readOnly = true)
    fun getList(userId: Long): List<MandalartSummaryResponse> =
        mandalartRepository.findAllByUserId(userId).map { it.toSummaryResponse() }

    fun create(userId: Long, request: MandalartCreateRequest): MandalartResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("사용자를 찾을 수 없습니다.") }

        val mandalart = mandalartRepository.save(Mandalart(user = user, title = request.title))

        val strategies = (0..8).map { position ->
            val title = if (position == 4) request.coreGoal else ""
            strategyRepository.save(Strategy(mandalart = mandalart, position = position, title = title))
        }

        val actionItems = strategies.flatMap { strategy ->
            (0..8).map { position ->
                val isCenter = position == 4
                actionItemRepository.save(
                    ActionItem(
                        strategy = strategy,
                        position = position,
                        isCenter = isCenter,
                        title = if (isCenter) strategy.title else ""
                    )
                )
            }
        }

        return buildResponse(mandalart, strategies, actionItems)
    }

    @Transactional(readOnly = true)
    fun getDetail(userId: Long, mandalartId: Long): MandalartResponse {
        val mandalart = getWithOwnerCheck(userId, mandalartId)
        return buildResponseFromDb(mandalart)
    }

    fun update(userId: Long, mandalartId: Long, request: MandalartUpdateRequest): MandalartResponse {
        val mandalart = getWithOwnerCheck(userId, mandalartId)
        request.title?.let {
            mandalart.title = it
            mandalart.updatedAt = LocalDateTime.now()
        }
        return buildResponseFromDb(mandalart)
    }

    fun delete(userId: Long, mandalartId: Long) {
        val mandalart = getWithOwnerCheck(userId, mandalartId)
        val strategies = strategyRepository.findAllByMandalartId(mandalartId)
        val strategyIds = strategies.map { it.id }
        if (strategyIds.isNotEmpty()) {
            actionItemRepository.deleteAllByStrategyIdIn(strategyIds)
            strategyRepository.deleteAll(strategies)
        }
        mandalartRepository.delete(mandalart)
    }

    private fun getWithOwnerCheck(userId: Long, mandalartId: Long): Mandalart {
        val mandalart = mandalartRepository.findById(mandalartId)
            .orElseThrow { EntityNotFoundException("만다라트를 찾을 수 없습니다.") }
        if (mandalart.user.id != userId) throw ForbiddenException("접근 권한이 없습니다.")
        return mandalart
    }

    private fun buildResponseFromDb(mandalart: Mandalart): MandalartResponse {
        val strategies = strategyRepository.findAllByMandalartId(mandalart.id)
        val actionItems = if (strategies.isEmpty()) emptyList()
        else actionItemRepository.findAllByStrategyIdIn(strategies.map { it.id })
        return buildResponse(mandalart, strategies, actionItems)
    }

    private fun buildResponse(
        mandalart: Mandalart,
        strategies: List<Strategy>,
        actionItems: List<ActionItem>
    ): MandalartResponse {
        val itemsByStrategyId = actionItems.groupBy { it.strategy.id }
        return MandalartResponse(
            id = mandalart.id,
            title = mandalart.title,
            createdAt = mandalart.createdAt,
            updatedAt = mandalart.updatedAt,
            strategies = strategies.sortedBy { it.position }.map { strategy ->
                MandalartResponse.StrategyDto(
                    id = strategy.id,
                    position = strategy.position,
                    title = strategy.title,
                    color = strategy.color,
                    notes = strategy.notes,
                    actionItems = (itemsByStrategyId[strategy.id] ?: emptyList())
                        .sortedBy { it.position }
                        .map { item ->
                            MandalartResponse.ActionItemDto(
                                id = item.id,
                                position = item.position,
                                isCenter = item.isCenter,
                                title = item.title,
                                description = item.description,
                                completed = item.completed,
                                completedAt = item.completedAt,
                                deadline = item.deadline,
                                priority = item.priority?.name
                            )
                        }
                )
            }
        )
    }

    private fun Mandalart.toSummaryResponse() = MandalartSummaryResponse(
        id = id,
        title = title,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
