package com.mandalateu.user.service

import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.user.domain.User
import com.mandalateu.user.dto.UpdateNicknameRequest
import com.mandalateu.user.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.given
import java.util.Optional

@ExtendWith(MockitoExtension::class)
class UserServiceTest {

    @Mock
    lateinit var userRepository: UserRepository

    @InjectMocks
    lateinit var userService: UserService

    @Test
    fun `updateNickname - 정상 요청이면 닉네임을 변경하고 UserInfo를 반환한다`() {
        val user = User(id = 1L, email = "test@test.com", nickname = "기존닉네임", provider = "google", providerId = "sub-001")
        given(userRepository.findById(1L)).willReturn(Optional.of(user))

        val result = userService.updateNickname(1L, UpdateNicknameRequest("새닉네임"))

        assertThat(result.nickname).isEqualTo("새닉네임")
        assertThat(result.email).isEqualTo("test@test.com")
        assertThat(result.id).isEqualTo(1L)
        assertThat(user.nickname).isEqualTo("새닉네임")
    }

    @Test
    fun `updateNickname - 존재하지 않는 사용자면 EntityNotFoundException을 던진다`() {
        given(userRepository.findById(999L)).willReturn(Optional.empty())

        assertThrows<EntityNotFoundException> {
            userService.updateNickname(999L, UpdateNicknameRequest("닉네임"))
        }
    }
}
