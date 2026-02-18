package com.mandalateu.actionitem.service

import com.mandalateu.actionitem.domain.Priority
import com.mandalateu.actionitem.dto.ActionItemUpdateRequest
import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.auth.dto.SignupRequest
import com.mandalateu.auth.service.AuthService
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.service.MandalartService
import com.mandalateu.strategy.repository.StrategyRepository
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@SpringBootTest
@Transactional
class ActionItemServiceTest {

    @Autowired lateinit var actionItemService: ActionItemService
    @Autowired lateinit var authService: AuthService
    @Autowired lateinit var mandalartService: MandalartService
    @Autowired lateinit var strategyRepository: StrategyRepository
    @Autowired lateinit var actionItemRepository: ActionItemRepository
    @Autowired lateinit var userRepository: UserRepository

    private var userId: Long = 0L
    private var otherUserId: Long = 0L
    private var mandalartId: Long = 0L
    private var strategyId: Long = 0L
    private var actionItemId: Long = 0L  // position 0, isCenter = false

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
        userId = authService.signup(SignupRequest("owner@test.com", "password123", "소유자")).id
        otherUserId = authService.signup(SignupRequest("other@test.com", "password123", "다른유저")).id

        val mandalart = mandalartService.create(userId, MandalartCreateRequest("목표", "핵심"))
        mandalartId = mandalart.id

        val strategy = mandalart.strategies.first { it.position == 0 }
        strategyId = strategy.id
        actionItemId = strategy.actionItems.first { it.position == 0 }.id
    }

    // ───────────── update 기본 필드 ─────────────

    @Test
    fun `update - 제목과 설명이 수정된다`() {
        val response = actionItemService.update(
            userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(title = "새 제목", description = "상세 설명", completed = null, deadline = null, priority = null)
        )

        assertThat(response.title).isEqualTo("새 제목")
        assertThat(response.description).isEqualTo("상세 설명")

        val saved = actionItemRepository.findById(actionItemId).get()
        assertThat(saved.title).isEqualTo("새 제목")
    }

    @Test
    fun `update - 마감일과 우선순위가 수정된다`() {
        val deadline = LocalDate.now().plusDays(7)
        val response = actionItemService.update(
            userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(title = null, description = null, completed = null, deadline = deadline, priority = Priority.HIGH)
        )

        assertThat(response.deadline).isEqualTo(deadline)
        assertThat(response.priority).isEqualTo("HIGH")
    }

    @Test
    fun `update - null 필드는 기존 값을 유지한다`() {
        actionItemService.update(userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest("원래 제목", "원래 설명", null, null, null))

        val response = actionItemService.update(userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(title = null, description = null, completed = null, deadline = null, priority = null))

        assertThat(response.title).isEqualTo("원래 제목")
        assertThat(response.description).isEqualTo("원래 설명")
    }

    // ───────────── completed 처리 ─────────────

    @Test
    fun `update - completed=true로 변경하면 completedAt이 자동 설정된다`() {
        val response = actionItemService.update(
            userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(null, null, completed = true, null, null)
        )

        assertThat(response.completed).isTrue()
        assertThat(response.completedAt).isNotNull()
    }

    @Test
    fun `update - completed=false로 변경하면 completedAt이 null로 초기화된다`() {
        // 먼저 완료 처리
        actionItemService.update(userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(null, null, completed = true, null, null))

        // 미완료로 되돌리기
        val response = actionItemService.update(userId, mandalartId, strategyId, actionItemId,
            ActionItemUpdateRequest(null, null, completed = false, null, null))

        assertThat(response.completed).isFalse()
        assertThat(response.completedAt).isNull()
    }

    // ───────────── 소유자 검증 ─────────────

    @Test
    fun `update - 다른 유저의 만다라트 액션아이템 수정 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            actionItemService.update(otherUserId, mandalartId, strategyId, actionItemId,
                ActionItemUpdateRequest("침범", null, null, null, null))
        }
    }

    @Test
    fun `update - 존재하지 않는 만다라트이면 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            actionItemService.update(userId, 99999L, strategyId, actionItemId,
                ActionItemUpdateRequest("제목", null, null, null, null))
        }
    }

    @Test
    fun `update - 존재하지 않는 전략이면 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            actionItemService.update(userId, mandalartId, 99999L, actionItemId,
                ActionItemUpdateRequest("제목", null, null, null, null))
        }
    }

    @Test
    fun `update - 존재하지 않는 액션아이템이면 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            actionItemService.update(userId, mandalartId, strategyId, 99999L,
                ActionItemUpdateRequest("제목", null, null, null, null))
        }
    }

    @Test
    fun `update - 다른 전략의 액션아이템 ID를 사용하면 EntityNotFoundException이 발생한다`() {
        val otherStrategyId = strategyRepository.findAllByMandalartId(mandalartId)
            .first { it.position == 1 }.id
        val otherActionItemId = actionItemRepository.findAllByStrategyId(otherStrategyId)
            .first { it.position == 0 }.id

        assertThrows<EntityNotFoundException> {
            actionItemService.update(userId, mandalartId, strategyId, otherActionItemId,
                ActionItemUpdateRequest("제목", null, null, null, null))
        }
    }
}
