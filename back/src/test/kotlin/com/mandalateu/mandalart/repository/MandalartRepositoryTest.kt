package com.mandalateu.mandalart.repository

import com.mandalateu.mandalart.domain.Mandalart
import com.mandalateu.user.domain.User
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest

@DataJpaTest
class MandalartRepositoryTest {

    @Autowired
    lateinit var mandalartRepository: MandalartRepository

    @Autowired
    lateinit var userRepository: UserRepository

    private lateinit var userA: User
    private lateinit var userB: User

    @BeforeEach
    fun setUp() {
        mandalartRepository.deleteAll()
        userRepository.deleteAll()

        userA = userRepository.save(User(email = "userA@test.com", password = "pw", nickname = "유저A"))
        userB = userRepository.save(User(email = "userB@test.com", password = "pw", nickname = "유저B"))
    }

    @Test
    fun `findAllByUserId - 해당 유저의 만다라트 목록을 반환한다`() {
        mandalartRepository.save(Mandalart(user = userA, title = "목표1"))
        mandalartRepository.save(Mandalart(user = userA, title = "목표2"))

        val result = mandalartRepository.findAllByUserId(userA.id)

        assertThat(result).hasSize(2)
        assertThat(result.map { it.title }).containsExactlyInAnyOrder("목표1", "목표2")
    }

    @Test
    fun `findAllByUserId - 만다라트가 없는 유저는 빈 리스트를 반환한다`() {
        val result = mandalartRepository.findAllByUserId(userA.id)

        assertThat(result).isEmpty()
    }

    @Test
    fun `findAllByUserId - 다른 유저의 만다라트는 포함되지 않는다`() {
        mandalartRepository.save(Mandalart(user = userA, title = "유저A 목표"))
        mandalartRepository.save(Mandalart(user = userB, title = "유저B 목표"))

        val result = mandalartRepository.findAllByUserId(userA.id)

        assertThat(result).hasSize(1)
        assertThat(result[0].title).isEqualTo("유저A 목표")
    }

    @Test
    fun `save 시 createdAt과 updatedAt이 자동 설정된다`() {
        val saved = mandalartRepository.save(Mandalart(user = userA, title = "테스트"))

        assertThat(saved.createdAt).isNotNull()
        assertThat(saved.updatedAt).isNotNull()
    }
}
