package com.mandalateu.actionitem.repository

import com.mandalateu.actionitem.domain.ActionItem
import com.mandalateu.actionitem.domain.Priority
import com.mandalateu.mandalart.domain.Mandalart
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.domain.Strategy
import com.mandalateu.strategy.repository.StrategyRepository
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import java.time.LocalDate
import java.time.LocalDateTime

@DataJpaTest
class ActionItemRepositoryTest {

    @Autowired
    lateinit var actionItemRepository: ActionItemRepository

    @Autowired
    lateinit var strategyRepository: StrategyRepository

    @Autowired
    lateinit var mandalartRepository: MandalartRepository

    @Autowired
    lateinit var userRepository: UserRepository

    private lateinit var strategyA: Strategy
    private lateinit var strategyB: Strategy

    @BeforeEach
    fun setUp() {
        actionItemRepository.deleteAll()
        strategyRepository.deleteAll()
        mandalartRepository.deleteAll()
        userRepository.deleteAll()

        val user = userRepository.save(User(email = "user@test.com", password = "pw", nickname = "유저"))
        val mandalart = mandalartRepository.save(Mandalart(user = user, title = "만다라트"))
        strategyA = strategyRepository.save(Strategy(mandalart = mandalart, position = 0, title = "전략A"))
        strategyB = strategyRepository.save(Strategy(mandalart = mandalart, position = 1, title = "전략B"))
    }

    @Test
    fun `findAllByStrategyId - 해당 전략의 액션아이템 목록을 반환한다`() {
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 0, title = "아이템0"))
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 1, title = "아이템1"))

        val result = actionItemRepository.findAllByStrategyId(strategyA.id)

        assertThat(result).hasSize(2)
        assertThat(result.map { it.title }).containsExactlyInAnyOrder("아이템0", "아이템1")
    }

    @Test
    fun `findAllByStrategyIdInAndCompletedTrue - 완료된 액션아이템만 반환한다`() {
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 0, title = "미완료", completed = false))
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 1, title = "완료", completed = true, completedAt = LocalDateTime.now()))
        actionItemRepository.save(ActionItem(strategy = strategyB, position = 0, title = "B완료", completed = true, completedAt = LocalDateTime.now()))

        val result = actionItemRepository.findAllByStrategyIdInAndCompletedTrue(
            listOf(strategyA.id, strategyB.id)
        )

        assertThat(result).hasSize(2)
        assertThat(result.all { it.completed }).isTrue()
        assertThat(result.map { it.title }).containsExactlyInAnyOrder("완료", "B완료")
    }

    @Test
    fun `findAllByStrategyIdInAndCompletedTrue - 지정되지 않은 전략의 아이템은 포함되지 않는다`() {
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 0, title = "A완료", completed = true, completedAt = LocalDateTime.now()))
        actionItemRepository.save(ActionItem(strategy = strategyB, position = 0, title = "B완료", completed = true, completedAt = LocalDateTime.now()))

        val result = actionItemRepository.findAllByStrategyIdInAndCompletedTrue(listOf(strategyA.id))

        assertThat(result).hasSize(1)
        assertThat(result[0].title).isEqualTo("A완료")
    }

    @Test
    fun `findAllByStrategyIdInAndDeadlineIsNotNull - 마감일이 있는 액션아이템만 반환한다`() {
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 0, title = "마감없음", deadline = null))
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 1, title = "마감있음", deadline = LocalDate.now().plusDays(3)))
        actionItemRepository.save(ActionItem(strategy = strategyB, position = 0, title = "B마감있음", deadline = LocalDate.now().plusDays(7)))

        val result = actionItemRepository.findAllByStrategyIdInAndDeadlineIsNotNull(
            listOf(strategyA.id, strategyB.id)
        )

        assertThat(result).hasSize(2)
        assertThat(result.all { it.deadline != null }).isTrue()
        assertThat(result.map { it.title }).containsExactlyInAnyOrder("마감있음", "B마감있음")
    }

    @Test
    fun `액션아이템의 priority와 description은 nullable이다`() {
        val saved = actionItemRepository.save(
            ActionItem(strategy = strategyA, position = 0, title = "우선순위없음", priority = null, description = null)
        )

        assertThat(saved.priority).isNull()
        assertThat(saved.description).isNull()
    }

    @Test
    fun `Priority enum이 정상적으로 저장되고 조회된다`() {
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 0, title = "HIGH", priority = Priority.HIGH))
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 1, title = "MEDIUM", priority = Priority.MEDIUM))
        actionItemRepository.save(ActionItem(strategy = strategyA, position = 2, title = "LOW", priority = Priority.LOW))

        val result = actionItemRepository.findAllByStrategyId(strategyA.id)

        assertThat(result.map { it.priority }).containsExactlyInAnyOrder(Priority.HIGH, Priority.MEDIUM, Priority.LOW)
    }
}
