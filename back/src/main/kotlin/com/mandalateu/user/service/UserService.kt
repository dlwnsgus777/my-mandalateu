package com.mandalateu.user.service

import com.mandalateu.auth.dto.UserInfo
import com.mandalateu.common.exception.EntityNotFoundException
import com.mandalateu.user.dto.UpdateNicknameRequest
import com.mandalateu.user.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository
) {
    @Transactional
    fun updateNickname(userId: Long, request: UpdateNicknameRequest): UserInfo {
        val user = userRepository.findById(userId).orElseThrow {
            EntityNotFoundException("사용자를 찾을 수 없습니다.")
        }
        user.nickname = request.nickname
        return UserInfo(id = user.id, email = user.email, nickname = user.nickname)
    }
}
