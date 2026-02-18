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

    @BeforeEach
    fun setUp() {
        userRepository.deleteAll()
    }

    @Test
    fun `save 시 id가 자동 생성된다`() {
        val user = userRepository.save(User(email = "test@test.com", password = "hashed_pw", nickname = "테스터"))

        assertThat(user.id).isGreaterThan(0)
        assertThat(user.createdAt).isNotNull()
    }

    @Test
    fun `findByEmail - 이메일이 존재하면 User를 반환한다`() {
        val saved = userRepository.save(User(email = "find@test.com", password = "pw", nickname = "닉네임"))

        val found = userRepository.findByEmail("find@test.com")

        assertThat(found).isNotNull
        assertThat(found!!.id).isEqualTo(saved.id)
        assertThat(found.email).isEqualTo("find@test.com")
        assertThat(found.nickname).isEqualTo("닉네임")
    }

    @Test
    fun `findByEmail - 존재하지 않는 이메일이면 null을 반환한다`() {
        val found = userRepository.findByEmail("notexist@test.com")

        assertThat(found).isNull()
    }

    @Test
    fun `중복된 이메일로 저장하면 예외가 발생한다`() {
        userRepository.save(User(email = "dup@test.com", password = "pw1", nickname = "첫번째"))

        assertThrows<DataIntegrityViolationException> {
            userRepository.saveAndFlush(User(email = "dup@test.com", password = "pw2", nickname = "두번째"))
        }
    }
}
