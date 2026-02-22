package com.mandalateu.user.repository

import com.mandalateu.user.domain.User
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.dao.DataIntegrityViolationException
import org.junit.jupiter.api.assertThrows

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    lateinit var userRepository: UserRepository

    private fun makeUser(email: String = "test@test.com", providerId: String = "google-sub-001") =
        User(email = email, nickname = "테스터", provider = "google", providerId = providerId)

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }

    @Test
    fun `save 시 id가 자동 생성된다`() {
        val user = userRepository.save(makeUser())

        assertThat(user.id).isGreaterThan(0)
        assertThat(user.createdAt).isNotNull()
    }

    @Test
    fun `findByEmail - 이메일이 존재하면 User를 반환한다`() {
        val saved = userRepository.save(makeUser(email = "find@test.com"))

        val found = userRepository.findByEmail("find@test.com")

        assertThat(found).isNotNull
        assertThat(found!!.id).isEqualTo(saved.id)
        assertThat(found.email).isEqualTo("find@test.com")
        assertThat(found.nickname).isEqualTo("테스터")
    }

    @Test
    fun `findByEmail - 존재하지 않는 이메일이면 null을 반환한다`() {
        val found = userRepository.findByEmail("notexist@test.com")

        assertThat(found).isNull()
    }

    @Test
    fun `findByProviderAndProviderId - 존재하는 계정이면 User를 반환한다`() {
        val saved = userRepository.save(makeUser(providerId = "google-sub-123"))

        val found = userRepository.findByProviderAndProviderId("google", "google-sub-123")

        assertThat(found).isNotNull
        assertThat(found!!.id).isEqualTo(saved.id)
    }

    @Test
    fun `findByProviderAndProviderId - 존재하지 않으면 null을 반환한다`() {
        val found = userRepository.findByProviderAndProviderId("google", "nonexistent-sub")

        assertThat(found).isNull()
    }

    @Test
    fun `중복된 이메일로 저장하면 예외가 발생한다`() {
        userRepository.save(makeUser(email = "dup@test.com", providerId = "sub-1"))

        assertThrows<DataIntegrityViolationException> {
            userRepository.saveAndFlush(makeUser(email = "dup@test.com", providerId = "sub-2"))
        }
    }
}
