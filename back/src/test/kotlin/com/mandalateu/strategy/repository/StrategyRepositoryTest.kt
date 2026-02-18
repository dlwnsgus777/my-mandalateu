package com.mandalateu.strategy.repository

import com.mandalateu.mandalart.domain.Mandalart
import com.mandalateu.mandalart.repository.MandalartRepository
import com.mandalateu.strategy.domain.Strategy
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class StrategyRepositoryTest {

    @Autowired
    lateinit var strategyRepository: StrategyRepository

    @Autowired
    lateinit var mandalartRepository: MandalartRepository

    @Autowired
    lateinit var userRepository: UserRepository

    private lateinit var mandalartA: Mandalart
    private lateinit var mandalartB: Mandalart

    @BeforeEach
    fun setUp() {
        strategyRepository.deleteAll()
        mandalartRepository.deleteAll()
        userRepository.deleteAll()

        val user = userRepository.save(User(email = "user@test.com", password = "pw", nickname = "유저"))
        mandalartA = mandalartRepository.save(Mandalart(user = user, title = "만다라트A"))
        mandalartB = mandalartRepository.save(Mandalart(user = user, title = "만다라트B"))
    }

    @Test
    fun `findAllByMandalartId - 해당 만다라트의 전략 목록을 반환한다`() {
        strategyRepository.save(Strategy(mandalart = mandalartA, position = 0, title = "전략0"))
        strategyRepository.save(Strategy(mandalart = mandalartA, position = 1, title = "전략1"))
        strategyRepository.save(Strategy(mandalart = mandalartA, position = 4, title = "핵심목표"))

        val result = strategyRepository.findAllByMandalartId(mandalartA.id)

        assertThat(result).hasSize(3)
        assertThat(result.map { it.position }).containsExactlyInAnyOrder(0, 1, 4)
    }

    @Test
    fun `findAllByMandalartId - 전략이 없으면 빈 리스트를 반환한다`() {
        val result = strategyRepository.findAllByMandalartId(mandalartA.id)

        assertThat(result).isEmpty()
    }

    @Test
    fun `findAllByMandalartId - 다른 만다라트의 전략은 포함되지 않는다`() {
        strategyRepository.save(Strategy(mandalart = mandalartA, position = 0, title = "A의 전략"))
        strategyRepository.save(Strategy(mandalart = mandalartB, position = 0, title = "B의 전략"))

        val result = strategyRepository.findAllByMandalartId(mandalartA.id)

        assertThat(result).hasSize(1)
        assertThat(result[0].title).isEqualTo("A의 전략")
    }

    @Test
    fun `전략의 color와 notes는 nullable이다`() {
        val saved = strategyRepository.save(
            Strategy(mandalart = mandalartA, position = 0, title = "색상없음", color = null, notes = null)
        )

        assertThat(saved.color).isNull()
        assertThat(saved.notes).isNull()
    }
}
