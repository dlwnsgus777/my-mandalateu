package com.mandalateu.strategy.service

import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.service.MandalartService
import com.mandalateu.strategy.dto.StrategyUpdateRequest
import com.mandalateu.strategy.repository.StrategyRepository
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class StrategyServiceTest {

    @Autowired lateinit var strategyService: StrategyService
    @Autowired lateinit var mandalartService: MandalartService
    @Autowired lateinit var strategyRepository: StrategyRepository
    @Autowired lateinit var userRepository: UserRepository

    private var userId: Long = 0L
    private var otherUserId: Long = 0L
    private var mandalartId: Long = 0L
    private var strategyId: Long = 0L    // position 0 전략

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
        userId = userRepository.save(User(email = "owner@test.com", nickname = "소유자", provider = "google", providerId = "sub-owner")).id
        otherUserId = userRepository.save(User(email = "other@test.com", nickname = "다른유저", provider = "google", providerId = "sub-other")).id

        val mandalart = mandalartService.create(userId, MandalartCreateRequest("목표", "핵심"))
        mandalartId = mandalart.id
        strategyId = mandalart.strategies.first { it.position == 0 }.id
    }

    // ───────────── update ─────────────

    @Test
    fun `update - 전략 제목이 수정된다`() {
        val response = strategyService.update(
            userId, mandalartId, strategyId,
            StrategyUpdateRequest(title = "새 전략 제목", color = null, notes = null)
        )

        assertThat(response.title).isEqualTo("새 전략 제목")

        val saved = strategyRepository.findById(strategyId).get()
        assertThat(saved.title).isEqualTo("새 전략 제목")
    }

    @Test
    fun `update - 색상과 노트가 수정된다`() {
        val response = strategyService.update(
            userId, mandalartId, strategyId,
            StrategyUpdateRequest(title = null, color = "#FF0000", notes = "메모 내용")
        )

        assertThat(response.color).isEqualTo("#FF0000")
        assertThat(response.notes).isEqualTo("메모 내용")
    }

    @Test
    fun `update - null 필드는 기존 값을 유지한다`() {
        // 초기 값 설정
        strategyService.update(userId, mandalartId, strategyId,
            StrategyUpdateRequest(title = "원래 제목", color = "#AABBCC", notes = "원래 메모"))

        // title만 변경 (color, notes는 null → 변경 없음)
        val response = strategyService.update(userId, mandalartId, strategyId,
            StrategyUpdateRequest(title = "새 제목", color = null, notes = null))

        assertThat(response.title).isEqualTo("새 제목")
        assertThat(response.color).isEqualTo("#AABBCC")
        assertThat(response.notes).isEqualTo("원래 메모")
    }

    @Test
    fun `update - 다른 유저의 만다라트 전략 수정 시 ForbiddenException이 발생한다`() {
        assertThrows<ForbiddenException> {
            strategyService.update(otherUserId, mandalartId, strategyId,
                StrategyUpdateRequest(title = "침범", color = null, notes = null))
        }
    }

    @Test
    fun `update - 존재하지 않는 만다라트이면 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            strategyService.update(userId, 99999L, strategyId,
                StrategyUpdateRequest(title = "제목", color = null, notes = null))
        }
    }

    @Test
    fun `update - 존재하지 않는 전략이면 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            strategyService.update(userId, mandalartId, 99999L,
                StrategyUpdateRequest(title = "제목", color = null, notes = null))
        }
    }

    @Test
    fun `update - 다른 만다라트의 전략 ID를 사용하면 EntityNotFoundException이 발생한다`() {
        val otherMandalart = mandalartService.create(userId, MandalartCreateRequest("다른 목표", "다른 핵심"))
        val otherStrategyId = otherMandalart.strategies.first { it.position == 0 }.id

        assertThrows<EntityNotFoundException> {
            strategyService.update(userId, mandalartId, otherStrategyId,
                StrategyUpdateRequest(title = "제목", color = null, notes = null))
        }
    }
}
