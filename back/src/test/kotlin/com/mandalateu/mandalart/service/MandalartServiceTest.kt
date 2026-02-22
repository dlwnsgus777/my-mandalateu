package com.mandalateu.mandalart.service

import com.mandalateu.actionitem.repository.ActionItemRepository
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.common.exception.ForbiddenException
import com.mandalateu.mandalart.dto.MandalartCreateRequest
import com.mandalateu.mandalart.dto.MandalartUpdateRequest
import com.mandalateu.mandalart.repository.MandalartRepository
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
class MandalartServiceTest {

    @Autowired lateinit var mandalartService: MandalartService
    @Autowired lateinit var userRepository: UserRepository
    @Autowired lateinit var mandalartRepository: MandalartRepository
    @Autowired lateinit var strategyRepository: StrategyRepository
    @Autowired lateinit var actionItemRepository: ActionItemRepository

    private var userAId: Long = 0L
    private var userBId: Long = 0L

    @BeforeEach
    fun setUp() {
        actionItemRepository.deleteAll()
        strategyRepository.deleteAll()
        mandalartRepository.deleteAll()
        userRepository.deleteAll()

        userAId = userRepository.save(User(email = "userA@test.com", nickname = "유저A", provider = "google", providerId = "sub-A")).id
        userBId = userRepository.save(User(email = "userB@test.com", nickname = "유저B", provider = "google", providerId = "sub-B")).id
    }

    // ───────────── create ─────────────

    @Test
    fun `create - 만다라트와 9개 전략, 81개 액션아이템이 생성된다`() {
        val request = MandalartCreateRequest(title = "내 목표", coreGoal = "핵심 목표")

        val response = mandalartService.create(userAId, request)

        assertThat(response.id).isGreaterThan(0)
        assertThat(response.title).isEqualTo("내 목표")
        assertThat(response.strategies).hasSize(9)
        assertThat(response.strategies.flatMap { it.actionItems }).hasSize(81)
    }

    @Test
    fun `create - 중앙 전략(position 4)의 제목이 coreGoal로 설정된다`() {
        val response = mandalartService.create(userAId, MandalartCreateRequest("목표", "핵심"))

        val centerStrategy = response.strategies.first { it.position == 4 }
        assertThat(centerStrategy.title).isEqualTo("핵심")
    }

    @Test
    fun `create - 각 전략의 중앙 액션아이템(position 4)은 isCenter가 true이다`() {
        val response = mandalartService.create(userAId, MandalartCreateRequest("목표", "핵심"))

        response.strategies.forEach { strategy ->
            val centerItem = strategy.actionItems.first { it.position == 4 }
            assertThat(centerItem.isCenter).isTrue()
            val others = strategy.actionItems.filter { it.position != 4 }
            assertThat(others).allMatch { !it.isCenter }
        }
    }

    @Test
    fun `create - 존재하지 않는 userId이면 예외가 발생한다`() {
        assertThrows<EntityNotFoundException> {
            mandalartService.create(99999L, MandalartCreateRequest("목표", "핵심"))
        }
    }

    // ───────────── getList ─────────────

    @Test
    fun `getList - 해당 유저의 만다라트 목록만 반환한다`() {
        mandalartService.create(userAId, MandalartCreateRequest("A목표1", "A핵심1"))
        mandalartService.create(userAId, MandalartCreateRequest("A목표2", "A핵심2"))
        mandalartService.create(userBId, MandalartCreateRequest("B목표", "B핵심"))

        val result = mandalartService.getList(userAId)

        assertThat(result).hasSize(2)
        assertThat(result.map { it.title }).containsExactlyInAnyOrder("A목표1", "A목표2")
    }

    @Test
    fun `getList - 만다라트가 없으면 빈 리스트를 반환한다`() {
        assertThat(mandalartService.getList(userAId)).isEmpty()
    }

    // ───────────── getDetail ─────────────

    @Test
    fun `getDetail - 만다라트의 전체 중첩 구조를 반환한다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("상세목표", "핵심"))

        val detail = mandalartService.getDetail(userAId, created.id)

        assertThat(detail.id).isEqualTo(created.id)
        assertThat(detail.title).isEqualTo("상세목표")
        assertThat(detail.strategies).hasSize(9)
        assertThat(detail.strategies.flatMap { it.actionItems }).hasSize(81)
    }

    @Test
    fun `getDetail - 다른 유저의 만다라트 조회 시 ForbiddenException이 발생한다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("A목표", "핵심"))

        assertThrows<ForbiddenException> {
            mandalartService.getDetail(userBId, created.id)
        }
    }

    @Test
    fun `getDetail - 존재하지 않는 만다라트 조회 시 EntityNotFoundException이 발생한다`() {
        assertThrows<EntityNotFoundException> {
            mandalartService.getDetail(userAId, 99999L)
        }
    }

    // ───────────── update ─────────────

    @Test
    fun `update - 제목이 정상적으로 수정된다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("원래제목", "핵심"))

        val updated = mandalartService.update(userAId, created.id, MandalartUpdateRequest(title = "새제목"))

        assertThat(updated.title).isEqualTo("새제목")
        assertThat(updated.updatedAt).isAfterOrEqualTo(updated.createdAt)
    }

    @Test
    fun `update - title이 null이면 기존 제목이 유지된다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("원래제목", "핵심"))

        val updated = mandalartService.update(userAId, created.id, MandalartUpdateRequest(title = null))

        assertThat(updated.title).isEqualTo("원래제목")
    }

    @Test
    fun `update - 다른 유저의 만다라트 수정 시 ForbiddenException이 발생한다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("A목표", "핵심"))

        assertThrows<ForbiddenException> {
            mandalartService.update(userBId, created.id, MandalartUpdateRequest("수정시도"))
        }
    }

    // ───────────── delete ─────────────

    @Test
    fun `delete - 만다라트와 연관된 전략, 액션아이템이 모두 삭제된다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("삭제목표", "핵심"))
        val strategyIds = strategyRepository.findAllByMandalartId(created.id).map { it.id }

        mandalartService.delete(userAId, created.id)

        assertThat(mandalartRepository.findById(created.id)).isEmpty
        strategyIds.forEach { id ->
            assertThat(strategyRepository.findById(id)).isEmpty
        }
        assertThat(actionItemRepository.findAllByStrategyIdIn(strategyIds)).isEmpty()
    }

    @Test
    fun `delete - 다른 유저의 만다라트 삭제 시 ForbiddenException이 발생한다`() {
        val created = mandalartService.create(userAId, MandalartCreateRequest("A목표", "핵심"))

        assertThrows<ForbiddenException> {
            mandalartService.delete(userBId, created.id)
        }
    }
}
